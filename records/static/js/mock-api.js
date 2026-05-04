(function recordsStaticMockApi() {
    const ACTIVITY_OPTIONS = [
        { key: "walk", label: "步行", source: "static-simulator" },
        { key: "run", label: "跑步", source: "static-simulator" }
    ];

    const BODY_ORDER = [
        "pelvis",
        "femur_r",
        "tibia_r",
        "calcn_r",
        "toes_r",
        "femur_l",
        "tibia_l",
        "calcn_l",
        "toes_l"
    ];
    const GEOMETRY_ASSET_PATH = "./static/data/rajagopal-lower-geometry.json";

    const BODY_GEOMETRY = {
        pelvis: createBoxMesh(22, 10, 12),
        femur_r: createBoxMesh(6.5, 38, 6.5),
        tibia_r: createBoxMesh(5.8, 38, 5.8),
        calcn_r: createBoxMesh(7, 10, 10),
        toes_r: createBoxMesh(5.2, 16, 4.8),
        femur_l: createBoxMesh(6.5, 38, 6.5),
        tibia_l: createBoxMesh(5.8, 38, 5.8),
        calcn_l: createBoxMesh(7, 10, 10),
        toes_l: createBoxMesh(5.2, 16, 4.8)
    };

    const runtime = {
        currentActivity: "walk",
        statusLog: [],
        clipCache: new Map(),
        realtime: createRealtimeRuntime(),
        control: createControlRuntime(),
        displayGeometryPromise: null,
        displayGeometryPayload: null,
        displayGeometrySource: "unloaded"
    };

    pushStatus("静态演示模式已启用，records 无需后端即可直接运行。", "success");
    pushStatus("本地步态模拟引擎已接管 /api 接口。", "info");

    const nativeFetch = typeof window.fetch === "function" ? window.fetch.bind(window) : null;

    window.fetch = async function mockedFetch(input, init = {}) {
        const request = normalizeRequest(input, init);
        if (!request.path.startsWith("/api")) {
            if (!nativeFetch) {
                throw new Error("当前环境不支持原生 fetch。");
            }
            return nativeFetch(input, init);
        }
        return handleApiRequest(request);
    };

    async function handleApiRequest(request) {
        const { path, method, searchParams } = request;

        if (path === "/api/activity" && method === "GET") {
            return jsonResponse({
                status: "ok",
                current: findActivity(runtime.currentActivity),
                options: ACTIVITY_OPTIONS
            });
        }

        if (path === "/api/activity" && method === "POST") {
            const payload = readJsonBody(request.bodyText);
            const activityKey = typeof payload.activity === "string" ? payload.activity : runtime.currentActivity;
            runtime.currentActivity = ACTIVITY_OPTIONS.some((item) => item.key === activityKey) ? activityKey : "walk";
            pushStatus(`已切换到${findActivity(runtime.currentActivity).label}模式。`, "info");
            return jsonResponse({
                status: "ok",
                current: findActivity(runtime.currentActivity),
                options: ACTIVITY_OPTIONS
            });
        }

        if (path === "/api/display-geometry" && method === "GET") {
            return jsonResponse(await getDisplayGeometryPayload());
        }

        if (path === "/api/health" && method === "GET") {
            const geometryPayload = await getDisplayGeometryPayload();
            const geometry = geometryPayload.geometry || {};
            return jsonResponse({
                status: "ok",
                model_ready: true,
                error: null,
                current_activity: runtime.currentActivity,
                gaitdynamics_dir: "static-simulator",
                opensim_models_dir: "static-simulator",
                display_geometry_ready: Boolean(geometry.body_order && geometry.body_order.length),
                display_mesh_count: geometry.mesh_count || 0,
                missing_mesh_files: geometry.missing_mesh_files || [],
                cached_activities: Array.from(runtime.clipCache.keys()),
                loading_activity: null,
                options: ACTIVITY_OPTIONS,
                status_log: runtime.statusLog.slice(0, 8),
                timestamp: formatDateTime(new Date())
            });
        }

        if (path === "/api/clip" && method === "GET") {
            const activityKey = sanitizeActivity(searchParams.get("activity") || runtime.currentActivity);
            const speed = clampNumber(parseFloat(searchParams.get("speed") || ""), 0.5, 5, defaultSpeed(activityKey));
            const duration = clampNumber(parseFloat(searchParams.get("duration") || ""), 10, 60, 30);
            runtime.currentActivity = activityKey;
            const clip = generateClip(activityKey, speed, duration);
            pushStatus(`${findActivity(activityKey).label}静态片段已生成。`, "success");
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
            const payload = readJsonBody(request.bodyText);
            return jsonResponse(handleRealtimeCommand(payload));
        }

        if (path === "/api/realtime/health" && method === "GET") {
            const snapshot = buildRealtimeSnapshot();
            return jsonResponse({
                status: "ok",
                service: "static-realtime-monitor",
                mode: snapshot.mode,
                speed: snapshot.speed,
                direction: snapshot.direction,
                step_count: snapshot.step_count,
                distance_m: snapshot.distance,
                uptime_sec: snapshot.duration,
                status_log: snapshot.status_log,
                timestamp: formatDateTime(new Date())
            });
        }

        if (path === "/api/state" && method === "GET") {
            return jsonResponse({
                status: "ok",
                state: buildControlSnapshot()
            });
        }

        if (path === "/api/control" && method === "POST") {
            const payload = readJsonBody(request.bodyText);
            return jsonResponse({
                status: "ok",
                state: handleControlCommand(payload)
            });
        }

        return jsonResponse({ status: "error", message: `未实现的接口: ${method} ${path}` }, 404);
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

        runtime.clipCache.set(cacheKey, clip);
        return cloneData(clip);
    }

    function buildFrame(index, timeSec, preset) {
        const basePhase = (timeSec / preset.cycleDurationSec) % 1;
        const pelvis = {
            x_cm: Math.sin(basePhase * Math.PI * 2) * preset.pelvisSwayCm,
            y_cm: preset.pelvisHeightCm + Math.sin(basePhase * Math.PI * 4) * preset.verticalBobCm,
            z_cm: Math.sin(basePhase * Math.PI * 2) * 1.6
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
            segments: buildSegments(left, right)
        };
    }

    function buildLegPose(side, phase, preset, pelvis) {
        const isLeft = side === "left";
        const lateral = isLeft ? 10 : -10;
        const isStance = phase < preset.stanceRatio;
        const stanceProgress = isStance ? phase / preset.stanceRatio : 0;
        const swingProgress = isStance ? 0 : (phase - preset.stanceRatio) / (1 - preset.stanceRatio);

        const hip = { x: lateral, y: pelvis.y_cm - 3.2, z: pelvis.z_cm + (isLeft ? 0.8 : -0.8) };

        let footTravel = 0;
        let heelLift = 0.4;
        let toeLift = 0.4;
        let clearance = 0;
        let contact = { heel: 0, arch: 0, ball: 0, toe: 0 };

        if (isStance) {
            footTravel = lerp(preset.stepArcCm * 0.5, -preset.stepArcCm * 0.5, stanceProgress);
            heelLift = stanceProgress > 0.78 ? (stanceProgress - 0.78) / 0.22 * 2.6 : 0.2;
            toeLift = stanceProgress < 0.15 ? (1 - stanceProgress / 0.15) * 1.8 : 0.15;
            contact = buildStanceContact(stanceProgress);
        } else {
            footTravel = lerp(-preset.stepArcCm * 0.5, preset.stepArcCm * 0.5, swingProgress);
            clearance = Math.pow(Math.sin(Math.PI * swingProgress), 1.35) * preset.swingClearanceCm;
            heelLift = 0.8 + clearance * 0.45;
            toeLift = 1.3 + clearance * 0.8;
            contact = { heel: 0.03, arch: 0.02, ball: 0.03, toe: 0.02 };
        }

        const heel = {
            x: lateral,
            y: heelLift,
            z: pelvis.z_cm + footTravel - 6.2
        };
        const toe = {
            x: lateral,
            y: toeLift,
            z: pelvis.z_cm + footTravel + 8.7
        };
        const ankle = {
            x: lateral,
            y: Math.max((heel.y + toe.y) * 0.5 + 5.9, 6.0 + clearance * 0.38),
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
                stance: isStance ? 0.56 + 0.34 * Math.sin(Math.PI * stanceProgress) : 0.06 + 0.12 * Math.sin(Math.PI * swingProgress),
                is_contact: isStance,
                hip_angle_deg: hipAngleDeg,
                knee_angle_deg: kneeAngleDeg,
                ankle_angle_deg: ankleAngleDeg,
                foot_pitch_deg: footPitchDeg,
                foot_speed_mps: Math.abs(preset.gaitSpeedMps * (isStance ? 0.55 : 1.1)),
                clearance_cm: Math.max(0, clearance),
                force_vy: isStance ? 0.38 + 0.9 * Math.max(rearLoad, foreLoad) : 0.08 + clearance * 0.02,
                cop_progress: isStance ? stanceProgress : 1,
                rear_load: rearLoad,
                fore_load: foreLoad,
                contact,
                pressure,
                pressure_mean: average(pressure)
            }
        };
    }

    function buildSegments(left, right) {
        return {
            pelvis: segmentTransform(right.hip, left.hip),
            femur_r: segmentTransform(right.hip, right.knee),
            tibia_r: segmentTransform(right.knee, right.ankle),
            calcn_r: segmentTransform(right.ankle, right.heel),
            toes_r: segmentTransform(right.heel, right.toe),
            femur_l: segmentTransform(left.hip, left.knee),
            tibia_l: segmentTransform(left.knee, left.ankle),
            calcn_l: segmentTransform(left.ankle, left.heel),
            toes_l: segmentTransform(left.heel, left.toe)
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
            ball: 0.62 + blend * 0.2,
            toe: 0.44 + blend * 0.36
        };
    }

    function buildPressureArray(contact, side) {
        const bias = side === "left" ? 1.04 : 0.98;
        return [
            round(contact.heel * 30 * bias, 1),
            round(contact.heel * 28 * (2 - bias), 1),
            round(contact.arch * 22 * bias, 1),
            round(contact.arch * 20 * (2 - bias), 1),
            round(contact.ball * 24 * bias, 1),
            round(contact.ball * 22 * (2 - bias), 1),
            round(contact.toe * 18 * bias, 1),
            round(contact.toe * 16 * (2 - bias), 1)
        ];
    }

    function resolvePhaseLabel(activityKey, phase, stanceRatio) {
        const isRun = activityKey === "run";
        if (phase < stanceRatio) {
            const progress = phase / stanceRatio;
            if (isRun) {
                if (progress < 0.22) return { label: "后跟着地", group: "stance" };
                if (progress < 0.48) return { label: "全脚掌支撑", group: "stance" };
                if (progress < 0.72) return { label: "后跟离地", group: "stance" };
                return { label: "前掌蹬离", group: "stance" };
            }

            if (progress < 0.16) return { label: "初始接触", group: "stance" };
            if (progress < 0.32) return { label: "负重反应", group: "stance" };
            if (progress < 0.56) return { label: "站立中期", group: "stance" };
            if (progress < 0.78) return { label: "站立末期", group: "stance" };
            return { label: "前掌推进", group: "stance" };
        }

        const progress = (phase - stanceRatio) / (1 - stanceRatio);
        if (isRun) {
            if (progress < 0.34) return { label: "腾空前摆", group: "swing" };
            if (progress < 0.68) return { label: "腾空中期", group: "swing" };
            return { label: "腾空回收", group: "swing" };
        }

        if (progress < 0.34) return { label: "摆动初期", group: "swing" };
        if (progress < 0.68) return { label: "摆动中期", group: "swing" };
        return { label: "摆动末期", group: "swing" };
    }

    async function getDisplayGeometryPayload() {
        if (runtime.displayGeometryPayload) {
            return cloneData(runtime.displayGeometryPayload);
        }
        if (!runtime.displayGeometryPromise) {
            runtime.displayGeometryPromise = loadDisplayGeometryPayload();
        }
        const payload = await runtime.displayGeometryPromise;
        return cloneData(payload);
    }

    async function loadDisplayGeometryPayload() {
        if (!nativeFetch) {
            runtime.displayGeometrySource = "fallback-box";
            runtime.displayGeometryPayload = createFallbackDisplayGeometryPayload();
            return runtime.displayGeometryPayload;
        }

        try {
            const response = await nativeFetch(GEOMETRY_ASSET_PATH, { cache: "no-store" });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const payload = await response.json();
            const geometry = payload && payload.geometry ? payload.geometry : payload;
            runtime.displayGeometrySource = "rajagopal-lower";
            runtime.displayGeometryPayload = {
                status: "ok",
                geometry: geometry
            };
            pushStatus(`Rajagopal 楂細鍑犱綍宸插姞杞斤紝鍖呭惈 ${geometry.mesh_count || 0} 涓綉鏍肩粍銆?`, "success");
            return runtime.displayGeometryPayload;
        } catch (error) {
            console.warn("Failed to load Rajagopal geometry asset, falling back to box meshes.", error);
            runtime.displayGeometrySource = "fallback-box";
            runtime.displayGeometryPayload = createFallbackDisplayGeometryPayload();
            pushStatus("Rajagopal 鍑犱綍璧勬簮鍔犺浇澶辫触锛屽凡鍒囨崲鍒扮畝鍖栭鏋舵紨绀恒€?, "warning");
            return runtime.displayGeometryPayload;
        }
    }

    function createFallbackDisplayGeometryPayload() {
        const bodies = {};
        BODY_ORDER.forEach((bodyName) => {
            bodies[bodyName] = {
                meshes: [
                    {
                        vertices_cm: BODY_GEOMETRY[bodyName].vertices,
                        indices: BODY_GEOMETRY[bodyName].indices,
                        opacity: 0.98
                    }
                ]
            };
        });

        return {
            status: "ok",
            geometry: {
                status: "ok",
                message: "static simulator fallback geometry ready",
                body_order: BODY_ORDER,
                bodies,
                mesh_count: BODY_ORDER.length,
                missing_mesh_files: []
            }
        };
    }

    function createRealtimeRuntime() {
        return {
            mode: "idle",
            speed: 1.2,
            direction: 0,
            phase: 0,
            distance: 0,
            duration: 0,
            stepCount: 0,
            stepCarry: 0,
            lastTick: performance.now(),
            statusLog: [buildLogEntry("实时监测静态引擎已启动。", "success")]
        };
    }

    function tickRealtimeRuntime() {
        const state = runtime.realtime;
        const now = performance.now();
        const deltaSec = Math.max(0, (now - state.lastTick) / 1000);
        state.lastTick = now;

        if (state.mode === "idle") {
            return;
        }

        const activityKey = state.mode === "running" ? "run" : "walk";
        const preset = getActivityPreset(activityKey, state.speed);
        state.phase = (state.phase + deltaSec / preset.cycleDurationSec) % 1;
        state.distance = round(state.distance + state.speed * deltaSec, 2);
        state.duration = round(state.duration + deltaSec, 1);

        state.stepCarry += deltaSec / (preset.cycleDurationSec / 2);
        const wholeSteps = Math.floor(state.stepCarry);
        if (wholeSteps > 0) {
            state.stepCount += wholeSteps;
            state.stepCarry -= wholeSteps;
        }
    }

    function buildRealtimeSnapshot() {
        tickRealtimeRuntime();
        const state = runtime.realtime;
        const activityKey = state.mode === "running" ? "run" : "walk";
        const preset = getActivityPreset(activityKey, state.speed);
        const pelvis = {
            x_cm: Math.sin(state.phase * Math.PI * 2) * preset.pelvisSwayCm,
            y_cm: preset.pelvisHeightCm,
            z_cm: 0
        };

        const left = buildLegPose("left", (state.phase + 0.5) % 1, preset, pelvis);
        const right = buildLegPose("right", state.phase, preset, pelvis);
        const metrics = buildLiveMetrics(preset, state.phase);

        return {
            mode: state.mode,
            activity: state.mode === "idle" ? { key: "idle", label: "空闲" } : findActivity(activityKey),
            speed: round(state.speed, 1),
            direction: round(state.direction, 0),
            step_count: state.stepCount,
            distance: round(state.distance, 1),
            duration: round(state.duration, 1),
            metrics: {
                ...metrics,
                heart_rate: round(preset.baseHeartRate + Math.sin(state.phase * Math.PI * 2) * 3, 0),
                stance_ratio: round(preset.stanceRatio, 3)
            },
            left_leg: {
                phase: left.legState.phase_group === "stance" ? "stance" : "swing",
                hip_angle: round(left.legState.hip_angle_deg, 1),
                knee_angle: round(left.legState.knee_angle_deg, 1),
                ankle_angle: round(left.legState.ankle_angle_deg, 1),
                force: round(left.legState.force_vy, 2),
                clearance_cm: round(left.legState.clearance_cm, 2),
                foot_speed_mps: round(left.legState.foot_speed_mps, 2)
            },
            right_leg: {
                phase: right.legState.phase_group === "stance" ? "stance" : "swing",
                hip_angle: round(right.legState.hip_angle_deg, 1),
                knee_angle: round(right.legState.knee_angle_deg, 1),
                ankle_angle: round(right.legState.ankle_angle_deg, 1),
                force: round(right.legState.force_vy, 2),
                clearance_cm: round(right.legState.clearance_cm, 2),
                foot_speed_mps: round(right.legState.foot_speed_mps, 2)
            },
            timestamp: formatTimestamp(new Date()),
            status_log: state.statusLog.slice(0, 8)
        };
    }

    function handleRealtimeCommand(payload) {
        const state = runtime.realtime;
        const command = typeof payload.command === "string" ? payload.command : "";

        if (command === "start_walk") {
            state.mode = "walking";
            state.speed = clampNumber(Number(payload.speed), 0.5, 5, 1.2);
            state.lastTick = performance.now();
            state.statusLog.unshift(buildLogEntry("已切换到步行模式。", "info"));
        } else if (command === "start_run") {
            state.mode = "running";
            state.speed = clampNumber(Number(payload.speed), 0.5, 5, 3);
            state.lastTick = performance.now();
            state.statusLog.unshift(buildLogEntry("已切换到跑步模式。", "info"));
        } else if (command === "stop") {
            tickRealtimeRuntime();
            state.mode = "idle";
            state.statusLog.unshift(buildLogEntry("实时监测已暂停。", "warning"));
        } else if (command === "reset") {
            runtime.realtime = createRealtimeRuntime();
            runtime.realtime.direction = state.direction;
        } else if (command === "set_speed") {
            state.speed = clampNumber(Number(payload.speed), 0.5, 5, state.speed);
        } else if (command === "set_direction") {
            state.direction = normalizeAngle(Number(payload.direction));
        }

        state.statusLog = state.statusLog.slice(0, 8);
        return {
            status: "ok",
            state: buildRealtimeSnapshot()
        };
    }

    function createControlRuntime() {
        return {
            position: { x: 0, y: 0, z: 0 },
            rotation: 0,
            speed: 1.2,
            mode: "walk",
            moving: false,
            direction: "idle",
            lastTick: performance.now()
        };
    }

    function tickControlRuntime() {
        const state = runtime.control;
        const now = performance.now();
        const deltaSec = Math.max(0, (now - state.lastTick) / 1000);
        state.lastTick = now;

        if (!state.moving) {
            return;
        }

        if (state.direction === "left") {
            state.rotation = normalizeAngle(state.rotation - 75 * deltaSec);
            return;
        }

        if (state.direction === "right") {
            state.rotation = normalizeAngle(state.rotation + 75 * deltaSec);
            return;
        }

        const directionSign = state.direction === "backward" ? -1 : 1;
        const radians = state.rotation * Math.PI / 180;
        const distance = state.speed * 8 * deltaSec * directionSign;
        state.position.x += Math.sin(radians) * distance;
        state.position.z += Math.cos(radians) * distance;
    }

    function buildControlSnapshot() {
        tickControlRuntime();
        return {
            position: {
                x: round(runtime.control.position.x, 1),
                y: 0,
                z: round(runtime.control.position.z, 1)
            },
            rotation: round(runtime.control.rotation, 0),
            speed: round(runtime.control.speed, 1),
            mode: runtime.control.mode,
            moving: runtime.control.moving,
            direction: runtime.control.direction
        };
    }

    function handleControlCommand(payload) {
        const state = runtime.control;
        tickControlRuntime();

        const command = typeof payload.command === "string" ? payload.command : "";
        if (command === "forward" || command === "backward" || command === "left" || command === "right") {
            state.direction = command;
            state.moving = true;
        } else if (command === "stop") {
            state.direction = "idle";
            state.moving = false;
        } else if (command === "reset") {
            runtime.control = createControlRuntime();
            return buildControlSnapshot();
        } else if (command === "set_speed") {
            state.speed = clampNumber(Number(payload.speed), 0.5, 5, state.speed);
        } else if (command === "set_mode") {
            state.mode = payload.mode === "run" ? "run" : "walk";
            if (!payload.speed) {
                state.speed = state.mode === "run" ? 3 : 1.2;
            }
        }

        state.lastTick = performance.now();
        return buildControlSnapshot();
    }

    function getActivityPreset(activityKey, speedMps) {
        const isRun = activityKey === "run";
        const gaitSpeedMps = clampNumber(speedMps, 0.5, 5, isRun ? 3 : 1.2);
        const cycleDurationSec = isRun
            ? clampNumber(0.72 - (gaitSpeedMps - 3) * 0.05, 0.56, 0.84, 0.72)
            : clampNumber(1.14 - (gaitSpeedMps - 1.2) * 0.11, 0.88, 1.26, 1.14);

        return {
            activityKey,
            gaitSpeedMps,
            cycleDurationSec,
            stepFrequencySpm: 120 / cycleDurationSec,
            strideLengthCm: gaitSpeedMps * cycleDurationSec * 100,
            stanceRatio: isRun ? 0.42 : 0.62,
            flightRatio: isRun ? 0.18 : 0.06,
            doubleSupportRatio: isRun ? 0.03 : 0.22,
            symmetry: isRun ? 0.928 : 0.962,
            stability: isRun ? 0.846 : 0.914,
            baseHeartRate: isRun ? 126 : 82,
            pelvisHeightCm: isRun ? 84 : 82,
            verticalBobCm: isRun ? 1.9 : 1.2,
            pelvisSwayCm: isRun ? 1.4 : 1.8,
            swingClearanceCm: isRun ? 12 : 7.6,
            hipAmplitudeDeg: isRun ? 28 : 21,
            kneeAmplitudeDeg: isRun ? 46 : 34,
            ankleAmplitudeDeg: isRun ? 18 : 12,
            stepArcCm: isRun ? 52 : 34,
            thighLengthCm: 39,
            shankLengthCm: 40
        };
    }

    function solveKneePoint(hip, ankle, thighLength, shankLength) {
        const dz = ankle.z - hip.z;
        const dy = ankle.y - hip.y;
        const distance = Math.max(0.001, Math.min(Math.sqrt(dz * dz + dy * dy), thighLength + shankLength - 0.001));
        const along = (thighLength * thighLength - shankLength * shankLength + distance * distance) / (2 * distance);
        const height = Math.sqrt(Math.max(thighLength * thighLength - along * along, 0));
        const dirZ = dz / distance;
        const dirY = dy / distance;
        const baseZ = hip.z + dirZ * along;
        const baseY = hip.y + dirY * along;
        const perpZ = -dirY;
        const perpY = dirZ;
        return {
            x: hip.x,
            y: baseY + perpY * height,
            z: baseZ + perpZ * height
        };
    }

    function segmentTransform(start, end) {
        const dir = normalizeVector([
            end.x - start.x,
            end.y - start.y,
            end.z - start.z
        ], [0, 1, 0]);
        const reference = Math.abs(dotProduct(dir, [0, 0, 1])) > 0.92 ? [1, 0, 0] : [0, 0, 1];
        const axisX = normalizeVector(crossProduct(reference, dir), [1, 0, 0]);
        const axisZ = normalizeVector(crossProduct(dir, axisX), [0, 0, 1]);

        return {
            position_cm: [
                round((start.x + end.x) * 0.5, 3),
                round((start.y + end.y) * 0.5, 3),
                round((start.z + end.z) * 0.5, 3)
            ],
            rotation: [
                round(axisX[0], 6), round(dir[0], 6), round(axisZ[0], 6),
                round(axisX[1], 6), round(dir[1], 6), round(axisZ[1], 6),
                round(axisX[2], 6), round(dir[2], 6), round(axisZ[2], 6)
            ]
        };
    }

    function createBoxMesh(width, height, depth) {
        const hw = width / 2;
        const hh = height / 2;
        const hd = depth / 2;
        return {
            vertices: [
                -hw, -hh, -hd,
                 hw, -hh, -hd,
                 hw,  hh, -hd,
                -hw,  hh, -hd,
                -hw, -hh,  hd,
                 hw, -hh,  hd,
                 hw,  hh,  hd,
                -hw,  hh,  hd
            ],
            indices: [
                0, 1, 2, 0, 2, 3,
                1, 5, 6, 1, 6, 2,
                5, 4, 7, 5, 7, 6,
                4, 0, 3, 4, 3, 7,
                3, 2, 6, 3, 6, 7,
                4, 5, 1, 4, 1, 0
            ]
        };
    }

    function normalizeRequest(input, init) {
        const url = new URL(typeof input === "string" ? input : input.url, window.location.href);
        return {
            path: url.pathname.replace(/\/+$/, "") || "/",
            method: String(init.method || (typeof input !== "string" && input.method) || "GET").toUpperCase(),
            searchParams: url.searchParams,
            bodyText: typeof init.body === "string" ? init.body : ""
        };
    }

    function jsonResponse(payload, status = 200) {
        return Promise.resolve(new Response(JSON.stringify(payload), {
            status,
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Cache-Control": "no-store"
            }
        }));
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

    function sanitizeActivity(value) {
        return value === "run" ? "run" : "walk";
    }

    function findActivity(key) {
        return ACTIVITY_OPTIONS.find((item) => item.key === key) || ACTIVITY_OPTIONS[0];
    }

    function defaultSpeed(activityKey) {
        return activityKey === "run" ? 3 : 1.2;
    }

    function buildLogEntry(message, level) {
        return {
            message,
            level,
            timestamp: formatDateTime(new Date())
        };
    }

    function pushStatus(message, level) {
        runtime.statusLog.unshift(buildLogEntry(message, level));
        runtime.statusLog = runtime.statusLog.slice(0, 8);
    }

    function formatTimestamp(date) {
        return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    }

    function formatDateTime(date) {
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    }

    function pad(value) {
        return String(value).padStart(2, "0");
    }

    function round(value, digits) {
        return Number(Number(value).toFixed(digits));
    }

    function average(values) {
        if (!Array.isArray(values) || values.length === 0) {
            return 0;
        }
        return values.reduce((sum, value) => sum + Number(value || 0), 0) / values.length;
    }

    function lerp(start, end, alpha) {
        return start + (end - start) * alpha;
    }

    function clampNumber(value, minimum, maximum, fallback) {
        if (!Number.isFinite(value)) {
            return fallback;
        }
        return Math.min(maximum, Math.max(minimum, value));
    }

    function normalizeAngle(value) {
        const numeric = Number.isFinite(value) ? value : 0;
        return ((numeric % 360) + 360) % 360;
    }

    function cloneData(value) {
        if (typeof structuredClone === "function") {
            return structuredClone(value);
        }
        return JSON.parse(JSON.stringify(value));
    }

    function crossProduct(a, b) {
        return [
            a[1] * b[2] - a[2] * b[1],
            a[2] * b[0] - a[0] * b[2],
            a[0] * b[1] - a[1] * b[0]
        ];
    }

    function dotProduct(a, b) {
        return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    }

    function normalizeVector(vector, fallback) {
        const length = Math.sqrt(dotProduct(vector, vector));
        if (length < 1e-6) {
            return fallback.slice();
        }
        return [vector[0] / length, vector[1] / length, vector[2] / length];
    }
})();
