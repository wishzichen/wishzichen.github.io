(function recordsStaticMockApi() {
    const ACTIVITY_OPTIONS = [
        { key: "walk", label: "步行", source: "static-demo" },
        { key: "run", label: "跑步", source: "static-demo" }
    ];

    const DISPLAY_GEOMETRY_PAYLOAD = {
        status: "ok",
        geometry: {
            body_order: [],
            bodies: {},
            mesh_count: 0,
            missing_mesh_files: []
        }
    };

    const runtime = {
        currentActivity: "walk",
        statusLog: [],
        clipCache: new Map(),
        realtime: {
            mode: "idle",
            activityKey: "walk",
            speed: 1.2,
            direction: 0,
            distance: 0,
            duration: 0,
            stepCount: 0,
            stepRemainder: 0,
            startedAt: 0,
            lastTickAt: Date.now()
        },
        control: {
            position: { x: 0, y: 0, z: 0 },
            rotation: 0,
            speed: 1.2,
            mode: "walk",
            moving: false,
            direction: "idle"
        }
    };

    const nativeFetch = typeof window.fetch === "function" ? window.fetch.bind(window) : null;
    window.recordsStaticMockState = runtime;

    pushStatus("静态演示模式已启用", "success");
    pushStatus("records 页面已接管 /api 请求", "info");

    window.fetch = async function mockedFetch(input, init) {
        const request = normalizeRequest(input, init);
        if (!request.path.startsWith("/api")) {
            if (!nativeFetch) {
                throw new Error("Native fetch is not available in this runtime.");
            }
            return nativeFetch(input, init);
        }
        return handleApiRequest(request);
    };

    async function handleApiRequest(request) {
        const { path, method, searchParams, bodyText } = request;

        if (path === "/api/activity" && method === "GET") {
            return jsonResponse({
                status: "ok",
                current: findActivity(runtime.currentActivity),
                options: ACTIVITY_OPTIONS
            });
        }

        if (path === "/api/activity" && method === "POST") {
            const payload = readJsonBody(bodyText);
            runtime.currentActivity = sanitizeActivity(payload.activity || runtime.currentActivity);
            pushStatus(`已切换到${findActivity(runtime.currentActivity).label}模式`, "info");
            return jsonResponse({
                status: "ok",
                current: findActivity(runtime.currentActivity),
                options: ACTIVITY_OPTIONS
            });
        }

        if (path === "/api/display-geometry" && method === "GET") {
            return jsonResponse(DISPLAY_GEOMETRY_PAYLOAD);
        }

        if (path === "/api/health" && method === "GET") {
            return jsonResponse({
                status: "ok",
                model_ready: true,
                error: null,
                current_activity: runtime.currentActivity,
                gaitdynamics_dir: "static-demo",
                opensim_models_dir: "static-demo",
                display_geometry_ready: true,
                display_mesh_count: 0,
                missing_mesh_files: [],
                cached_activities: Array.from(runtime.clipCache.keys()),
                loading_activity: null,
                options: ACTIVITY_OPTIONS,
                status_log: runtime.statusLog.slice(0, 8),
                timestamp: formatDateTime(new Date())
            });
        }

        if (path === "/api/clip" && method === "GET") {
            const activityKey = sanitizeActivity(searchParams.get("activity") || runtime.currentActivity);
            const speed = clampNumber(parseFloat(searchParams.get("speed") || ""), 0.5, 5.0, defaultSpeed(activityKey));
            const duration = clampNumber(parseFloat(searchParams.get("duration") || ""), 10, 60, 30);
            runtime.currentActivity = activityKey;
            const clip = generateClip(activityKey, speed, duration);
            pushStatus(`${findActivity(activityKey).label}片段已生成`, "success");
            return jsonResponse({
                status: "ok",
                activity: findActivity(activityKey),
                options: ACTIVITY_OPTIONS,
                clip
            });
        }

        if (path === "/api/data" && method === "GET") {
            const clip = generateClip(runtime.currentActivity, defaultSpeed(runtime.currentActivity), 30);
            return jsonResponse({
                status: "ok",
                activity: findActivity(runtime.currentActivity),
                metrics: clip.metrics,
                frame: clip.frames[0]
            });
        }

        if (path === "/api/realtime/config" && method === "GET") {
            return jsonResponse({
                status: "ok",
                options: [
                    { key: "walk", label: "步行", default_speed: 1.2 },
                    { key: "run", label: "跑步", default_speed: 3.0 }
                ],
                limits: {
                    speed: { min: 0.5, max: 5.0, step: 0.1 },
                    direction: { min: 0, max: 360, step: 5 }
                }
            });
        }

        if (path === "/api/realtime/state" && method === "GET") {
            return jsonResponse(buildRealtimeSnapshot());
        }

        if (path === "/api/realtime/control" && method === "POST") {
            const payload = readJsonBody(bodyText);
            return jsonResponse({
                status: "ok",
                state: handleRealtimeCommand(payload)
            });
        }

        if (path === "/api/realtime/health" && method === "GET") {
            const state = buildRealtimeSnapshot();
            return jsonResponse({
                status: "ok",
                service: "static-realtime-monitor",
                mode: state.mode,
                speed: state.speed,
                direction: state.direction,
                step_count: state.step_count,
                distance_m: state.distance,
                uptime_sec: state.duration,
                status_log: state.status_log,
                timestamp: state.timestamp
            });
        }

        if (path === "/api/state" && method === "GET") {
            return jsonResponse({
                status: "ok",
                state: buildControlSnapshot()
            });
        }

        if (path === "/api/control" && method === "POST") {
            const payload = readJsonBody(bodyText);
            return jsonResponse({
                status: "ok",
                state: handleControlCommand(payload)
            });
        }

        return jsonResponse({
            status: "error",
            message: `Unsupported endpoint: ${method} ${path}`
        }, 404);
    }

    function generateClip(activityKey, speedMps, durationSec) {
        const cacheKey = `${activityKey}|${speedMps.toFixed(1)}|${Math.round(durationSec)}`;
        const cached = runtime.clipCache.get(cacheKey);
        if (cached) {
            return cloneData(cached);
        }

        const preset = getActivityPreset(activityKey, speedMps);
        const frameRate = 24;
        const frameCount = Math.max(Math.round(durationSec * frameRate), frameRate * 6);
        const frames = [];

        for (let index = 0; index < frameCount; index += 1) {
            const timeSec = index / frameRate;
            frames.push(buildFrame(index, timeSec, preset));
        }

        const clip = {
            activity: findActivity(activityKey),
            frame_rate: frameRate,
            display_frame_rate: frameRate,
            duration_sec: preset.cycleDurationSec,
            unique_duration_sec: durationSec,
            playback_duration_sec: durationSec,
            unique_playback_duration_sec: durationSec,
            playback_rate: 1,
            frame_count: frameCount,
            generated_at: formatDateTime(new Date()),
            metrics: buildLiveMetrics(preset, 0),
            frames
        };

        runtime.clipCache.set(cacheKey, cloneData(clip));
        return clip;
    }

    function buildFrame(index, timeSec, preset) {
        const basePhase = (timeSec / preset.cycleDurationSec) % 1;
        const pelvis = {
            x_cm: Math.sin(basePhase * Math.PI * 2) * preset.pelvisSwayCm,
            y_cm: preset.pelvisHeightCm + Math.sin(basePhase * Math.PI * 4) * preset.verticalBobCm,
            z_cm: Math.sin(basePhase * Math.PI * 2) * 1.5
        };

        const right = buildLegPose("right", basePhase, preset, pelvis);
        const left = buildLegPose("left", (basePhase + 0.5) % 1, preset, pelvis);

        return {
            index,
            joints: [
                [pelvis.x_cm, pelvis.y_cm, pelvis.z_cm],
                [right.hip.x, right.hip.y, right.hip.z],
                [right.knee.x, right.knee.y, right.knee.z],
                [right.ankle.x, right.ankle.y, right.ankle.z],
                [right.heel.x, right.heel.y, right.heel.z],
                [right.toe.x, right.toe.y, right.toe.z],
                [left.hip.x, left.hip.y, left.hip.z],
                [left.knee.x, left.knee.y, left.knee.z],
                [left.ankle.x, left.ankle.y, left.ankle.z],
                [left.heel.x, left.heel.y, left.heel.z],
                [left.toe.x, left.toe.y, left.toe.z]
            ],
            pelvis,
            metrics: buildLiveMetrics(preset, basePhase),
            left: left.legState,
            right: right.legState,
            segments: {}
        };
    }

    function buildLegPose(side, phase, preset, pelvis) {
        const isLeft = side === "left";
        const lateral = isLeft ? 10 : -10;
        const isStance = phase < preset.stanceRatio;
        const stanceProgress = isStance ? phase / preset.stanceRatio : 0;
        const swingProgress = isStance ? 0 : (phase - preset.stanceRatio) / (1 - preset.stanceRatio);

        const hip = {
            x: lateral,
            y: pelvis.y_cm - 3.2,
            z: pelvis.z_cm + (isLeft ? 0.8 : -0.8)
        };

        let footTravel = 0;
        let heelLift = 0.3;
        let toeLift = 0.3;
        let clearance = 0;
        let contact = { heel: 0, arch: 0, ball: 0, toe: 0 };

        if (isStance) {
            footTravel = lerp(preset.stepArcCm * 0.5, -preset.stepArcCm * 0.5, stanceProgress);
            heelLift = stanceProgress > 0.78 ? (stanceProgress - 0.78) / 0.22 * 2.5 : 0.18;
            toeLift = stanceProgress < 0.14 ? (1 - stanceProgress / 0.14) * 1.8 : 0.16;
            contact = buildStanceContact(stanceProgress);
        } else {
            footTravel = lerp(-preset.stepArcCm * 0.5, preset.stepArcCm * 0.5, swingProgress);
            clearance = Math.pow(Math.sin(Math.PI * swingProgress), 1.35) * preset.swingClearanceCm;
            heelLift = 0.8 + clearance * 0.4;
            toeLift = 1.2 + clearance * 0.75;
            contact = { heel: 0.02, arch: 0.02, ball: 0.03, toe: 0.02 };
        }

        const heel = {
            x: lateral,
            y: heelLift,
            z: pelvis.z_cm + footTravel - 6.2
        };
        const toe = {
            x: lateral,
            y: toeLift,
            z: pelvis.z_cm + footTravel + 8.8
        };
        const ankle = {
            x: lateral,
            y: Math.max((heel.y + toe.y) * 0.5 + 5.9, 6.0 + clearance * 0.35),
            z: pelvis.z_cm + footTravel + 0.8
        };
        const knee = solveKneePoint(hip, ankle, preset.thighLengthCm, preset.shankLengthCm);

        const footPitchDeg = Math.atan2(toe.y - heel.y, toe.z - heel.z + 1e-6) * 180 / Math.PI;
        const hipAngleDeg = (preset.hipAmplitudeDeg * Math.sin(phase * Math.PI * 2)) + (isStance ? -2 : 2.5);
        const kneeAngleDeg = isStance
            ? 10 + 18 * Math.sin(Math.PI * stanceProgress) * Math.sin(Math.PI * stanceProgress)
            : 24 + preset.kneeAmplitudeDeg * Math.pow(Math.sin(Math.PI * swingProgress), 2);
        const ankleAngleDeg = isStance
            ? -8 + 18 * stanceProgress
            : -3 + preset.ankleAmplitudeDeg * Math.sin(Math.PI * swingProgress);
        const rearLoad = Math.max(contact.heel, contact.arch);
        const foreLoad = Math.max(contact.ball, contact.toe);
        const pressure = buildPressureArray(contact, side);
        const phaseLabel = resolvePhaseLabel(preset.activityKey, phase, preset.stanceRatio);

        return {
            hip,
            knee,
            ankle,
            heel,
            toe,
            legState: {
                phase_label_cn: phaseLabel.label,
                phase_group: phaseLabel.group,
                stance: isStance ? 0.58 + 0.3 * Math.sin(Math.PI * stanceProgress) : 0.08 + 0.12 * Math.sin(Math.PI * swingProgress),
                is_contact: isStance,
                hip_angle_deg: hipAngleDeg,
                knee_angle_deg: kneeAngleDeg,
                ankle_angle_deg: ankleAngleDeg,
                foot_pitch_deg: footPitchDeg,
                foot_speed_mps: Math.abs(preset.gaitSpeedMps * (isStance ? 0.54 : 1.08)),
                clearance_cm: Math.max(0, clearance),
                force_vy: isStance ? 0.42 + 0.88 * Math.max(rearLoad, foreLoad) : 0.08 + clearance * 0.02,
                cop_progress: isStance ? stanceProgress : 1,
                rear_load: rearLoad,
                fore_load: foreLoad,
                contact,
                pressure,
                pressure_mean: average(pressure)
            }
        };
    }

    function buildLiveMetrics(preset, phase) {
        return {
            step_frequency: round(preset.stepFrequencySpm + Math.sin(phase * Math.PI * 4) * 1.8, 1),
            stride_length: round(preset.strideLengthCm + Math.sin(phase * Math.PI * 2) * 0.9, 1),
            gait_speed: round(preset.gaitSpeedMps + Math.cos(phase * Math.PI * 2) * 0.03, 2),
            symmetry: round(preset.symmetry + Math.sin(phase * Math.PI * 2) * 0.008, 3),
            stability: round(preset.stability + Math.cos(phase * Math.PI * 2) * 0.01, 3),
            cycle_duration_sec: round(preset.cycleDurationSec, 2),
            flight_ratio: round(preset.flightRatio, 3),
            double_support_ratio: round(preset.doubleSupportRatio, 3)
        };
    }

    function buildRealtimeSnapshot() {
        advanceRealtimeRuntime();

        const activityKey = runtime.realtime.activityKey;
        const speed = runtime.realtime.speed;
        const preset = getActivityPreset(activityKey, speed);
        const timeSec = runtime.realtime.mode === "idle"
            ? 0
            : (Date.now() - runtime.realtime.startedAt) / 1000;
        const frame = buildFrame(0, timeSec, preset);
        const metrics = buildLiveMetrics(preset, (timeSec / preset.cycleDurationSec) % 1);

        return {
            status: "ok",
            mode: runtime.realtime.mode,
            activity: findActivity(activityKey),
            speed: runtime.realtime.speed,
            direction: runtime.realtime.direction,
            step_count: Math.floor(runtime.realtime.stepCount),
            distance: round(runtime.realtime.distance, 1),
            duration: round(runtime.realtime.duration, 1),
            timestamp: formatDateTime(new Date()),
            status_log: runtime.statusLog.slice(0, 8),
            metrics: {
                step_frequency: metrics.step_frequency,
                stride_length: metrics.stride_length,
                gait_speed: metrics.gait_speed,
                symmetry: metrics.symmetry,
                stability: metrics.stability,
                heart_rate: Math.round(activityKey === "run" ? 132 + speed * 9 : 76 + speed * 11),
                cycle_duration_sec: metrics.cycle_duration_sec,
                stance_ratio: preset.stanceRatio,
                flight_ratio: metrics.flight_ratio
            },
            left_leg: {
                phase: frame.left.phase_group === "stance" ? "stance" : "swing",
                hip_angle: frame.left.hip_angle_deg,
                knee_angle: frame.left.knee_angle_deg,
                ankle_angle: frame.left.ankle_angle_deg,
                force: frame.left.force_vy,
                clearance_cm: frame.left.clearance_cm,
                foot_speed_mps: frame.left.foot_speed_mps
            },
            right_leg: {
                phase: frame.right.phase_group === "stance" ? "stance" : "swing",
                hip_angle: frame.right.hip_angle_deg,
                knee_angle: frame.right.knee_angle_deg,
                ankle_angle: frame.right.ankle_angle_deg,
                force: frame.right.force_vy,
                clearance_cm: frame.right.clearance_cm,
                foot_speed_mps: frame.right.foot_speed_mps
            }
        };
    }

    function handleRealtimeCommand(payload) {
        const command = String(payload.command || "");
        advanceRealtimeRuntime();

        if (command === "start_walk") {
            runtime.realtime.activityKey = "walk";
            runtime.realtime.mode = "walking";
            runtime.realtime.speed = clampNumber(Number(payload.speed), 0.5, 5.0, 1.2);
            runtime.realtime.startedAt = Date.now();
            pushStatus("实时监测已切换到步行模式", "success");
        } else if (command === "start_run") {
            runtime.realtime.activityKey = "run";
            runtime.realtime.mode = "running";
            runtime.realtime.speed = clampNumber(Number(payload.speed), 0.5, 5.0, 3.0);
            runtime.realtime.startedAt = Date.now();
            pushStatus("实时监测已切换到跑步模式", "success");
        } else if (command === "stop") {
            runtime.realtime.mode = "idle";
            pushStatus("实时监测已暂停", "warning");
        } else if (command === "reset") {
            runtime.realtime.mode = "idle";
            runtime.realtime.distance = 0;
            runtime.realtime.duration = 0;
            runtime.realtime.stepCount = 0;
            runtime.realtime.stepRemainder = 0;
            runtime.realtime.startedAt = 0;
            pushStatus("实时监测状态已重置", "info");
        } else if (command === "set_speed") {
            runtime.realtime.speed = clampNumber(Number(payload.speed), 0.5, 5.0, runtime.realtime.speed);
            pushStatus(`实时速度设为 ${runtime.realtime.speed.toFixed(1)} m/s`, "info");
        } else if (command === "set_direction") {
            runtime.realtime.direction = clampNumber(Number(payload.direction), 0, 360, runtime.realtime.direction);
        }

        return buildRealtimeSnapshot();
    }

    function buildControlSnapshot() {
        return cloneData(runtime.control);
    }

    function handleControlCommand(payload) {
        const command = String(payload.command || "");
        const control = runtime.control;

        if (command === "set_speed") {
            control.speed = clampNumber(Number(payload.speed), 0.5, 5.0, control.speed);
        } else if (command === "set_mode") {
            control.mode = payload.mode === "run" ? "run" : "walk";
        } else if (command === "reset") {
            control.position = { x: 0, y: 0, z: 0 };
            control.rotation = 0;
            control.moving = false;
            control.direction = "idle";
        } else if (command === "left") {
            control.rotation = wrapAngle(control.rotation - 15);
            control.direction = "left";
            control.moving = true;
        } else if (command === "right") {
            control.rotation = wrapAngle(control.rotation + 15);
            control.direction = "right";
            control.moving = true;
        } else if (command === "forward") {
            control.position.z -= control.speed * 0.8;
            control.direction = "forward";
            control.moving = true;
        } else if (command === "backward") {
            control.position.z += control.speed * 0.8;
            control.direction = "backward";
            control.moving = true;
        } else if (command === "stop") {
            control.direction = "idle";
            control.moving = false;
        }

        return buildControlSnapshot();
    }

    function advanceRealtimeRuntime() {
        const now = Date.now();
        const dtSec = Math.max(0, (now - runtime.realtime.lastTickAt) / 1000);
        runtime.realtime.lastTickAt = now;

        if (runtime.realtime.mode === "idle") {
            return;
        }

        runtime.realtime.duration += dtSec;
        runtime.realtime.distance += runtime.realtime.speed * dtSec;

        const cadence = getActivityPreset(runtime.realtime.activityKey, runtime.realtime.speed).stepFrequencySpm;
        const stepsFloat = (cadence / 60) * dtSec + runtime.realtime.stepRemainder;
        const wholeSteps = Math.floor(stepsFloat);
        runtime.realtime.stepCount += wholeSteps;
        runtime.realtime.stepRemainder = stepsFloat - wholeSteps;
    }

    function getActivityPreset(activityKey, speedMps) {
        const run = activityKey === "run";
        const safeSpeed = clampNumber(Number(speedMps), 0.5, 5.0, defaultSpeed(activityKey));
        return {
            activityKey,
            gaitSpeedMps: round(safeSpeed, 2),
            cycleDurationSec: run
                ? clampNumber(0.82 - (safeSpeed - 3.0) * 0.06, 0.55, 0.92, 0.78)
                : clampNumber(1.16 - (safeSpeed - 1.2) * 0.12, 0.82, 1.38, 1.08),
            strideLengthCm: safeSpeed * (run ? 82 : 62),
            stepFrequencySpm: safeSpeed * (run ? 115 : 98),
            symmetry: run ? 0.962 : 0.978,
            stability: run ? 0.914 : 0.953,
            flightRatio: run ? 0.12 : 0,
            doubleSupportRatio: run ? 0.08 : 0.21,
            stanceRatio: run ? 0.44 : 0.62,
            swingClearanceCm: run ? 9.8 : 4.8,
            pelvisHeightCm: 95,
            pelvisSwayCm: run ? 2.6 : 1.6,
            verticalBobCm: run ? 2.8 : 1.4,
            thighLengthCm: 42,
            shankLengthCm: 40,
            stepArcCm: run ? 68 : 42,
            hipAmplitudeDeg: run ? 22 : 14,
            kneeAmplitudeDeg: run ? 78 : 52,
            ankleAmplitudeDeg: run ? 20 : 12
        };
    }

    function buildStanceContact(progress) {
        if (progress < 0.16) {
            const blend = progress / 0.16;
            return {
                heel: 0.94,
                arch: 0.38 + blend * 0.16,
                ball: 0.16 + blend * 0.12,
                toe: 0.08 + blend * 0.05
            };
        }

        if (progress < 0.62) {
            const blend = (progress - 0.16) / 0.46;
            return {
                heel: 0.78 - blend * 0.26,
                arch: 0.54 + blend * 0.18,
                ball: 0.28 + blend * 0.22,
                toe: 0.12 + blend * 0.12
            };
        }

        const blend = (progress - 0.62) / 0.38;
        return {
            heel: 0.36 - blend * 0.26,
            arch: 0.42 - blend * 0.12,
            ball: 0.62 + blend * 0.20,
            toe: 0.44 + blend * 0.36
        };
    }

    function buildPressureArray(contact, side) {
        const base = [
            contact.heel * 102,
            contact.heel * 86,
            contact.arch * 70,
            contact.arch * 58,
            contact.ball * 92,
            contact.ball * 104,
            contact.toe * 76,
            contact.toe * 68
        ];

        if (side === "right") {
            return base.map((value, index) => round(value * (index % 2 === 0 ? 1.03 : 0.98), 1));
        }

        return base.map((value, index) => round(value * (index % 2 === 0 ? 0.99 : 1.02), 1));
    }

    function resolvePhaseLabel(activityKey, phase, stanceRatio) {
        const isStance = phase < stanceRatio;
        if (!isStance) {
            const progress = (phase - stanceRatio) / (1 - stanceRatio);
            if (progress < 0.33) return { label: "摆动初期", group: "swing" };
            if (progress < 0.67) return { label: "摆动中期", group: "swing" };
            return { label: "摆动末期", group: "swing" };
        }

        const progress = phase / stanceRatio;
        if (activityKey === "run") {
            if (progress < 0.20) return { label: "缓冲着地", group: "stance" };
            if (progress < 0.52) return { label: "中期支撑", group: "stance" };
            if (progress < 0.82) return { label: "前掌推进", group: "stance" };
            return { label: "离地准备", group: "stance" };
        }

        if (progress < 0.10) return { label: "初始接触", group: "stance" };
        if (progress < 0.28) return { label: "负重响应", group: "stance" };
        if (progress < 0.52) return { label: "中期支撑", group: "stance" };
        if (progress < 0.78) return { label: "末期支撑", group: "stance" };
        return { label: "离地准备", group: "stance" };
    }

    function solveKneePoint(hip, ankle, thighLen, shankLen) {
        const dx = ankle.x - hip.x;
        const dy = ankle.y - hip.y;
        const dz = ankle.z - hip.z;
        const distance = Math.max(Math.hypot(dx, dy, dz), 1e-6);
        const clampedDistance = Math.min(distance, thighLen + shankLen - 1);
        const a = (thighLen * thighLen - shankLen * shankLen + clampedDistance * clampedDistance) / (2 * clampedDistance);
        const h = Math.sqrt(Math.max(thighLen * thighLen - a * a, 0));

        const ux = dx / distance;
        const uy = dy / distance;
        const uz = dz / distance;

        const midX = hip.x + ux * a;
        const midY = hip.y + uy * a;
        const midZ = hip.z + uz * a;

        const perpY = -uz;
        const perpZ = uy;

        return {
            x: midX,
            y: midY + perpY * h,
            z: midZ + perpZ * h
        };
    }

    function findActivity(key) {
        return ACTIVITY_OPTIONS.find((item) => item.key === key) || ACTIVITY_OPTIONS[0];
    }

    function sanitizeActivity(key) {
        return ACTIVITY_OPTIONS.some((item) => item.key === key) ? key : "walk";
    }

    function defaultSpeed(activityKey) {
        return activityKey === "run" ? 3.0 : 1.2;
    }

    function normalizeRequest(input, init) {
        let url;
        let method = (init && init.method) || "GET";
        let bodyText = "";

        if (typeof input === "string") {
            url = new URL(input, window.location.origin);
        } else {
            url = new URL(input.url, window.location.origin);
            method = input.method || method;
        }

        if (init && typeof init.body === "string") {
            bodyText = init.body;
        }

        return {
            path: url.pathname,
            method: String(method).toUpperCase(),
            searchParams: url.searchParams,
            bodyText
        };
    }

    function readJsonBody(bodyText) {
        if (!bodyText) {
            return {};
        }
        try {
            return JSON.parse(bodyText);
        } catch (error) {
            return {};
        }
    }

    function jsonResponse(payload, status) {
        return new Response(JSON.stringify(payload), {
            status: status || 200,
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Cache-Control": "no-store"
            }
        });
    }

    function pushStatus(message, level) {
        runtime.statusLog.unshift({
            message,
            level: level || "info",
            timestamp: formatDateTime(new Date())
        });
        runtime.statusLog = runtime.statusLog.slice(0, 20);
    }

    function formatDateTime(date) {
        return date.toLocaleString("zh-CN", {
            hour12: false,
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
    }

    function wrapAngle(angle) {
        let normalized = Number(angle) % 360;
        if (normalized < 0) {
            normalized += 360;
        }
        return normalized;
    }

    function cloneData(value) {
        return JSON.parse(JSON.stringify(value));
    }

    function clampNumber(value, min, max, fallback) {
        if (!Number.isFinite(value)) {
            return fallback;
        }
        return Math.min(max, Math.max(min, value));
    }

    function lerp(a, b, t) {
        return a + (b - a) * t;
    }

    function average(values) {
        if (!Array.isArray(values) || values.length === 0) {
            return 0;
        }
        return round(values.reduce((sum, value) => sum + Number(value || 0), 0) / values.length, 1);
    }

    function round(value, digits) {
        const factor = Math.pow(10, digits || 0);
        return Math.round(Number(value) * factor) / factor;
    }
})();
