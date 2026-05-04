const UI_REFRESH_MS = 80;
const RETRY_DELAY_MS = 2500;
const MAX_STATUS_ITEMS = 8;

const JOINT_INDEX = {
    pelvis: 0,
    hip_r: 1,
    knee_r: 2,
    ankle_r: 3,
    calcn_r: 4,
    mtp_r: 5,
    hip_l: 6,
    knee_l: 7,
    ankle_l: 8,
    calcn_l: 9,
    mtp_l: 10
};

const ACTIVITY_LABELS = {
    walk: "步行",
    run: "跑步"
};

const PHASE_RAIL_POINTS = {
    "初始接触": 0.05,
    "负重反应": 0.14,
    "站立中期": 0.29,
    "站立末期": 0.43,
    "离地准备": 0.57,
    "前掌推进": 0.52,
    "缓冲触地": 0.09,
    "缓冲中期": 0.24,
    "中期支撑": 0.32,
    "后跟着地": 0.04,
    "全脚掌支撑": 0.22,
    "后跟离地": 0.48,
    "前掌蹬离": 0.56,
    "摆动初期": 0.7,
    "摆动中期": 0.84,
    "摆动末期": 0.95,
    "摆动期": 0.82,
    "离地摆动": 0.72,
    "腾空前摆": 0.75,
    "腾空中期": 0.86,
    "腾空回收": 0.95,
    "腾空摆动": 0.8
};

const CONTROL_SCENE_LIMITS = {
    x: 92,
    z: 132
};

const CONTROL_SCENE_UNITS_PER_METER = 22;

const appState = {
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    environment: null,
    rig: null,
    ui: {},
    clip: null,
    activityMode: "walk",
    renderLoopId: null,
    retryTimer: null,
    healthTimer: null,
    motionPaused: false,
    gridVisible: true,
    playbackStartedAt: 0,
    playbackPausedAt: 0,
    lastFrameTime: 0,
    lastUiRefresh: 0,
    clipRequestToken: 0,
    currentFrameIndex: 0,
    fpsSamples: [],
    availableActivities: ["walk", "run"],
    geometryPayload: null,
    geometryReady: false,
    statusKeys: new Set(),
    scrubbing: false,
    scrubPosition: 0,
    jointVectors: Array.from({ length: Object.keys(JOINT_INDEX).length }, () => new THREE.Vector3()),
    uiFrame: createReusableUiFrame(),
    renderLeft: createReusableLegState(),
    renderRight: createReusableLegState(),
    metricsHistory: {
        gaitSpeed: [],
        stepFrequency: [],
        symmetry: [],
        stability: [],
        maxPoints: 100
    },
    metricsChart: null,
    control: {
        panelOpen: false,
        position: new THREE.Vector3(),
        directionDeg: 0,
        speedMps: 1.2,
        durationSec: 30,
        joystickPower: 0,
        moving: false,
        statusText: "空闲",
        resetJoystickUi: null
    },
    temp: {
        matrixA: new THREE.Matrix4(),
        matrixB: new THREE.Matrix4(),
        quatA: new THREE.Quaternion(),
        quatB: new THREE.Quaternion(),
        yawQuaternion: new THREE.Quaternion(),
        pitchQuaternion: new THREE.Quaternion(),
        midpoint: new THREE.Vector3(),
        anchor: new THREE.Vector3(),
        delta: new THREE.Vector3(),
        forward: new THREE.Vector3(0, 0, 1),
        flatForward: new THREE.Vector3(0, 0, 1),
        pitchAxis: new THREE.Vector3(1, 0, 0)
    }
};

if (typeof window !== "undefined") {
    window.recordsAppState = appState;
}

document.addEventListener("DOMContentLoaded", () => {
    boot();
});

async function boot() {
    cacheDom();
    bindControls();
    initMetricsChart();
    if (appState.ui.viewerCopy) {
        appState.ui.viewerCopy.textContent = "Rajagopal 显示几何驱动的全身骨骼网格，叠加足底接触、受力转移与步态阶段可视化。";
    }

    if (typeof THREE === "undefined") {
        showFatalError("Three.js 未加载，无法启动演示场景。");
        return;
    }

    setConnectionMode("booting", "系统初始化中");

    try {
        const [geometryPayload] = await Promise.all([
            fetchDisplayGeometry(),
            fetchActivityConfig()
        ]);
        initScene(geometryPayload);
        await fetchClip(appState.activityMode);
        await fetchHealthSnapshot();
        if (!appState.healthTimer) {
            appState.healthTimer = window.setInterval(fetchHealthSnapshot, 8000);
        }
        if (!appState.renderLoopId) {
            appState.lastFrameTime = performance.now();
            appState.renderLoopId = requestAnimationFrame(animate);
        }
    } catch (error) {
        console.error(error);
        if (!appState.scene) {
            initScene(null);
        }
        showFatalError(`初始化失败: ${error.message}`);
    }
}

function cacheDom() {
    appState.ui = {
        appContainer: document.querySelector(".container"),
        container: document.getElementById("canvas-container"),
        loading: document.getElementById("scene-loading"),
        statusLog: document.getElementById("status-log"),
        connectionPill: document.getElementById("connection-pill"),
        phasePill: document.getElementById("phase-pill"),
        phasePillMini: document.getElementById("phase-pill-mini"),
        phaseProgress: document.getElementById("phase-progress"),
        modeLabel: document.getElementById("mode-label"),
        pelvisDrift: document.getElementById("pelvis-drift"),
        leftPhaseLabel: document.getElementById("left-phase-label"),
        rightPhaseLabel: document.getElementById("right-phase-label"),
        leftPhaseProgress: document.getElementById("left-phase-progress"),
        rightPhaseProgress: document.getElementById("right-phase-progress"),
        leftPhaseIndicator: document.getElementById("left-phase-indicator"),
        rightPhaseIndicator: document.getElementById("right-phase-indicator"),
        leftPhaseIndicatorText: document.getElementById("left-phase-indicator-text"),
        rightPhaseIndicatorText: document.getElementById("right-phase-indicator-text"),
        viewerCopy: document.querySelector(".card-copy"),
        activityLabel: document.getElementById("activity-label"),
        resetButton: document.getElementById("reset-view"),
        gridButton: document.getElementById("toggle-grid"),
        motionButton: document.getElementById("toggle-motion"),
        playbackSlider: document.getElementById("playback-slider"),
        currentTime: document.getElementById("current-time"),
        totalTime: document.getElementById("total-time"),
        activityButtons: Array.from(document.querySelectorAll(".activity-btn")),
        speedInput: document.getElementById("speed-input"),
        durationInput: document.getElementById("duration-input"),
        dataMode: document.getElementById("data-mode"),
        renderFps: document.getElementById("render-fps"),
        temp: document.getElementById("temp"),
        battery: document.getElementById("battery"),
        timestamp: document.getElementById("timestamp"),
        stepFrequency: document.getElementById("step-frequency"),
        strideLength: document.getElementById("stride-length"),
        gaitSpeed: document.getElementById("gait-speed"),
        symmetry: document.getElementById("symmetry"),
        stability: document.getElementById("stability"),
        cycleDuration: document.getElementById("cycle-duration"),
        loopDuration: document.getElementById("loop-duration"),
        flightRatio: document.getElementById("flight-ratio"),
        doubleSupportRatio: document.getElementById("double-support-ratio"),
        leftState: document.getElementById("left-state"),
        leftStance: document.getElementById("left-stance"),
        leftStanceBar: document.getElementById("left-stance-bar"),
        leftThighAngle: document.getElementById("left-thigh-angle"),
        leftKneeFlex: document.getElementById("left-knee-flex"),
        leftAnkleAngle: document.getElementById("left-ankle-angle"),
        leftInsoleAngle: document.getElementById("left-insole-angle"),
        leftFootSpeed: document.getElementById("left-foot-speed"),
        leftClearance: document.getElementById("left-clearance"),
        leftPressureSummary: document.getElementById("left-pressure-summary"),
        leftPressureNodes: Array.from({ length: 8 }, (_, index) => document.getElementById(`left-p-${index}`)),
        rightState: document.getElementById("right-state"),
        rightStance: document.getElementById("right-stance"),
        rightStanceBar: document.getElementById("right-stance-bar"),
        rightThighAngle: document.getElementById("right-thigh-angle"),
        rightKneeFlex: document.getElementById("right-knee-flex"),
        rightAnkleAngle: document.getElementById("right-ankle-angle"),
        rightInsoleAngle: document.getElementById("right-insole-angle"),
        rightFootSpeed: document.getElementById("right-foot-speed"),
        rightClearance: document.getElementById("right-clearance"),
        rightPressureSummary: document.getElementById("right-pressure-summary"),
        rightPressureNodes: Array.from({ length: 8 }, (_, index) => document.getElementById(`right-p-${index}`)),
        controlPanelButton: document.getElementById("toggle-control-panel"),
        floatingPanel: document.getElementById("floating-control-panel"),
        controlBackdrop: document.getElementById("floating-control-backdrop"),
        closeControlPanelButton: document.getElementById("close-control-panel"),
        ctrlStatus: document.getElementById("ctrl-status"),
        ctrlDirection: document.getElementById("ctrl-direction")
    };
}

function bindControls() {
    const { resetButton, gridButton, motionButton, playbackSlider, activityButtons } = appState.ui;

    if (resetButton) {
        resetButton.addEventListener("click", () => {
            resetCamera();
            pushStatus("观察视角已恢复到默认全身展示位置。", "info");
        });
    }

    if (gridButton) {
        gridButton.addEventListener("click", () => {
            appState.gridVisible = !appState.gridVisible;
            toggleGrid(appState.gridVisible);
            gridButton.textContent = appState.gridVisible ? "隐藏参考线" : "显示参考线";
            gridButton.classList.toggle("active", appState.gridVisible);
        });
    }

    if (motionButton) {
        motionButton.addEventListener("click", () => {
            toggleMotion();
        });
    }

    // 生成按钮
    const generateBtn = document.getElementById("generate-btn");
    const speedInput = appState.ui.speedInput;
    const durationInput = appState.ui.durationInput;

    if (generateBtn && speedInput && durationInput) {
        generateBtn.addEventListener("click", async () => {
            const speed = parseFloat(speedInput.value);
            const duration = parseFloat(durationInput.value);

            if (isNaN(speed) || speed < 0.5 || speed > 5.0) {
                pushStatus("速度必须在0.5-5.0 m/s之间", "warning");
                return;
            }

            if (isNaN(duration) || duration < 10 || duration > 60) {
                pushStatus("时长必须在10-60秒之间", "warning");
                return;
            }

            appState.control.speedMps = speed;
            appState.control.durationSec = duration;
            syncControlInputs();
            await fetchClip(appState.activityMode, speed, duration);
        });

        activityButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const activityKey = button.dataset.activity;
                if (activityKey === "walk") {
                    appState.control.speedMps = 1.2;
                } else if (activityKey === "run") {
                    appState.control.speedMps = 3.0;
                }
                syncControlInputs();
            });
        });
    }

    if (speedInput) {
        speedInput.addEventListener("change", () => {
            const speed = clampNumber(parseFloat(speedInput.value), 0.5, 5.0, appState.control.speedMps);
            appState.control.speedMps = speed;
            syncControlInputs();
        });
    }

    if (durationInput) {
        durationInput.addEventListener("change", () => {
            const duration = clampNumber(parseFloat(durationInput.value), 10, 60, appState.control.durationSec);
            appState.control.durationSec = duration;
            syncControlInputs();
        });
    }

    if (playbackSlider) {
        playbackSlider.addEventListener("input", (e) => {
            appState.scrubbing = true;
            appState.scrubPosition = parseFloat(e.target.value) / 100;
            if (!appState.motionPaused) {
                appState.motionPaused = true;
                appState.playbackPausedAt = performance.now();
                syncMotionButton();
            }
        });

        playbackSlider.addEventListener("change", (e) => {
            // Keep paused after scrubbing
            appState.scrubbing = false;
        });

        playbackSlider.addEventListener("mouseup", () => {
            appState.scrubbing = false;
        });

        playbackSlider.addEventListener("touchend", () => {
            appState.scrubbing = false;
        });
    }

    activityButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const activityKey = button.dataset.activity;
            if (activityKey) {
                setActivity(activityKey);
            }
        });
    });

    // 打开遥控面板按钮
    const controlPanelBtn = appState.ui.controlPanelButton;
    const floatingPanel = appState.ui.floatingPanel;
    const closePanelBtn = appState.ui.closeControlPanelButton;
    const controlBackdrop = appState.ui.controlBackdrop;

    if (controlPanelBtn && floatingPanel) {
        controlPanelBtn.addEventListener("click", () => {
            setControlPanelOpen(!appState.control.panelOpen);
        });
    }

    if (closePanelBtn) {
        closePanelBtn.addEventListener("click", () => {
            setControlPanelOpen(false);
        });
    }

    if (controlBackdrop) {
        controlBackdrop.addEventListener("click", () => {
            setControlPanelOpen(false);
        });
    }

    // 浮动面板控制
    const ctrlWalkBtn = document.getElementById("ctrl-walk");
    const ctrlRunBtn = document.getElementById("ctrl-run");
    const ctrlSpeedSlider = document.getElementById("ctrl-speed");
    const ctrlSpeedVal = document.getElementById("ctrl-speed-val");
    const ctrlDurationSlider = document.getElementById("ctrl-duration");
    const ctrlDurationVal = document.getElementById("ctrl-duration-val");
    const ctrlGenerateBtn = document.getElementById("ctrl-generate");

    if (ctrlWalkBtn) {
        ctrlWalkBtn.addEventListener("click", () => {
            setActivity("walk");
            appState.control.speedMps = 1.2;
            appState.control.statusText = "步行待命";
            syncControlInputs();
            syncControlStatusPanel();
        });
    }

    if (ctrlRunBtn) {
        ctrlRunBtn.addEventListener("click", () => {
            setActivity("run");
            appState.control.speedMps = 3.0;
            appState.control.statusText = "跑步待命";
            syncControlInputs();
            syncControlStatusPanel();
        });
    }

    if (ctrlSpeedSlider && ctrlSpeedVal) {
        ctrlSpeedSlider.addEventListener("input", (e) => {
            appState.control.speedMps = clampNumber(parseFloat(e.target.value), 0.5, 5.0, appState.control.speedMps);
            syncControlInputs();
        });
    }

    if (ctrlDurationSlider && ctrlDurationVal) {
        ctrlDurationSlider.addEventListener("input", (e) => {
            appState.control.durationSec = clampNumber(parseFloat(e.target.value), 10, 60, appState.control.durationSec);
            syncControlInputs();
        });
    }

    if (ctrlGenerateBtn && ctrlSpeedSlider && ctrlDurationSlider) {
        ctrlGenerateBtn.addEventListener("click", async () => {
            const speed = appState.control.speedMps;
            const duration = appState.control.durationSec;
            syncControlInputs();
            await fetchClip(appState.activityMode, speed, duration);
            appState.control.statusText = `${getActivityLabel(appState.activityMode)}序列已生成`;
            syncControlStatusPanel();
        });
    }
    const ctrlPauseBtn = document.getElementById("ctrl-pause");
    const ctrlResetBtn = document.getElementById("ctrl-reset");

    if (ctrlPauseBtn) {
        ctrlPauseBtn.addEventListener("click", () => {
            appState.control.moving = false;
            appState.control.joystickPower = 0;
            toggleMotion();
            appState.control.statusText = appState.motionPaused ? "已暂停" : "继续播放";
            syncControlStatusPanel();
        });
    }

    if (ctrlResetBtn) {
        ctrlResetBtn.addEventListener("click", () => {
            resetCamera();
            resetControlMotion();
            pushStatus("视角和方向已重置", "info");
        });
    }

    syncControlInputs();
    syncControlStatusPanel();

    window.addEventListener("resize", handleResize);
    window.addEventListener("beforeunload", cleanup);
}

async function fetchActivityConfig() {
    try {
        const response = await fetch("/api/activity", { cache: "no-store" });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const payload = await response.json();
        if (Array.isArray(payload.options)) {
            appState.availableActivities = payload.options.map((item) => item.key);
        }
        if (payload.current && payload.current.key) {
            appState.activityMode = payload.current.key;
        }
        updateActivityButtons();
    } catch (error) {
        console.warn("Failed to load activity config:", error);
        updateActivityButtons();
        pushStatus("活动配置读取失败，已回退到默认步行模式。", "warning");
    }
}

async function fetchDisplayGeometry() {
    try {
        const response = await fetch("/api/display-geometry", { cache: "no-store" });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const payload = await response.json();
        appState.geometryPayload = payload.geometry || null;
        appState.geometryReady = payload.status === "ok" && !!appState.geometryPayload && !!appState.geometryPayload.bodies;

        if (appState.geometryReady) {
            pushStatus("Rajagopal 下肢显示几何已接入。", "success");
        } else {
            pushStatus("显示几何未完整加载，场景将保留压力覆盖层。", "warning");
        }
        return appState.geometryPayload;
    } catch (error) {
        console.warn("Failed to load display geometry:", error);
        appState.geometryReady = false;
        pushStatus("显示几何读取失败，已启用基础压力覆盖视图。", "warning");
        return null;
    }
}

async function fetchHealthSnapshot() {
    try {
        const response = await fetch("/api/health", { cache: "no-store" });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const payload = await response.json();
        if (Array.isArray(payload.status_log)) {
            payload.status_log
                .slice()
                .reverse()
                .forEach((entry) => {
                    pushStatus(entry.message, mapStatusTone(entry.level), entry.timestamp);
                });
        }
    } catch (error) {
        console.warn("Failed to load health snapshot:", error);
    }
}

function initScene(geometryPayload) {
    const { container, loading } = appState.ui;
    if (!container) {
        throw new Error("未找到 3D 场景容器。");
    }

    const width = Math.max(container.clientWidth, 320);
    const height = Math.max(container.clientHeight, 320);

    appState.scene = new THREE.Scene();
    appState.scene.background = new THREE.Color(0x0c1d2c);
    appState.scene.fog = new THREE.Fog(0x0c1d2c, 240, 580);

    appState.camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 1600);
    appState.camera.position.set(0, 136, 430);
    appState.camera.lookAt(0, 88, 0);

    appState.renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: "high-performance"
    });
    appState.renderer.setSize(width, height);
    appState.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    appState.renderer.outputEncoding = THREE.sRGBEncoding;
    appState.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    appState.renderer.toneMappingExposure = 1.12;
    appState.renderer.shadowMap.enabled = true;
    appState.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(appState.renderer.domElement);

    if (typeof THREE.OrbitControls !== "undefined") {
        appState.controls = new THREE.OrbitControls(appState.camera, appState.renderer.domElement);
        appState.controls.enableDamping = true;
        appState.controls.dampingFactor = 0.08;
        appState.controls.target.set(0, 88, 0);
        appState.controls.minDistance = 180;
        appState.controls.maxDistance = 420;
        appState.controls.maxPolarAngle = Math.PI * 0.48;
    }

    setupLighting();
    appState.environment = createEnvironment();
    appState.rig = createRig(geometryPayload);
    appState.scene.add(appState.environment.group);
    appState.scene.add(appState.rig.root);
    toggleGrid(appState.gridVisible);
    syncMotionButton();

    if (loading) {
        loading.classList.add("hidden");
    }
}

function setupLighting() {
    const ambient = new THREE.HemisphereLight(0xc7e1ff, 0x122334, 1.06);
    appState.scene.add(ambient);

    const key = new THREE.DirectionalLight(0xfcf7ef, 1.42);
    key.position.set(80, 180, 140);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.left = -180;
    key.shadow.camera.right = 180;
    key.shadow.camera.top = 180;
    key.shadow.camera.bottom = -180;
    key.shadow.camera.near = 10;
    key.shadow.camera.far = 500;
    appState.scene.add(key);

    const rim = new THREE.DirectionalLight(0x57d3ff, 0.48);
    rim.position.set(-120, 92, -140);
    appState.scene.add(rim);

    const fill = new THREE.PointLight(0x38e0d7, 0.38, 440, 2);
    fill.position.set(0, 112, 96);
    appState.scene.add(fill);
}

function createEnvironment() {
    const group = new THREE.Group();

    const grid = new THREE.GridHelper(320, 32, 0x244e72, 0x193147);
    grid.material.opacity = 0.18;
    grid.material.transparent = true;
    group.add(grid);

    const floor = new THREE.Mesh(
        new THREE.CircleGeometry(236, 80),
        new THREE.MeshStandardMaterial({
            color: 0x173149,
            roughness: 0.98,
            metalness: 0.03
        })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    group.add(floor);

    const runway = new THREE.Mesh(
        new THREE.PlaneGeometry(84, 244),
        new THREE.MeshStandardMaterial({
            color: 0x1d3144,
            roughness: 0.84,
            metalness: 0.05
        })
    );
    runway.rotation.x = -Math.PI / 2;
    runway.position.y = 0.02;
    group.add(runway);

    [-24, 24].forEach((xPos) => {
        const stripe = new THREE.Mesh(
            new THREE.PlaneGeometry(0.7, 214),
            new THREE.MeshBasicMaterial({
                color: 0x5a86b2,
                transparent: true,
                opacity: 0.28,
                side: THREE.DoubleSide
            })
        );
        stripe.rotation.x = -Math.PI / 2;
        stripe.position.set(xPos, 0.04, 0);
        group.add(stripe);
    });

    const shadowPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(320, 320),
        new THREE.ShadowMaterial({ opacity: 0.2 })
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = 0.04;
    shadowPlane.receiveShadow = true;
    group.add(shadowPlane);

    return { group, grid };
}

function createRig(geometryPayload) {
    const root = new THREE.Group();
    const segmentGroups = {};
    const bodyOrder = geometryPayload && Array.isArray(geometryPayload.body_order)
        ? geometryPayload.body_order
        : Object.keys((geometryPayload && geometryPayload.bodies) || {});
    const bodies = geometryPayload && geometryPayload.bodies ? geometryPayload.bodies : {};

    bodyOrder.forEach((bodyName) => {
        const bodyGroup = buildBodyGroup(bodyName, bodies[bodyName]);
        if (bodyGroup) {
            segmentGroups[bodyName] = bodyGroup;
            root.add(bodyGroup);
        }
    });

    const plantarLeft = createPlantarOverlay("left");
    const plantarRight = createPlantarOverlay("right");
    root.add(plantarLeft.group, plantarRight.group);

    const leftRing = createContactRing(0x4fd9d1);
    const rightRing = createContactRing(0x70a0ff);
    root.add(leftRing, rightRing);

    const leftForce = createForceLine(0x46d2c5);
    const rightForce = createForceLine(0x6b8cff);
    root.add(leftForce.line, rightForce.line);

    return {
        root,
        segmentGroups,
        plantar: { left: plantarLeft, right: plantarRight },
        rings: { left: leftRing, right: rightRing },
        forces: { left: leftForce, right: rightForce }
    };
}

function buildBodyGroup(bodyName, bodyPayload) {
    if (!bodyPayload || !Array.isArray(bodyPayload.meshes) || bodyPayload.meshes.length === 0) {
        return null;
    }

    const group = new THREE.Group();
    bodyPayload.meshes.forEach((meshPayload) => {
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.Float32BufferAttribute(meshPayload.vertices_cm, 3));
        geometry.setIndex(meshPayload.indices);
        geometry.computeVertexNormals();

        const material = createBoneMaterial(bodyName);
        if (typeof meshPayload.opacity === "number" && meshPayload.opacity < 0.999) {
            material.transparent = true;
            material.opacity = meshPayload.opacity;
        }

        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        group.add(mesh);
    });
    return group;
}

function createBoneMaterial(bodyName) {
    const isFoot = /talus|calcn|toes/.test(bodyName);
    const isArm = /humerus|ulna|radius|hand/.test(bodyName);
    const isCore = bodyName === "pelvis" || bodyName === "torso";
    const color = isCore
        ? 0xe8dcc8
        : isFoot
            ? 0xded7ca
            : isArm
                ? 0xd9d1c4
                : 0xe1d6c8;
    const emissive = isCore
        ? 0x15283d
        : isFoot
            ? 0x11232a
            : isArm
                ? 0x171d31
                : 0x121d2b;

    return new THREE.MeshPhysicalMaterial({
        color,
        roughness: 0.76,
        metalness: 0.02,
        clearcoat: 0.12,
        clearcoatRoughness: 0.74,
        emissive,
        emissiveIntensity: 0.07
    });
}

function createPlantarOverlay(side) {
    const group = new THREE.Group();
    const padColor = side === "left" ? 0x47d8ce : 0x7192ff;
    const glowColor = side === "left" ? 0x2ac3bc : 0x5e79ff;
    const zoneMaterial = new THREE.MeshStandardMaterial({
        color: padColor,
        emissive: glowColor,
        emissiveIntensity: 0.12,
        transparent: true,
        opacity: 0.06
    });

    const zoneDefs = [
        { name: "heel", size: [5.8, 0.12, 5.9], offset: [0, 0, -7.1] },
        { name: "arch", size: [4.2, 0.1, 4.8], offset: [0, 0, -1.4] },
        { name: "ball", size: [6.2, 0.1, 4.7], offset: [0, 0, 4.7] },
        { name: "toe", size: [5.0, 0.08, 3.2], offset: [0, 0, 9.5] }
    ];

    const zones = {};
    zoneDefs.forEach((definition) => {
        const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(definition.size[0], definition.size[1], definition.size[2]),
            zoneMaterial.clone()
        );
        mesh.position.set(definition.offset[0], definition.offset[1], definition.offset[2]);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        zones[definition.name] = mesh;
        group.add(mesh);
    });

    const toeMarkers = [-2.2, -1.0, 0.2, 1.4, 2.4].map((xPos, index) => {
        const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(0.62 + index * 0.06, 0.08, 1.75 + index * 0.06),
            zoneMaterial.clone()
        );
        mesh.position.set(xPos, 0.01, 12.1 - index * 0.08);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        group.add(mesh);
        return mesh;
    });

    return {
        group,
        zones,
        toeMarkers,
        baseLength: 23,
        soleHeight: 0.12
    };
}

function createContactRing(color) {
    const mesh = new THREE.Mesh(
        new THREE.RingGeometry(6, 10, 40),
        new THREE.MeshBasicMaterial({
            color,
            transparent: true,
            opacity: 0,
            side: THREE.DoubleSide
        })
    );
    mesh.rotation.x = -Math.PI / 2;
    return mesh;
}

function createForceLine(color) {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute([0, 0, 0, 0, 0, 0], 3));
    const material = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0
    });
    return {
        line: new THREE.Line(geometry, material),
        positions: geometry.attributes.position.array
    };
}

async function fetchClip(activityKey, speed = null, duration = null) {
    const requestToken = ++appState.clipRequestToken;
    clearRetryTimer();

    let loadingMsg = `正在加载 ${getActivityLabel(activityKey)} 演示片段...`;
    if (speed !== null || duration !== null) {
        loadingMsg = `正在生成 ${getActivityLabel(activityKey)} 序列...`;
    }
    showLoading(loadingMsg);

    try {
        let query = activityKey ? `?activity=${encodeURIComponent(activityKey)}` : "";
        if (speed !== null) {
            query += `&speed=${speed}`;
        }
        if (duration !== null) {
            query += `&duration=${duration}`;
        }

        const response = await fetch(`/api/clip${query}`, { cache: "no-store" });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const payload = await response.json();
        if (requestToken !== appState.clipRequestToken) {
            return;
        }

        if (payload.status !== "ok" || !payload.clip || !Array.isArray(payload.clip.frames) || payload.clip.frames.length === 0) {
            setConnectionMode("booting", "步态片段生成中");
            pushStatus("片段尚未准备完成，系统正在继续推理。", "info");
            scheduleClipRetry(activityKey);
            return;
        }

        appState.clip = payload.clip;
        appState.activityMode = payload.activity && payload.activity.key ? payload.activity.key : activityKey || appState.activityMode;
        appState.motionPaused = false;
        appState.playbackStartedAt = performance.now();
        appState.playbackPausedAt = 0;
        appState.currentFrameIndex = 0;
        appState.lastUiRefresh = 0;
        appState.scrubbing = false;
        appState.scrubPosition = 0;
        updateActivityButtons();
        syncMotionButton();
        hideLoading();
        setConnectionMode("live", "实时监测中");
        pushStatus(
            `${getActivityLabel(appState.activityMode)} 监测已启动，步态周期 ${formatNumber(appState.clip.duration_sec || 0, 1)} s，已采集 ${formatNumber(appState.clip.playback_duration_sec || 0, 1)} s。`,
            "success"
        );

        const sample = getPlaybackSample(performance.now());
        if (sample) {
            const visualFrame = applyFrameSample(sample);
            refreshUiFromFrame(visualFrame, appState.clip.metrics || {}, performance.now());
        }
    } catch (error) {
        if (requestToken !== appState.clipRequestToken) {
            return;
        }
        console.error(error);
        showFatalError(`片段加载失败: ${error.message}`);
    }
}

function scheduleClipRetry(activityKey) {
    clearRetryTimer();
    appState.retryTimer = window.setTimeout(() => {
        fetchClip(activityKey);
    }, RETRY_DELAY_MS);
}

function clearRetryTimer() {
    if (appState.retryTimer) {
        clearTimeout(appState.retryTimer);
        appState.retryTimer = null;
    }
}

async function setActivity(activityKey) {
    if (!activityKey || (activityKey === appState.activityMode && appState.clip)) {
        return;
    }

    appState.activityMode = activityKey;
    updateActivityButtons();
    setConnectionMode("booting", `正在切换到${getActivityLabel(activityKey)}`);
    showLoading(`正在准备 ${getActivityLabel(activityKey)} 演示片段...`);

    try {
        const response = await fetch("/api/activity", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ activity: activityKey })
        });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        await response.json();
        await fetchClip(activityKey);
    } catch (error) {
        console.warn("Failed to switch activity:", error);
        setConnectionMode("demo", "活动切换失败");
        pushStatus(`活动切换失败: ${error.message}`, "error");
    }
}

function getPlaybackState(now) {
    if (!appState.clip) {
        return { progressSec: 0, totalDurationSec: 0, uniquePlaybackSec: 0 };
    }

    const elapsedMs = appState.motionPaused
        ? Math.max(0, appState.playbackPausedAt - appState.playbackStartedAt)
        : Math.max(0, now - appState.playbackStartedAt);
    const totalDurationSec = Number(appState.clip.playback_duration_sec || 0);
    const uniquePlaybackSec = Number(
        appState.clip.unique_playback_duration_sec
        || ((appState.clip.duration_sec || 0) / Math.max(appState.clip.playback_rate || 1, 0.01))
        || 0
    );
    return {
        progressSec: totalDurationSec > 0 ? (elapsedMs / 1000) % totalDurationSec : 0,
        totalDurationSec,
        uniquePlaybackSec
    };
}

function getPlaybackSample(now) {
    const clip = appState.clip;
    if (!clip || !Array.isArray(clip.frames) || clip.frames.length === 0) {
        return null;
    }

    const uniqueDurationSec = Number(clip.unique_duration_sec || clip.duration_sec || 0);
    const playbackRate = Math.max(Number(clip.playback_rate || 1), 0.01);
    const frameRate = Math.max(Number(clip.frame_rate || 0), 1);
    const elapsedMs = appState.motionPaused
        ? Math.max(0, appState.playbackPausedAt - appState.playbackStartedAt)
        : Math.max(0, now - appState.playbackStartedAt);
    const uniqueElapsedSec = uniqueDurationSec > 0
        ? ((elapsedMs / 1000) * playbackRate) % uniqueDurationSec
        : 0;
    const frameFloat = (uniqueElapsedSec * frameRate) % clip.frames.length;
    const baseIndex = Math.floor(frameFloat);
    const nextIndex = (baseIndex + 1) % clip.frames.length;
    const alpha = frameFloat - baseIndex;

    appState.currentFrameIndex = baseIndex;
    return {
        frameA: clip.frames[baseIndex],
        frameB: clip.frames[nextIndex],
        alpha,
        frameFloat
    };
}

function animate(now) {
    const dt = Math.max(0.001, (now - appState.lastFrameTime) / 1000);
    appState.lastFrameTime = now;

    if (appState.controls) {
        appState.controls.update();
    }

    if (appState.clip && Array.isArray(appState.clip.frames) && appState.clip.frames.length > 0) {
        let sample;
        if (appState.scrubbing || appState.motionPaused) {
            const totalDuration = appState.clip.playback_duration_sec || 1;
            const targetTime = appState.scrubPosition * totalDuration;
            sample = getSampleAtTime(targetTime);
        } else {
            sample = getPlaybackSample(now);
        }

        if (sample) {
            const visualFrame = applyFrameSample(sample);
            if (now - appState.lastUiRefresh >= UI_REFRESH_MS) {
                refreshUiFromFrame(visualFrame, appState.clip.metrics || {}, now);
                appState.lastUiRefresh = now;
            }
        }
    }

    applyControlMotion(dt);
    updateFps(dt);
    if (appState.renderer && appState.scene && appState.camera) {
        appState.renderer.render(appState.scene, appState.camera);
    }

    appState.renderLoopId = requestAnimationFrame(animate);
}

function getSampleAtTime(targetTime) {
    if (!appState.clip || !appState.clip.frames || appState.clip.frames.length === 0) {
        return null;
    }

    const frames = appState.clip.frames;
    const totalDuration = appState.clip.playback_duration_sec || 1;
    const frameRate = appState.clip.display_frame_rate || 20;
    const frameDuration = 1 / frameRate;

    let accumulatedTime = 0;
    for (let i = 0; i < frames.length - 1; i++) {
        const nextTime = accumulatedTime + frameDuration;
        if (targetTime >= accumulatedTime && targetTime < nextTime) {
            const alpha = (targetTime - accumulatedTime) / frameDuration;
            return { frameA: frames[i], frameB: frames[i + 1], alpha };
        }
        accumulatedTime = nextTime;
    }

    return { frameA: frames[frames.length - 1], frameB: frames[frames.length - 1], alpha: 0 };
}

function applyFrameSample(sample) {
    const { frameA, frameB, alpha } = sample;
    const { matrixA, matrixB, quatA, quatB } = appState.temp;

    appState.jointVectors.forEach((vector, index) => {
        const jointA = frameA.joints[index];
        const jointB = frameB.joints[index];
        vector.set(
            lerp(jointA[0], jointB[0], alpha),
            lerp(jointA[1], jointB[1], alpha),
            lerp(jointA[2], jointB[2], alpha)
        );
    });

    Object.entries(appState.rig.segmentGroups).forEach(([segmentName, group]) => {
        const segmentA = frameA.segments ? frameA.segments[segmentName] : null;
        const segmentB = frameB.segments ? (frameB.segments[segmentName] || segmentA) : segmentA;
        if (!segmentA || !segmentB) {
            group.visible = false;
            return;
        }

        group.visible = true;
        group.position.set(
            lerp(segmentA.position_cm[0], segmentB.position_cm[0], alpha),
            lerp(segmentA.position_cm[1], segmentB.position_cm[1], alpha),
            lerp(segmentA.position_cm[2], segmentB.position_cm[2], alpha)
        );

        matrixA.set(
            segmentA.rotation[0], segmentA.rotation[1], segmentA.rotation[2], 0,
            segmentA.rotation[3], segmentA.rotation[4], segmentA.rotation[5], 0,
            segmentA.rotation[6], segmentA.rotation[7], segmentA.rotation[8], 0,
            0, 0, 0, 1
        );
        matrixB.set(
            segmentB.rotation[0], segmentB.rotation[1], segmentB.rotation[2], 0,
            segmentB.rotation[3], segmentB.rotation[4], segmentB.rotation[5], 0,
            segmentB.rotation[6], segmentB.rotation[7], segmentB.rotation[8], 0,
            0, 0, 0, 1
        );
        quatA.setFromRotationMatrix(matrixA);
        quatB.setFromRotationMatrix(matrixB);
        quatA.slerp(quatB, alpha);
        group.quaternion.copy(quatA);
    });

    const leftLeg = blendLeg(frameA.left, frameB.left, alpha, appState.renderLeft);
    const rightLeg = blendLeg(frameA.right, frameB.right, alpha, appState.renderRight);
    const leftContact = isVisualContact(leftLeg);
    const rightContact = isVisualContact(rightLeg);

    updatePlantarOverlay(
        appState.rig.plantar.left,
        appState.jointVectors[JOINT_INDEX.calcn_l],
        appState.jointVectors[JOINT_INDEX.mtp_l],
        appState.jointVectors[JOINT_INDEX.ankle_l],
        leftLeg,
        leftContact
    );
    updatePlantarOverlay(
        appState.rig.plantar.right,
        appState.jointVectors[JOINT_INDEX.calcn_r],
        appState.jointVectors[JOINT_INDEX.mtp_r],
        appState.jointVectors[JOINT_INDEX.ankle_r],
        rightLeg,
        rightContact
    );

    updateContactRing(
        appState.rig.rings.left,
        appState.jointVectors[JOINT_INDEX.calcn_l],
        appState.jointVectors[JOINT_INDEX.mtp_l],
        leftLeg,
        leftContact
    );
    updateContactRing(
        appState.rig.rings.right,
        appState.jointVectors[JOINT_INDEX.calcn_r],
        appState.jointVectors[JOINT_INDEX.mtp_r],
        rightLeg,
        rightContact
    );

    updateForceLine(
        appState.rig.forces.left,
        appState.jointVectors[JOINT_INDEX.calcn_l],
        appState.jointVectors[JOINT_INDEX.mtp_l],
        leftLeg,
        leftContact
    );
    updateForceLine(
        appState.rig.forces.right,
        appState.jointVectors[JOINT_INDEX.calcn_r],
        appState.jointVectors[JOINT_INDEX.mtp_r],
        rightLeg,
        rightContact
    );

    const visualFrame = blendFrames(frameA, frameB, alpha, appState.uiFrame);
    visualFrame.left = leftLeg;
    visualFrame.right = rightLeg;
    return visualFrame;
}

function updatePlantarOverlay(overlay, heel, toe, ankle, leg, isContact) {
    const { midpoint, delta, flatForward, yawQuaternion, pitchQuaternion, pitchAxis } = appState.temp;
    midpoint.copy(heel).add(toe).multiplyScalar(0.5);
    delta.copy(toe).sub(heel);
    const length = Math.max(delta.length(), 0.001);
    const minY = Math.min(heel.y, toe.y);
    const foreLoad = Math.max(leg.contact.ball || 0, leg.contact.toe || 0);
    const rearLoad = Math.max(leg.contact.heel || 0, leg.contact.arch || 0);

    flatForward.set(delta.x, 0, delta.z);
    if (flatForward.lengthSq() < 0.0001) {
        flatForward.set(0, 0, 1);
    }

    const bonePitchDeg = THREE.MathUtils.radToDeg(
        Math.atan2(delta.y, Math.sqrt(delta.x * delta.x + delta.z * delta.z) + 1e-6)
    );
    const anchorBias = clamp(0.5 + (foreLoad - rearLoad) * 0.08, 0.42, 0.58);
    const anchorX = lerp(heel.x, toe.x, anchorBias);
    const anchorZ = lerp(heel.z, toe.z, anchorBias);
    const contactY = minY + overlay.soleHeight;
    overlay.group.visible = !!isContact;
    if (!isContact) {
        return;
    }

    overlay.group.position.set(anchorX, contactY, anchorZ);
    overlay.group.scale.set(1, 1, length / overlay.baseLength);
    yawQuaternion.setFromUnitVectors(appState.temp.forward, flatForward.normalize());
    pitchQuaternion.setFromAxisAngle(
        pitchAxis,
        THREE.MathUtils.degToRad(clamp((rearLoad - foreLoad) * 11 + bonePitchDeg * 0.15, -9, 9))
    );
    overlay.group.quaternion.copy(yawQuaternion).multiply(pitchQuaternion);

    Object.entries(overlay.zones).forEach(([zoneName, mesh]) => {
        const intensity = clamp(leg.contact[zoneName] || 0, 0, 1);
        mesh.material.opacity = 0.04 + intensity * 0.42;
        mesh.material.emissiveIntensity = 0.14 + intensity * 0.72;
        mesh.scale.y = 1 + intensity * 1.8;
    });

    overlay.toeMarkers.forEach((mesh, index) => {
        mesh.material.opacity = 0.04 + (leg.contact.toe || 0) * 0.36;
        mesh.material.emissiveIntensity = 0.12 + (leg.contact.toe || 0) * 0.54;
        mesh.scale.y = 1 + (leg.contact.toe || 0) * 0.2 + index * 0.015;
    });
}

function derivePlantarAnchor(heel, toe, leg) {
    const rearWeight = 0.52 + (leg.contact.heel || 0) * 1.18 + (leg.contact.arch || 0) * 0.44;
    const foreWeight = 0.48 + (leg.contact.ball || 0) * 1.02 + (leg.contact.toe || 0) * 1.16;
    const total = rearWeight + foreWeight;

    return appState.temp.anchor.set(
        (heel.x * rearWeight + toe.x * foreWeight) / total,
        0,
        (heel.z * rearWeight + toe.z * foreWeight) / total
    );
}

function updateContactRing(mesh, heel, toe, leg, isContact) {
    const anchor = derivePlantarAnchor(heel, toe, leg);
    const rearLoad = Math.max(leg.contact.heel || 0, leg.contact.arch || 0);
    const foreLoad = Math.max(leg.contact.ball || 0, leg.contact.toe || 0);

    mesh.position.set(anchor.x, 0.16, anchor.z);
    mesh.scale.set(0.72 + rearLoad * 0.42, 1.0 + foreLoad * 0.5, 1);
    mesh.material.opacity = isContact ? 0.08 + Math.max(rearLoad, foreLoad) * 0.24 : 0;
}

function updateForceLine(forceLine, heel, toe, leg, isContact) {
    const anchor = derivePlantarAnchor(heel, toe, leg);
    const length = clamp((leg.force_vy || 0) * 30, 0, 36);
    forceLine.positions[0] = anchor.x;
    forceLine.positions[1] = 0.8;
    forceLine.positions[2] = anchor.z;
    forceLine.positions[3] = anchor.x;
    forceLine.positions[4] = 0.8 + length;
    forceLine.positions[5] = anchor.z;
    forceLine.line.geometry.attributes.position.needsUpdate = true;
    forceLine.line.material.opacity = isContact ? 0.82 : 0;
}

function blendFrames(frameA, frameB, alpha, target = null) {
    const frame = target || createReusableUiFrame();
    frame.index = frameA.index;

    frame.joints.forEach((joint, index) => {
        joint[0] = lerp(frameA.joints[index][0], frameB.joints[index][0], alpha);
        joint[1] = lerp(frameA.joints[index][1], frameB.joints[index][1], alpha);
        joint[2] = lerp(frameA.joints[index][2], frameB.joints[index][2], alpha);
    });

    frame.pelvis.x_cm = lerp(frameA.pelvis.x_cm, frameB.pelvis.x_cm, alpha);
    frame.pelvis.y_cm = lerp(frameA.pelvis.y_cm, frameB.pelvis.y_cm, alpha);
    frame.pelvis.z_cm = lerp(frameA.pelvis.z_cm, frameB.pelvis.z_cm, alpha);
    frame.metrics = blendMetricState(frameA.metrics, frameB.metrics, alpha, frame.metrics);
    frame.left = blendLeg(frameA.left, frameB.left, alpha, frame.left);
    frame.right = blendLeg(frameA.right, frameB.right, alpha, frame.right);
    return frame;
}

function blendLeg(legA, legB, alpha, target = null) {
    const leg = target || createReusableLegState();
    leg.phase_label_cn = alpha < 0.5 ? legA.phase_label_cn : legB.phase_label_cn;
    leg.phase_group = alpha < 0.5 ? legA.phase_group : legB.phase_group;
    leg.stance = lerp(legA.stance || 0, legB.stance || 0, alpha);
    leg.is_contact = alpha < 0.5 ? !!legA.is_contact : !!legB.is_contact;
    leg.hip_angle_deg = lerp(legA.hip_angle_deg || 0, legB.hip_angle_deg || 0, alpha);
    leg.knee_angle_deg = lerp(legA.knee_angle_deg || 0, legB.knee_angle_deg || 0, alpha);
    leg.ankle_angle_deg = lerp(legA.ankle_angle_deg || 0, legB.ankle_angle_deg || 0, alpha);
    leg.foot_pitch_deg = lerp(legA.foot_pitch_deg || 0, legB.foot_pitch_deg || 0, alpha);
    leg.foot_speed_mps = lerp(legA.foot_speed_mps || 0, legB.foot_speed_mps || 0, alpha);
    leg.clearance_cm = lerp(legA.clearance_cm || 0, legB.clearance_cm || 0, alpha);
    leg.force_vy = lerp(legA.force_vy || 0, legB.force_vy || 0, alpha);
    leg.cop_progress = lerp(legA.cop_progress || 0, legB.cop_progress || 0, alpha);
    leg.rear_load = lerp(legA.rear_load || 0, legB.rear_load || 0, alpha);
    leg.fore_load = lerp(legA.fore_load || 0, legB.fore_load || 0, alpha);
    leg.contact.heel = lerp(legA.contact.heel || 0, legB.contact.heel || 0, alpha);
    leg.contact.arch = lerp(legA.contact.arch || 0, legB.contact.arch || 0, alpha);
    leg.contact.ball = lerp(legA.contact.ball || 0, legB.contact.ball || 0, alpha);
    leg.contact.toe = lerp(legA.contact.toe || 0, legB.contact.toe || 0, alpha);
    leg.pressure.forEach((_, index) => {
        leg.pressure[index] = lerp(legA.pressure[index] || 0, legB.pressure[index] || 0, alpha);
    });
    leg.pressure_mean = lerp(legA.pressure_mean || 0, legB.pressure_mean || 0, alpha);
    return leg;
}

function refreshUiFromFrame(frame, metrics, now) {
    const left = frame.left;
    const right = frame.right;
    const globalPhase = deriveGlobalPhase(left, right);
    const playback = getPlaybackState(now);
    const liveMetrics = frame.metrics || metrics || {};

    updateText(appState.ui.stepFrequency, formatNumber(liveMetrics.step_frequency ?? metrics.step_frequency ?? 0, 1));
    updateText(appState.ui.strideLength, formatNumber(liveMetrics.stride_length ?? metrics.stride_length ?? 0, 1));
    updateText(appState.ui.gaitSpeed, formatNumber(liveMetrics.gait_speed ?? metrics.gait_speed ?? 0, 2));
    updateText(appState.ui.symmetry, formatNumber(((liveMetrics.symmetry ?? metrics.symmetry) || 0) * 100, 1));
    updateText(appState.ui.stability, formatNumber(((liveMetrics.stability ?? metrics.stability) || 0) * 100, 1));
    updateText(
        appState.ui.cycleDuration,
        formatNumber(liveMetrics.cycle_duration_sec || metrics.cycle_duration_sec || metrics.duration_sec || 0, 2)
    );
    updateText(appState.ui.loopDuration, formatNumber(playback.totalDurationSec || 0, 1));
    updateText(appState.ui.flightRatio, formatNumber(((liveMetrics.flight_ratio ?? metrics.flight_ratio) || 0) * 100, 1));
    updateText(
        appState.ui.doubleSupportRatio,
        formatNumber(((liveMetrics.double_support_ratio ?? metrics.double_support_ratio) || 0) * 100, 1)
    );

    updateMetricsHistory(liveMetrics, metrics);

    updateLegPanel("left", left);
    updateLegPanel("right", right);
    updateLegStatusRail("left", left);
    updateLegStatusRail("right", right);

    updateText(appState.ui.activityLabel, getActivityLabel(appState.activityMode));
    updateText(appState.ui.phasePill, globalPhase.label);
    if (appState.ui.phasePillMini) {
        updateText(appState.ui.phasePillMini, globalPhase.label);
    }
    updateText(
        appState.ui.modeLabel,
        `周期 ${formatNumber(liveMetrics.cycle_duration_sec || metrics.cycle_duration_sec || metrics.duration_sec || 0, 2)} s`
    );
    updateText(
        appState.ui.pelvisDrift,
        `${formatNumber(frame.pelvis.y_cm || 0, 1)} cm`
    );

    if (appState.ui.phaseProgress) {
        appState.ui.phaseProgress.style.width = `${computeCycleProgress(now).toFixed(1)}%`;
    }

    if (appState.ui.playbackSlider && !appState.scrubbing && !appState.motionPaused) {
        const progress = (playback.progressSec / playback.totalDurationSec) * 100 || 0;
        appState.ui.playbackSlider.value = progress;
        appState.scrubPosition = progress / 100;
    }

    if (appState.ui.currentTime) {
        updateText(appState.ui.currentTime, `${formatNumber(playback.progressSec || 0, 1)}s`);
    }

    if (appState.ui.totalTime) {
        updateText(appState.ui.totalTime, `${formatNumber(playback.totalDurationSec || 0, 1)}s`);
    }

    updateText(appState.ui.temp, `${formatNumber(Math.max(left.force_vy || 0, right.force_vy || 0), 2)} BW`);
    updateText(appState.ui.battery, `${formatNumber(playback.progressSec || 0, 1)} / ${formatNumber(playback.totalDurationSec || 0, 1)} s`);
    updateText(appState.ui.timestamp, appState.clip ? appState.clip.generated_at || formatTimestamp(new Date()) : "--");
    updateText(appState.ui.dataMode, appState.geometryReady ? "下肢显示几何" : "基础压力覆盖");
}

function updateLegPanel(side, leg) {
    const isLeft = side === "left";
    const stateNode = isLeft ? appState.ui.leftState : appState.ui.rightState;
    const stanceNode = isLeft ? appState.ui.leftStance : appState.ui.rightStance;
    const stanceBar = isLeft ? appState.ui.leftStanceBar : appState.ui.rightStanceBar;
    const thighNode = isLeft ? appState.ui.leftThighAngle : appState.ui.rightThighAngle;
    const kneeNode = isLeft ? appState.ui.leftKneeFlex : appState.ui.rightKneeFlex;
    const ankleNode = isLeft ? appState.ui.leftAnkleAngle : appState.ui.rightAnkleAngle;
    const insoleNode = isLeft ? appState.ui.leftInsoleAngle : appState.ui.rightInsoleAngle;
    const speedNode = isLeft ? appState.ui.leftFootSpeed : appState.ui.rightFootSpeed;
    const clearanceNode = isLeft ? appState.ui.leftClearance : appState.ui.rightClearance;
    const pressureSummary = isLeft ? appState.ui.leftPressureSummary : appState.ui.rightPressureSummary;
    const pressureNodes = isLeft ? appState.ui.leftPressureNodes : appState.ui.rightPressureNodes;

    updateText(stateNode, leg.phase_label_cn || "--");
    stateNode.classList.toggle("is-swing", !isVisualContact(leg));
    updateText(stanceNode, `${Math.round((leg.stance || 0) * 100)}%`);
    if (stanceBar) {
        stanceBar.style.width = `${Math.round((leg.stance || 0) * 100)}%`;
    }

    updateText(thighNode, `${formatNumber(leg.hip_angle_deg || 0, 1)}°`);
    updateText(kneeNode, `${formatNumber(leg.knee_angle_deg || 0, 1)}°`);
    updateText(ankleNode, `${formatNumber(leg.ankle_angle_deg || 0, 1)}°`);
    updateText(insoleNode, `${formatNumber(leg.foot_pitch_deg || 0, 1)}°`);
    updateText(speedNode, `${formatNumber(leg.foot_speed_mps || 0, 2)} m/s`);
    updateText(clearanceNode, `${formatNumber(leg.clearance_cm || 0, 1)} cm`);
    updateText(pressureSummary, `平均 ${formatNumber(leg.pressure_mean || 0, 1)} kPa · ${describePressureLead(leg)}`);

    leg.pressure.forEach((value, index) => {
        paintPressure(pressureNodes[index], value, isLeft ? "left" : "right");
    });
}

function updateLegStatusRail(side, leg) {
    const isLeft = side === "left";
    const currentNode = isLeft ? appState.ui.leftPhaseLabel : appState.ui.rightPhaseLabel;
    const fillNode = isLeft ? appState.ui.leftPhaseProgress : appState.ui.rightPhaseProgress;
    const indicatorNode = isLeft ? appState.ui.leftPhaseIndicator : appState.ui.rightPhaseIndicator;
    const indicatorTextNode = isLeft ? appState.ui.leftPhaseIndicatorText : appState.ui.rightPhaseIndicatorText;
    const label = leg.phase_label_cn || "等待数据";
    const progress = computeLegRailProgress(leg);

    updateText(currentNode, label);
    updateText(indicatorTextNode, label);

    if (fillNode) {
        fillNode.style.width = `${Math.max(progress * 100, 5).toFixed(1)}%`;
    }

    if (indicatorNode) {
        indicatorNode.style.left = `${(progress * 100).toFixed(1)}%`;
        indicatorNode.classList.toggle("is-airborne", !isVisualContact(leg));
    }
}

function computeLegRailProgress(leg) {
    const fallbackProgress = isVisualContact(leg)
        ? 0.08 + clampNumber(leg.cop_progress || 0, 0, 1, 0.5) * 0.5
        : 0.66 + Math.min((leg.clearance_cm || 0) / (appState.activityMode === "run" ? 12 : 8), 1) * 0.28;

    let progress = PHASE_RAIL_POINTS[leg.phase_label_cn] ?? fallbackProgress;

    if (isVisualContact(leg)) {
        progress += clampNumber(leg.cop_progress || 0, 0, 1, 0.5) * 0.04;
    } else {
        progress += Math.min((leg.foot_speed_mps || 0) / 4.2, 1) * 0.03;
    }

    return clampNumber(progress, 0.03, 0.97, 0.5);
}

function deriveGlobalPhase(left, right) {
    const leftContact = isVisualContact(left);
    const rightContact = isVisualContact(right);

    if (!leftContact && !rightContact) {
        return {
            label: appState.activityMode === "run" ? "腾空期" : "摆动转换",
            detail: `左${left.phase_label_cn} / 右${right.phase_label_cn}`
        };
    }

    if (leftContact && rightContact) {
        let detail = `左${describePressureLead(left)} / 右${describePressureLead(right)}`;
        if ((left.rear_load || 0) >= 0.28 && (right.fore_load || 0) >= 0.28) {
            detail = "左脚承接 / 右脚蹬离";
        } else if ((right.rear_load || 0) >= 0.28 && (left.fore_load || 0) >= 0.28) {
            detail = "右脚承接 / 左脚蹬离";
        }
        return {
            label: "双支撑",
            detail
        };
    }

    const dominant = leftContact
        ? { prefix: "左侧", leg: left }
        : { prefix: "右侧", leg: right };
    return {
        label: `${dominant.prefix}${dominant.leg.phase_label_cn}`,
        detail: `左${left.phase_label_cn} / 右${right.phase_label_cn}`
    };
}

function isVisualContact(leg) {
    const contactLead = Math.max(
        leg.contact.heel || 0,
        leg.contact.arch || 0,
        leg.contact.ball || 0,
        leg.contact.toe || 0
    );
    if (!leg.is_contact || contactLead < 0.12) {
        return false;
    }
    if ((leg.clearance_cm || 0) > 6 && contactLead < 0.22) {
        return false;
    }
    return true;
}

function computeCycleProgress(now) {
    if (!appState.clip || !appState.clip.metrics) {
        return 0;
    }
    const cycleDurationSec = Number(appState.clip.metrics.cycle_duration_sec || appState.clip.metrics.duration_sec || 0);
    const playbackRate = Math.max(Number(appState.clip.playback_rate || 1), 0.01);
    if (cycleDurationSec <= 0) {
        return 0;
    }
    const elapsedMs = appState.motionPaused
        ? Math.max(0, appState.playbackPausedAt - appState.playbackStartedAt)
        : Math.max(0, now - appState.playbackStartedAt);
    const cycleMs = (cycleDurationSec * 1000) / playbackRate;
    return ((elapsedMs % cycleMs) / cycleMs) * 100;
}

function describePressureLead(leg) {
    const averagePressure = average(leg.pressure || []);
    const heel = leg.contact.heel || 0;
    const arch = leg.contact.arch || 0;
    const ball = leg.contact.ball || 0;
    const toe = leg.contact.toe || 0;
    const forefoot = Math.max(ball, toe);

    if (averagePressure < 5) {
        return "离地减载";
    }
    if (heel > forefoot + 0.16) {
        return "脚跟缓冲";
    }
    if (toe > 0.58 && forefoot > heel + 0.12) {
        return "前掌脚趾推进";
    }
    if (forefoot > heel + 0.16) {
        return "前掌承重";
    }
    if (arch > 0.42) {
        return "中足过渡";
    }
    return "全脚掌稳定";
}

function paintPressure(node, value, side) {
    if (!node) {
        return;
    }
    const ratio = clamp((value || 0) / 130, 0, 1);
    const hue = side === "left" ? 188 - ratio * 28 : 220 - ratio * 22;
    const lightA = 34 + ratio * 16;
    const lightB = 48 + ratio * 10;

    node.textContent = Math.round(value || 0);
    node.style.background = `linear-gradient(155deg, hsl(${hue}, 38%, ${lightA}%), hsl(${hue - 8}, 54%, ${lightB}%))`;
    node.style.boxShadow = `0 10px 20px rgba(18, 33, 48, 0.14), 0 0 ${10 + ratio * 12}px rgba(${side === "left" ? "71,216,206" : "113,146,255"}, ${0.12 + ratio * 0.2})`;
    node.style.transform = `translateY(${-ratio * 2.2}px)`;
}

function setConnectionMode(mode, message) {
    const pill = appState.ui.connectionPill;
    if (!pill) {
        return;
    }
    pill.className = "pill";
    if (mode === "live") {
        pill.classList.add("pill-live");
    } else if (mode === "demo") {
        pill.classList.add("pill-warning");
    } else {
        pill.classList.add("pill-idle");
    }
    pill.textContent = message;
}

function updateActivityButtons() {
    appState.ui.activityButtons.forEach((button) => {
        button.classList.toggle("active", button.dataset.activity === appState.activityMode);
    });

    const ctrlWalkBtn = document.getElementById("ctrl-walk");
    const ctrlRunBtn = document.getElementById("ctrl-run");
    if (ctrlWalkBtn) {
        ctrlWalkBtn.classList.toggle("is-active", appState.activityMode === "walk");
    }
    if (ctrlRunBtn) {
        ctrlRunBtn.classList.toggle("is-active", appState.activityMode === "run");
    }
}

function getActivityLabel(activityKey) {
    return ACTIVITY_LABELS[activityKey] || ACTIVITY_LABELS.walk;
}

function setControlPanelOpen(open) {
    const nextOpen = Boolean(open);
    appState.control.panelOpen = nextOpen;

    if (appState.ui.floatingPanel) {
        appState.ui.floatingPanel.classList.toggle("is-open", nextOpen);
    }
    if (appState.ui.controlBackdrop) {
        appState.ui.controlBackdrop.classList.toggle("is-open", nextOpen);
    }
    if (appState.ui.controlPanelButton) {
        appState.ui.controlPanelButton.textContent = nextOpen ? "隐藏控制面板" : "显示控制面板";
    }
    if (appState.ui.appContainer) {
        appState.ui.appContainer.classList.toggle("has-side-panel", nextOpen);
    }
}

function syncControlInputs() {
    const speed = clampNumber(appState.control.speedMps, 0.5, 5.0, 1.2);
    const duration = clampNumber(appState.control.durationSec, 10, 60, 30);
    const ctrlSpeedSlider = document.getElementById("ctrl-speed");
    const ctrlSpeedVal = document.getElementById("ctrl-speed-val");
    const ctrlDurationSlider = document.getElementById("ctrl-duration");
    const ctrlDurationVal = document.getElementById("ctrl-duration-val");

    appState.control.speedMps = speed;
    appState.control.durationSec = duration;

    if (appState.ui.speedInput) {
        appState.ui.speedInput.value = speed.toFixed(1);
    }
    if (appState.ui.durationInput) {
        appState.ui.durationInput.value = String(duration);
    }
    if (ctrlSpeedSlider) {
        ctrlSpeedSlider.value = speed.toFixed(1);
    }
    if (ctrlSpeedVal) {
        ctrlSpeedVal.textContent = `${speed.toFixed(1)} m/s`;
    }
    if (ctrlDurationSlider) {
        ctrlDurationSlider.value = String(duration);
    }
    if (ctrlDurationVal) {
        ctrlDurationVal.textContent = `${duration.toFixed(0)} 秒`;
    }
}

function syncControlStatusPanel() {
    updateText(appState.ui.ctrlStatus, appState.control.statusText || "空闲");
    updateText(appState.ui.ctrlDirection, `${Math.round(normalizeAngle(appState.control.directionDeg))}°`);
}

function resetControlMotion() {
    appState.control.position.set(0, 0, 0);
    appState.control.directionDeg = 0;
    appState.control.joystickPower = 0;
    appState.control.moving = false;

    if (typeof appState.control.resetJoystickUi === "function") {
        appState.control.resetJoystickUi();
    }

    appState.control.statusText = "空闲";

    if (appState.rig && appState.rig.root) {
        appState.rig.root.position.set(0, 0, 0);
        appState.rig.root.rotation.y = 0;
    }

    syncControlStatusPanel();
}

function applyControlMotion(dt) {
    if (!appState.rig || !appState.rig.root) {
        return;
    }

    const headingRad = (normalizeAngle(appState.control.directionDeg) * Math.PI) / 180;
    appState.rig.root.rotation.y = lerpAngle(appState.rig.root.rotation.y, headingRad, Math.min(1, dt * 7.2));

    if (appState.control.moving && appState.control.joystickPower > 0.01) {
        const speedScale = Math.max(0.16, appState.control.joystickPower);
        const velocity = appState.control.speedMps * CONTROL_SCENE_UNITS_PER_METER * speedScale;
        appState.control.position.x += Math.sin(headingRad) * velocity * dt;
        appState.control.position.z += Math.cos(headingRad) * velocity * dt;
        appState.control.position.x = clampNumber(appState.control.position.x, -CONTROL_SCENE_LIMITS.x, CONTROL_SCENE_LIMITS.x, 0);
        appState.control.position.z = clampNumber(appState.control.position.z, -CONTROL_SCENE_LIMITS.z, CONTROL_SCENE_LIMITS.z, 0);
    }

    appState.rig.root.position.set(appState.control.position.x, 0, appState.control.position.z);
}

function resetCamera() {
    if (!appState.camera) {
        return;
    }
    appState.camera.position.set(0, 136, 430);
    appState.camera.lookAt(0, 88, 0);
    if (appState.controls) {
        appState.controls.target.set(0, 88, 0);
        appState.controls.update();
    }
}

function toggleMotion() {
    if (!appState.motionPaused) {
        appState.motionPaused = true;
        appState.playbackPausedAt = performance.now();
    } else {
        const totalDuration = appState.clip.playback_duration_sec || 1;
        const resumeTime = appState.scrubPosition * totalDuration;
        appState.playbackStartedAt = performance.now() - resumeTime * 1000;
        appState.motionPaused = false;
        appState.playbackPausedAt = 0;
        appState.scrubbing = false;
    }
    syncMotionButton();
}

function syncMotionButton() {
    const { motionButton } = appState.ui;
    if (!motionButton) {
        return;
    }
    motionButton.textContent = appState.motionPaused ? "继续监测" : "暂停监测";
    motionButton.classList.toggle("active", !appState.motionPaused);
}

function toggleGrid(visible) {
    if (appState.environment) {
        appState.environment.grid.visible = visible;
    }
}

function handleResize() {
    const { container } = appState.ui;
    if (!container || !appState.camera || !appState.renderer) {
        return;
    }
    const width = Math.max(container.clientWidth, 320);
    const height = Math.max(container.clientHeight, 320);
    appState.camera.aspect = width / height;
    appState.camera.updateProjectionMatrix();
    appState.renderer.setSize(width, height);
    setControlPanelOpen(appState.control.panelOpen);
}

function cleanup() {
    clearRetryTimer();
    if (appState.healthTimer) {
        clearInterval(appState.healthTimer);
        appState.healthTimer = null;
    }
    if (appState.renderLoopId) {
        cancelAnimationFrame(appState.renderLoopId);
    }
    if (appState.controls) {
        appState.controls.dispose();
    }
    if (appState.renderer) {
        appState.renderer.dispose();
    }
}

function showLoading(message) {
    const { loading } = appState.ui;
    if (!loading) {
        return;
    }
    loading.classList.remove("hidden");
    loading.innerHTML = `
        <div class="spinner"></div>
        <p>${message}</p>
    `;
}

function hideLoading() {
    const { loading } = appState.ui;
    if (loading) {
        loading.classList.add("hidden");
    }
}

function showFatalError(message) {
    pushStatus(message, "error");
    const { loading } = appState.ui;
    if (!loading) {
        return;
    }
    loading.classList.remove("hidden");
    loading.innerHTML = `<div class="error-block">${message}</div>`;
}

function mapStatusTone(level) {
    if (level === "success" || level === "warning" || level === "error" || level === "info") {
        return level;
    }
    return "info";
}

function pushStatus(message, tone, timestamp = null) {
    const { statusLog } = appState.ui;
    if (!statusLog) {
        return;
    }
    const key = `${tone}:${message}`;
    if (appState.statusKeys.has(key)) {
        return;
    }
    appState.statusKeys.add(key);

    const item = document.createElement("div");
    item.className = `status-item tone-${tone}`;
    item.innerHTML = `<span class="status-dot"></span><div><strong>${message}</strong><small>${timestamp || formatTimestamp(new Date())}</small></div>`;
    statusLog.prepend(item);
    while (statusLog.children.length > MAX_STATUS_ITEMS) {
        statusLog.removeChild(statusLog.lastElementChild);
    }
}

function updateFps(dt) {
    if (!dt || dt <= 0) {
        return;
    }
    appState.fpsSamples.push(1 / dt);
    if (appState.fpsSamples.length > 24) {
        appState.fpsSamples.shift();
    }
    updateText(appState.ui.renderFps, `${Math.round(average(appState.fpsSamples))} FPS`);
}

function createReusableUiFrame() {
    return {
        index: 0,
        joints: Array.from({ length: Object.keys(JOINT_INDEX).length }, () => [0, 0, 0]),
        pelvis: { x_cm: 0, y_cm: 0, z_cm: 0 },
        metrics: createReusableMetricState(),
        left: createReusableLegState(),
        right: createReusableLegState()
    };
}

function createReusableMetricState() {
    return {
        step_frequency: 0,
        stride_length: 0,
        gait_speed: 0,
        symmetry: 0,
        stability: 0,
        cycle_duration_sec: 0,
        flight_ratio: 0,
        double_support_ratio: 0
    };
}

function blendMetricState(metricsA, metricsB, alpha, target = null) {
    const blended = target || createReusableMetricState();
    const sourceA = metricsA || {};
    const sourceB = metricsB || sourceA;
    blended.step_frequency = lerp(sourceA.step_frequency || 0, sourceB.step_frequency || 0, alpha);
    blended.stride_length = lerp(sourceA.stride_length || 0, sourceB.stride_length || 0, alpha);
    blended.gait_speed = lerp(sourceA.gait_speed || 0, sourceB.gait_speed || 0, alpha);
    blended.symmetry = lerp(sourceA.symmetry || 0, sourceB.symmetry || 0, alpha);
    blended.stability = lerp(sourceA.stability || 0, sourceB.stability || 0, alpha);
    blended.cycle_duration_sec = lerp(sourceA.cycle_duration_sec || 0, sourceB.cycle_duration_sec || 0, alpha);
    blended.flight_ratio = lerp(sourceA.flight_ratio || 0, sourceB.flight_ratio || 0, alpha);
    blended.double_support_ratio = lerp(sourceA.double_support_ratio || 0, sourceB.double_support_ratio || 0, alpha);
    return blended;
}

function createReusableLegState() {
    return {
        phase_label_cn: "--",
        phase_group: "unknown",
        stance: 0,
        is_contact: false,
        hip_angle_deg: 0,
        knee_angle_deg: 0,
        ankle_angle_deg: 0,
        foot_pitch_deg: 0,
        foot_speed_mps: 0,
        clearance_cm: 0,
        force_vy: 0,
        cop_progress: 0,
        rear_load: 0,
        fore_load: 0,
        contact: {
            heel: 0,
            arch: 0,
            ball: 0,
            toe: 0
        },
        pressure: new Array(8).fill(0),
        pressure_mean: 0
    };
}

function updateText(node, value) {
    if (node) {
        node.textContent = value;
    }
}

function formatTimestamp(date) {
    const pad = (value) => String(value).padStart(2, "0");
    return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function formatNumber(value, digits = 1) {
    if (!Number.isFinite(Number(value))) {
        return digits > 0 ? (0).toFixed(digits) : "0";
    }
    return Number(value).toFixed(digits);
}

function clampNumber(value, minimum, maximum, fallback = minimum) {
    const numeric = Number.isFinite(Number(value)) ? Number(value) : fallback;
    return Math.min(maximum, Math.max(minimum, numeric));
}

function normalizeAngle(value) {
    const numeric = Number.isFinite(Number(value)) ? Number(value) : 0;
    return ((numeric % 360) + 360) % 360;
}

function lerpAngle(current, target, alpha) {
    const delta = Math.atan2(Math.sin(target - current), Math.cos(target - current));
    return current + delta * alpha;
}

function average(values) {
    if (!values || values.length === 0) {
        return 0;
    }
    return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function lerp(a, b, alpha) {
    return a + (b - a) * alpha;
}

function clamp(value, minimum, maximum) {
    return Math.max(minimum, Math.min(maximum, value));
}

function initMetricsChart() {
    const canvas = document.getElementById("metrics-chart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    appState.metricsChart = {
        canvas: canvas,
        ctx: ctx,
        width: canvas.width,
        height: canvas.height
    };
}

function updateMetricsHistory(liveMetrics, fallbackMetrics) {
    const history = appState.metricsHistory;

    history.gaitSpeed.push(liveMetrics.gait_speed ?? fallbackMetrics.gait_speed ?? 0);
    history.stepFrequency.push(liveMetrics.step_frequency ?? fallbackMetrics.step_frequency ?? 0);
    history.symmetry.push((liveMetrics.symmetry ?? fallbackMetrics.symmetry ?? 0) * 100);
    history.stability.push((liveMetrics.stability ?? fallbackMetrics.stability ?? 0) * 100);

    if (history.gaitSpeed.length > history.maxPoints) {
        history.gaitSpeed.shift();
        history.stepFrequency.shift();
        history.symmetry.shift();
        history.stability.shift();
    }

    drawMetricsChart();
}

function drawMetricsChart() {
    if (!appState.metricsChart) return;

    const chart = appState.metricsChart;
    const ctx = chart.ctx;
    const width = chart.width;
    const height = chart.height;
    const history = appState.metricsHistory;

    ctx.clearRect(0, 0, width, height);

    const padding = { top: 20, right: 20, bottom: 30, left: 50 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    ctx.fillStyle = "rgba(15, 23, 42, 0.6)";
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "rgba(148, 163, 184, 0.2)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
        const y = padding.top + (chartHeight / 4) * i;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
        ctx.stroke();
    }

    if (history.gaitSpeed.length < 2) return;

    const datasets = [
        { data: history.gaitSpeed, color: "#22d3ee", label: "步速", scale: 2.0 },
        { data: history.stepFrequency, color: "#10b981", label: "步频", scale: 150 },
        { data: history.symmetry, color: "#a855f7", label: "对称性", scale: 100 },
        { data: history.stability, color: "#f59e0b", label: "稳定性", scale: 100 }
    ];

    datasets.forEach(dataset => {
        ctx.strokeStyle = dataset.color;
        ctx.lineWidth = 2;
        ctx.beginPath();

        dataset.data.forEach((value, index) => {
            const x = padding.left + (chartWidth / (history.maxPoints - 1)) * index;
            const normalizedValue = value / dataset.scale;
            const y = padding.top + chartHeight - (normalizedValue * chartHeight);

            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.stroke();
    });

    ctx.fillStyle = "#94a3b8";
    ctx.font = "11px monospace";
    ctx.textAlign = "right";
    ctx.fillText("100%", padding.left - 5, padding.top + 10);
    ctx.fillText("0%", padding.left - 5, padding.top + chartHeight);

    ctx.textAlign = "center";
    const legendY = height - 8;
    let legendX = padding.left + 20;
    datasets.forEach(dataset => {
        ctx.fillStyle = dataset.color;
        ctx.fillRect(legendX, legendY - 8, 12, 3);
        ctx.fillStyle = "#94a3b8";
        ctx.fillText(dataset.label, legendX + 30, legendY);
        legendX += 100;
    });
}

// ==================== 虚拟摇杆控制 ====================
const joystickCanvas = document.getElementById("joystick-canvas");
if (joystickCanvas) {
    const joyCtx = joystickCanvas.getContext("2d");
    const joystickAngleDisplay = document.getElementById("joystick-angle");
    const joystickPowerDisplay = document.getElementById("joystick-power");

    const joystickState = {
        active: false,
        centerX: 100,
        centerY: 100,
        maxRadius: 80,
        stickX: 100,
        stickY: 100,
        angle: 0,
        power: 0
    };

    function drawJoystick() {
        joyCtx.clearRect(0, 0, 200, 200);

        // 绘制外圈
        joyCtx.strokeStyle = "rgba(34, 211, 238, 0.3)";
        joyCtx.lineWidth = 2;
        joyCtx.beginPath();
        joyCtx.arc(joystickState.centerX, joystickState.centerY, joystickState.maxRadius, 0, Math.PI * 2);
        joyCtx.stroke();

        // 绘制中心点
        joyCtx.fillStyle = "rgba(34, 211, 238, 0.2)";
        joyCtx.beginPath();
        joyCtx.arc(joystickState.centerX, joystickState.centerY, 10, 0, Math.PI * 2);
        joyCtx.fill();

        // 绘制摇杆
        const gradient = joyCtx.createRadialGradient(
            joystickState.stickX, joystickState.stickY, 0,
            joystickState.stickX, joystickState.stickY, 30
        );
        gradient.addColorStop(0, "#22d3ee");
        gradient.addColorStop(1, "#3b82f6");

        joyCtx.fillStyle = gradient;
        joyCtx.beginPath();
        joyCtx.arc(joystickState.stickX, joystickState.stickY, 30, 0, Math.PI * 2);
        joyCtx.fill();

        joyCtx.strokeStyle = "rgba(255, 255, 255, 0.5)";
        joyCtx.lineWidth = 2;
        joyCtx.stroke();

        // 绘制方向线
        if (joystickState.power > 0) {
            joyCtx.strokeStyle = "#22d3ee";
            joyCtx.lineWidth = 3;
            joyCtx.beginPath();
            joyCtx.moveTo(joystickState.centerX, joystickState.centerY);
            joyCtx.lineTo(joystickState.stickX, joystickState.stickY);
            joyCtx.stroke();
        }
    }

    function updateJoystickPosition(x, y) {
        const dx = x - joystickState.centerX;
        const dy = y - joystickState.centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > joystickState.maxRadius) {
            const angle = Math.atan2(dy, dx);
            joystickState.stickX = joystickState.centerX + Math.cos(angle) * joystickState.maxRadius;
            joystickState.stickY = joystickState.centerY + Math.sin(angle) * joystickState.maxRadius;
            joystickState.power = 100;
        } else {
            joystickState.stickX = x;
            joystickState.stickY = y;
            joystickState.power = Math.round((distance / joystickState.maxRadius) * 100);
        }

        // 计算角度（0度为正上方，顺时针）
        const angleRad = Math.atan2(dy, dx);
        let angleDeg = (angleRad * 180 / Math.PI) + 90;
        if (angleDeg < 0) angleDeg += 360;
        joystickState.angle = Math.round(angleDeg);

        // 更新显示
        if (joystickAngleDisplay) {
            joystickAngleDisplay.textContent = `角度: ${joystickState.angle}°`;
        }
        if (joystickPowerDisplay) {
            joystickPowerDisplay.textContent = `力度: ${joystickState.power}%`;
        }

        appState.control.directionDeg = joystickState.angle;
        appState.control.joystickPower = joystickState.power / 100;
        appState.control.moving = joystickState.power > 6;
        appState.control.statusText = appState.control.moving
            ? `${getActivityLabel(appState.activityMode)}中`
            : `${getActivityLabel(appState.activityMode)}待命`;

        if (appState.control.moving && appState.motionPaused && appState.clip) {
            toggleMotion();
        }
        syncControlStatusPanel();

        drawJoystick();
    }

    function resetJoystick() {
        joystickState.stickX = joystickState.centerX;
        joystickState.stickY = joystickState.centerY;
        joystickState.angle = 0;
        joystickState.power = 0;

        if (joystickAngleDisplay) {
            joystickAngleDisplay.textContent = "角度: 0°";
        }
        if (joystickPowerDisplay) {
            joystickPowerDisplay.textContent = "力度: 0%";
        }

        appState.control.joystickPower = 0;
        appState.control.moving = false;
        appState.control.statusText = appState.motionPaused ? "已暂停" : `${getActivityLabel(appState.activityMode)}待命`;
        syncControlStatusPanel();
        drawJoystick();
    }

    // 鼠标事件
    joystickCanvas.addEventListener("mousedown", (e) => {
        joystickState.active = true;
        const rect = joystickCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        updateJoystickPosition(x, y);
    });

    joystickCanvas.addEventListener("mousemove", (e) => {
        if (joystickState.active) {
            const rect = joystickCanvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            updateJoystickPosition(x, y);
        }
    });

    joystickCanvas.addEventListener("mouseup", () => {
        joystickState.active = false;
        resetJoystick();
    });

    joystickCanvas.addEventListener("mouseleave", () => {
        if (joystickState.active) {
            joystickState.active = false;
            resetJoystick();
        }
    });

    // 触摸事件（移动端支持）
    joystickCanvas.addEventListener("touchstart", (e) => {
        e.preventDefault();
        joystickState.active = true;
        const rect = joystickCanvas.getBoundingClientRect();
        const touch = e.touches[0];
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        updateJoystickPosition(x, y);
    });

    joystickCanvas.addEventListener("touchmove", (e) => {
        e.preventDefault();
        if (joystickState.active) {
            const rect = joystickCanvas.getBoundingClientRect();
            const touch = e.touches[0];
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            updateJoystickPosition(x, y);
        }
    });

    joystickCanvas.addEventListener("touchend", (e) => {
        e.preventDefault();
        joystickState.active = false;
        resetJoystick();
    });

    appState.control.resetJoystickUi = resetJoystick;

    // 初始化绘制
    drawJoystick();
}
