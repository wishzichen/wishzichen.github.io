/**
 * 智护银龄 - 实时监测前端脚本
 */

const POLL_INTERVAL_MS = 150;
const MAX_LOG_ITEMS = 8;

const runtime = {
    apiBase: (window.REALTIME_APP_CONFIG && window.REALTIME_APP_CONFIG.apiBase) || "/api",
    pollTimer: null,
    requestInFlight: false,
    ui: {},
    latestState: null
};

document.addEventListener("DOMContentLoaded", () => {
    bootRealtimePage();
});

async function bootRealtimePage() {
    cacheDom();
    bindControls();
    await loadConfig();
    await refreshState();
    scheduleNextPoll();
}

function cacheDom() {
    runtime.ui = {
        connectionPill: document.getElementById("connection-pill"),
        healthPill: document.getElementById("health-pill"),
        statusIndicator: document.getElementById("status-indicator"),
        currentMode: document.getElementById("current-mode"),
        currentActivity: document.getElementById("current-activity"),
        stepCount: document.getElementById("step-count"),
        distance: document.getElementById("distance"),
        duration: document.getElementById("duration"),
        speedSlider: document.getElementById("speed-slider"),
        speedValue: document.getElementById("speed-value"),
        directionSlider: document.getElementById("direction-slider"),
        directionValue: document.getElementById("direction-value"),
        metricCadence: document.getElementById("metric-cadence"),
        metricStride: document.getElementById("metric-stride"),
        metricSpeed: document.getElementById("metric-speed"),
        metricSymmetry: document.getElementById("metric-symmetry"),
        metricStability: document.getElementById("metric-stability"),
        metricHeart: document.getElementById("metric-heart"),
        metricCycle: document.getElementById("metric-cycle"),
        metricStance: document.getElementById("metric-stance"),
        metricFlight: document.getElementById("metric-flight"),
        lastUpdated: document.getElementById("last-updated"),
        leftPhase: document.getElementById("left-phase"),
        leftHip: document.getElementById("left-hip"),
        leftKnee: document.getElementById("left-knee"),
        leftAnkle: document.getElementById("left-ankle"),
        leftForce: document.getElementById("left-force"),
        leftClearance: document.getElementById("left-clearance"),
        leftFootSpeed: document.getElementById("left-foot-speed"),
        rightPhase: document.getElementById("right-phase"),
        rightHip: document.getElementById("right-hip"),
        rightKnee: document.getElementById("right-knee"),
        rightAnkle: document.getElementById("right-ankle"),
        rightForce: document.getElementById("right-force"),
        rightClearance: document.getElementById("right-clearance"),
        rightFootSpeed: document.getElementById("right-foot-speed"),
        statusLog: document.getElementById("status-log"),
        walkButton: document.getElementById("btn-walk"),
        runButton: document.getElementById("btn-run"),
        stopButton: document.getElementById("btn-stop"),
        resetButton: document.getElementById("btn-reset")
    };
}

function bindControls() {
    runtime.ui.walkButton.addEventListener("click", () => {
        sendCommand("start_walk", { speed: parseFloat(runtime.ui.speedSlider.value) });
    });

    runtime.ui.runButton.addEventListener("click", () => {
        sendCommand("start_run", { speed: parseFloat(runtime.ui.speedSlider.value) });
    });

    runtime.ui.stopButton.addEventListener("click", () => {
        sendCommand("stop");
    });

    runtime.ui.resetButton.addEventListener("click", () => {
        sendCommand("reset");
    });

    runtime.ui.speedSlider.addEventListener("input", () => {
        const speed = parseFloat(runtime.ui.speedSlider.value);
        runtime.ui.speedValue.textContent = `${speed.toFixed(1)} m/s`;
    });

    runtime.ui.speedSlider.addEventListener("change", () => {
        const speed = parseFloat(runtime.ui.speedSlider.value);
        sendCommand("set_speed", { speed });
    });

    runtime.ui.directionSlider.addEventListener("input", () => {
        runtime.ui.directionValue.textContent = `${runtime.ui.directionSlider.value} 度`;
    });

    runtime.ui.directionSlider.addEventListener("change", () => {
        sendCommand("set_direction", { direction: parseFloat(runtime.ui.directionSlider.value) });
    });

    window.addEventListener("beforeunload", () => {
        if (runtime.pollTimer) {
            clearTimeout(runtime.pollTimer);
        }
    });
}

async function loadConfig() {
    try {
        const payload = await fetchJson(apiUrl("/config"));
        const walkOption = Array.isArray(payload.options)
            ? payload.options.find((item) => item.key === "walk")
            : null;
        if (walkOption && typeof walkOption.default_speed === "number") {
            runtime.ui.speedSlider.value = walkOption.default_speed.toFixed(1);
            runtime.ui.speedValue.textContent = `${walkOption.default_speed.toFixed(1)} m/s`;
        }
    } catch (error) {
        setConnectionState(false, `配置加载失败: ${error.message}`);
    }
}

async function refreshState() {
    if (runtime.requestInFlight) {
        return;
    }

    runtime.requestInFlight = true;
    try {
        const state = await fetchJson(apiUrl("/state"));
        runtime.latestState = state;
        setConnectionState(true, "实时服务已连接");
        renderState(state);
    } catch (error) {
        setConnectionState(false, `轮询失败: ${error.message}`);
    } finally {
        runtime.requestInFlight = false;
    }
}

function scheduleNextPoll() {
    runtime.pollTimer = window.setTimeout(async () => {
        await refreshState();
        scheduleNextPoll();
    }, POLL_INTERVAL_MS);
}

async function sendCommand(command, payload = {}) {
    try {
        const response = await fetch(apiUrl("/control"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ command, ...payload })
        });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const result = await response.json();
        if (result.status !== "ok") {
            throw new Error(result.message || "命令执行失败");
        }
        runtime.latestState = result.state;
        renderState(result.state);
        setConnectionState(true, "命令已执行");
    } catch (error) {
        setConnectionState(false, `命令失败: ${error.message}`);
    }
}

function renderState(state) {
    // 中文模式映射
    const modeMap = {
        idle: "空闲",
        walking: "步行中",
        running: "跑步中"
    };
    // 中文相位映射
    const phaseMap = {
        stance: "支撑",
        swing: "摆动"
    };
    const activityLabel = state.activity && state.activity.label ? state.activity.label : modeMap[state.mode] || "空闲";
    const metrics = state.metrics || {};
    const left = state.left_leg || {};
    const right = state.right_leg || {};

    updateText(runtime.ui.currentMode, modeMap[state.mode] || "空闲");
    updateText(runtime.ui.currentActivity, activityLabel);
    updateText(runtime.ui.stepCount, String(state.step_count || 0));
    updateText(runtime.ui.distance, `${formatNumber(state.distance || 0, 1)} m`);
    updateText(runtime.ui.duration, `${formatNumber(state.duration || 0, 1)} s`);

    updateText(runtime.ui.metricCadence, formatNumber(metrics.step_frequency || 0, 1));
    updateText(runtime.ui.metricStride, formatNumber(metrics.stride_length || 0, 1));
    updateText(runtime.ui.metricSpeed, formatNumber(metrics.gait_speed || 0, 2));
    updateText(runtime.ui.metricSymmetry, formatNumber((metrics.symmetry || 0) * 100, 1));
    updateText(runtime.ui.metricStability, formatNumber((metrics.stability || 0) * 100, 1));
    updateText(runtime.ui.metricHeart, String(metrics.heart_rate || 0));
    updateText(runtime.ui.metricCycle, `${formatNumber(metrics.cycle_duration_sec || 0, 2)} s`);
    updateText(runtime.ui.metricStance, `${formatNumber((metrics.stance_ratio || 0) * 100, 1)}%`);
    updateText(runtime.ui.metricFlight, `${formatNumber((metrics.flight_ratio || 0) * 100, 1)}%`);
    updateText(runtime.ui.lastUpdated, state.timestamp || "--");

    renderLeg(runtime.ui.leftPhase, runtime.ui.leftHip, runtime.ui.leftKnee, runtime.ui.leftAnkle, runtime.ui.leftForce, runtime.ui.leftClearance, runtime.ui.leftFootSpeed, left, phaseMap);
    renderLeg(runtime.ui.rightPhase, runtime.ui.rightHip, runtime.ui.rightKnee, runtime.ui.rightAnkle, runtime.ui.rightForce, runtime.ui.rightClearance, runtime.ui.rightFootSpeed, right, phaseMap);

    if (typeof state.speed === "number") {
        runtime.ui.speedSlider.value = state.speed.toFixed(1);
        runtime.ui.speedValue.textContent = `${state.speed.toFixed(1)} m/s`;
    }
    if (typeof state.direction === "number") {
        runtime.ui.directionSlider.value = String(Math.round(state.direction));
        runtime.ui.directionValue.textContent = `${Math.round(state.direction)} 度`;
    }

    renderStatusLog(state.status_log || []);
}

function renderLeg(phaseNode, hipNode, kneeNode, ankleNode, forceNode, clearanceNode, speedNode, leg, phaseMap) {
    updateText(phaseNode, phaseMap[leg.phase] || "--");
    updateText(hipNode, `${formatNumber(leg.hip_angle || 0, 1)} 度`);
    updateText(kneeNode, `${formatNumber(leg.knee_angle || 0, 1)} 度`);
    updateText(ankleNode, `${formatNumber(leg.ankle_angle || 0, 1)} 度`);
    updateText(forceNode, `${formatNumber(leg.force || 0, 2)} BW`);
    updateText(clearanceNode, `${formatNumber(leg.clearance_cm || 0, 2)} cm`);
    updateText(speedNode, `${formatNumber(leg.foot_speed_mps || 0, 2)} m/s`);
}

function renderStatusLog(entries) {
    if (!runtime.ui.statusLog) {
        return;
    }

    const items = entries.slice(0, MAX_LOG_ITEMS).map((entry) => {
        const safeMessage = escapeHtml(entry.message || "");
        const safeLevel = escapeHtml(mapLevelToChinese(entry.level || "info"));
        const safeTime = escapeHtml(entry.timestamp || "--");
        return `
            <div class="status-item">
                <small>${safeTime}</small>
                <strong>[${safeLevel}]</strong>
                <span>${safeMessage}</span>
            </div>
        `;
    });
    runtime.ui.statusLog.innerHTML = items.join("") || '<div class="status-item"><span>暂无日志记录</span></div>';
}

function mapLevelToChinese(level) {
    const levelMap = {
        success: "成功",
        warning: "警告",
        error: "错误",
        info: "信息"
    };
    return levelMap[level] || level;
}

function setConnectionState(connected, message) {
    runtime.ui.connectionPill.textContent = message;
    runtime.ui.connectionPill.className = connected ? "pill pill-live" : "pill pill-warning";
    runtime.ui.healthPill.textContent = connected ? "轮询正常" : "等待重连";
    runtime.ui.healthPill.className = connected ? "pill pill-phase" : "pill pill-warning";
    runtime.ui.statusIndicator.classList.toggle("connected", connected);
}

function apiUrl(path) {
    return `${runtime.apiBase}${path}`;
}

async function fetchJson(url) {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
}

function updateText(node, value) {
    if (node) {
        node.textContent = value;
    }
}

function formatNumber(value, digits) {
    return Number(value || 0).toFixed(digits);
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}
