(function ngimuBridgePanel() {
    const DEFAULT_BASES = [
        "http://127.0.0.1:18000/api",
        "http://127.0.0.1:8000/api"
    ];

    const COMMANDS = {
        contest: "本地一键启动.bat",
        bridge: [
            "cd integrations\\ngimu-wifi",
            "python run_ngimu_web_bridge.py --protocol UDP --device-port 1399 --gui-port 8000 --api-port 18000"
        ].join("\n"),
        dashboard: [
            "cd integrations\\ngimu-wifi",
            "python run_dashboard.py --protocol UDP --device-port 1399 --api-port 18000 --open-browser"
        ].join("\n"),
        simulate: [
            "cd integrations\\ngimu-wifi",
            "python simulate_device.py --protocol UDP --host 127.0.0.1 --port 1399 --template gait-single"
        ].join("\n")
    };

    const state = {
        apiBase: DEFAULT_BASES[0],
        selectedId: "",
        devices: [],
        current: null,
        history: [],
        pollTimer: null,
        requestInFlight: false,
        lastGoodBase: "",
        commandMode: "contest"
    };

    const dom = {};

    document.addEventListener("DOMContentLoaded", init);

    function init() {
        bindDom();
        bindEvents();
        setCommand("contest");
        setConnection("warn", "正在探测本地 API");
        refresh({ probeFallback: true });
        state.pollTimer = window.setInterval(() => refresh({ probeFallback: false }), 1800);
    }

    function bindDom() {
        [
            "ngimu-connection-pill",
            "ngimu-device-pill",
            "api-base-input",
            "api-cycle",
            "api-apply",
            "api-open-dashboard",
            "device-select",
            "refresh-devices",
            "device-count",
            "latest-device",
            "history-limit",
            "latest-seen",
            "poll-badge",
            "motion-state",
            "angle-x",
            "angle-y",
            "angle-z",
            "acc-mag",
            "gyro-mag",
            "track-speed",
            "track-status",
            "motion-confidence",
            "estimated-altitude",
            "earth-source",
            "device-address",
            "battery-percent",
            "battery-voltage",
            "rssi",
            "temperature",
            "acc-vector",
            "gyro-vector",
            "track-vector",
            "track-canvas",
            "spark-canvas",
            "clear-history",
            "history-count",
            "copy-command",
            "sample-code",
            "hardware-status-log",
            "raw-data"
        ].forEach((id) => {
            dom[toCamel(id)] = document.getElementById(id);
        });
        [
            "ai-pairing",
            "ai-risk-badge",
            "ai-summary",
            "ai-dialogue",
            "ai-action",
            "ai-evidence"
        ].forEach((id) => {
            dom[toCamel(id)] = document.getElementById(id);
        });
        dom.commandModeButtons = Array.from(document.querySelectorAll(".command-mode"));
    }

    function bindEvents() {
        dom.apiApply.addEventListener("click", () => {
            state.apiBase = normalizeBase(dom.apiBaseInput.value);
            state.selectedId = "";
            refresh({ probeFallback: true });
        });

        dom.apiCycle.addEventListener("click", () => {
            const currentIndex = DEFAULT_BASES.indexOf(normalizeBase(dom.apiBaseInput.value));
            const nextBase = DEFAULT_BASES[(currentIndex + 1 + DEFAULT_BASES.length) % DEFAULT_BASES.length];
            dom.apiBaseInput.value = nextBase;
            state.apiBase = nextBase;
            state.selectedId = "";
            refresh({ probeFallback: true });
        });

        dom.refreshDevices.addEventListener("click", () => refresh({ probeFallback: true }));

        dom.deviceSelect.addEventListener("change", () => {
            state.selectedId = dom.deviceSelect.value;
            state.history = [];
            refresh({ probeFallback: false });
        });

        dom.clearHistory.addEventListener("click", clearSelectedHistory);

        dom.copyCommand.addEventListener("click", copyCommand);

        dom.commandModeButtons.forEach((button) => {
            button.addEventListener("click", () => setCommand(button.dataset.command));
        });
    }

    async function refresh({ probeFallback }) {
        if (state.requestInFlight) {
            return;
        }
        state.requestInFlight = true;
        dom.pollBadge.textContent = "轮询中";

        try {
            const payload = await fetchAll(probeFallback);
            state.devices = payload.devices;
            state.current = payload.current;
            state.history = payload.history;
            state.lastGoodBase = state.apiBase;
            renderAll(payload.health);
            setConnection("ok", "本地 API 已连接");
        } catch (error) {
            setConnection("error", "本地 API 未连接");
            pushLog(error.message || "无法读取本地 API", "error");
            renderEmpty();
        } finally {
            state.requestInFlight = false;
        }
    }

    async function fetchAll(probeFallback) {
        const bases = probeFallback
            ? unique([normalizeBase(dom.apiBaseInput.value), state.lastGoodBase, ...DEFAULT_BASES])
            : [normalizeBase(dom.apiBaseInput.value || state.apiBase)];

        let lastError = null;
        for (const base of bases) {
            if (!base) {
                continue;
            }
            try {
                const health = await fetchJson(`${base}/health`);
                const devicePayload = await fetchJson(`${base}/devices`);
                const devices = Array.isArray(devicePayload.devices) ? devicePayload.devices : [];
                state.apiBase = base;
                dom.apiBaseInput.value = base;
                updateDashboardLink(base);

                const selectedId = pickSelectedDevice(devices, health);
                state.selectedId = selectedId;
                let current = selectedId
                    ? await fetchJson(`${base}/devices/${encodeURIComponent(selectedId)}`)
                    : health.latest || null;
                let history = [];

                if (current && current.device_id) {
                    const historyPayload = await fetchJson(`${base}/devices/${encodeURIComponent(current.device_id)}/history?limit=360`);
                    history = Array.isArray(historyPayload.points) ? historyPayload.points : [];
                }

                return { health, devices, current, history };
            } catch (error) {
                lastError = error;
            }
        }
        throw lastError || new Error("没有可用的 API 地址");
    }

    function pickSelectedDevice(devices, health) {
        if (state.selectedId && devices.some((device) => device.device_id === state.selectedId)) {
            return state.selectedId;
        }
        const latestId = health && health.latest && health.latest.device_id;
        if (latestId && devices.some((device) => device.device_id === latestId)) {
            return latestId;
        }
        return devices.length ? devices[0].device_id : "";
    }

    function renderAll(health) {
        renderDeviceSelector();
        renderHealth(health);
        renderCurrent();
        drawTrack();
        drawSpark();
        pushLog(state.current ? `收到 ${state.current.device_id} 的最新样本` : "API 已连接，等待设备数据", state.current ? "success" : "info");
    }

    function renderDeviceSelector() {
        const selected = state.selectedId;
        dom.deviceSelect.innerHTML = "";
        if (!state.devices.length) {
            const option = document.createElement("option");
            option.value = "";
            option.textContent = "等待设备";
            dom.deviceSelect.appendChild(option);
            dom.deviceSelect.disabled = true;
            return;
        }
        state.devices.forEach((device) => {
            const option = document.createElement("option");
            option.value = device.device_id;
            option.textContent = device.device_id;
            option.selected = device.device_id === selected;
            dom.deviceSelect.appendChild(option);
        });
        dom.deviceSelect.disabled = false;
    }

    function renderHealth(health) {
        const count = Array.isArray(state.devices) ? state.devices.length : 0;
        dom.ngimuDevicePill.textContent = `设备 ${count} 台`;
        dom.deviceCount.textContent = String(count);
        dom.latestDevice.textContent = (health.latest && health.latest.device_id) || "--";
        dom.historyLimit.textContent = health.history_limit ? String(health.history_limit) : "--";
        dom.latestSeen.textContent = formatTime((state.current && state.current.last_seen) || (health.latest && health.latest.last_seen));
        dom.historyCount.textContent = `${state.history.length} 点`;
    }

    function renderCurrent() {
        const current = state.current;
        const data = (current && current.data) || {};

        setText("motionState", data.MotionState || "--");
        setText("angleX", formatNumber(data.AngleX, 1));
        setText("angleY", formatNumber(data.AngleY, 1));
        setText("angleZ", formatNumber(data.AngleZ, 1));
        setText("accMag", formatNumber(data.AccMagnitude, 2));
        setText("gyroMag", formatNumber(data.GyroMagnitude, 1));
        setText("trackSpeed", formatNumber(data.TrackSpeed, 2));
        setText("trackStatus", data.TrackStatus || "--");
        setText("motionConfidence", data.MotionConfidence == null ? "--" : `${Math.round(Number(data.MotionConfidence) * 100)}%`);
        setText("estimatedAltitude", formatMetric(data.EstimatedAltitude, "m", 2));
        setText("earthSource", data.EarthAccSource || "--");
        setText("deviceAddress", current && current.address ? String(current.address) : "--");
        setText("batteryPercent", formatMetric(data.ElectricPercentage, "%", 0));
        setText("batteryVoltage", formatMetric(data.BatteryVoltage, "V", 2));
        setText("rssi", formatMetric(data.Rssi, "dBm", 0));
        setText("temperature", formatMetric(data.Temp, "°C", 1));
        setText("accVector", vectorText(data, ["AccX", "AccY", "AccZ"], "g", 2));
        setText("gyroVector", vectorText(data, ["AsX", "AsY", "AsZ"], "deg/s", 1));
        setText("trackVector", vectorText(data, ["TrackX", "TrackY", "TrackZ"], "m", 3));
        dom.rawData.textContent = JSON.stringify(data, null, 2);
        renderAiInteraction(current, data);
    }

    function renderEmpty() {
        state.devices = [];
        state.current = null;
        state.history = [];
        renderDeviceSelector();
        renderHealth({ history_limit: "--" });
        renderCurrent();
        drawTrack();
        drawSpark();
        dom.ngimuDevicePill.textContent = "设备 0 台";
        dom.historyCount.textContent = "0 点";
        dom.pollBadge.textContent = "离线";
        renderAiInteraction(null, {});
    }

    function renderAiInteraction(current, data) {
        if (!dom.aiPairing) {
            return;
        }

        if (!current || !current.device_id) {
            setText("aiPairing", "等待配对");
            setText("aiRiskBadge", "待机");
            setText("aiSummary", "等待 NGIMU 桥接数据");
            setText("aiDialogue", "AI 将在收到实时样本后，把姿态、冲击、运动置信度和设备健康状态转成风险解释。");
            setText("aiAction", "等待实时样本");
            renderAiEvidence(["Acc --", "Gyro --", "Battery --"]);
            if (dom.aiRiskBadge) {
                dom.aiRiskBadge.dataset.level = "idle";
            }
            return;
        }

        const acc = numberOrNull(data.AccMagnitude);
        const gyro = numberOrNull(data.GyroMagnitude);
        const confidence = numberOrNull(data.MotionConfidence);
        const battery = numberOrNull(data.ElectricPercentage);
        const rssi = numberOrNull(data.Rssi);
        const motion = String(data.MotionState || "未知");

        const highMotion = (acc != null && acc >= 2.2) || (gyro != null && gyro >= 280) || /fall|impact|冲击|跌/i.test(motion);
        const mediumMotion = (acc != null && acc >= 1.45) || (gyro != null && gyro >= 120) || (confidence != null && confidence < 0.45);
        const deviceWeak = (battery != null && battery <= 15) || (rssi != null && rssi <= -85);

        let level = "低风险";
        let action = "保持观察，继续采集稳定步态样本";
        if (highMotion) {
            level = "高风险";
            action = "立即核验老人状态，必要时触发人工干预";
        } else if (mediumMotion || deviceWeak) {
            level = "需关注";
            action = deviceWeak ? "检查设备电量或信号，再继续监测" : "建议延长观察窗口并复核步态稳定性";
        }

        const dialogue = [
            acc == null ? "加速度样本不足" : `加速度约 ${formatNumber(acc, 2)} g`,
            gyro == null ? "角速度样本不足" : `角速度约 ${formatNumber(gyro, 1)} deg/s`,
            confidence == null ? "运动置信度待估计" : `运动置信度 ${Math.round(confidence * 100)}%`
        ].join("；");

        setText("aiPairing", "NGIMU 已配对");
        setText("aiRiskBadge", level);
        setText("aiSummary", `${current.device_id} 已配对，当前 ${motion}，AI 判定为${level}`);
        setText("aiDialogue", `AI：${dialogue}。${action}。`);
        setText("aiAction", action);
        renderAiEvidence([
            `Acc ${acc == null ? "--" : `${formatNumber(acc, 2)}g`}`,
            `Gyro ${gyro == null ? "--" : `${formatNumber(gyro, 1)}deg/s`}`,
            `Battery ${battery == null ? "--" : `${formatNumber(battery, 0)}%`}`
        ]);

        if (dom.aiRiskBadge) {
            dom.aiRiskBadge.dataset.level = level === "高风险" ? "high" : level === "需关注" ? "medium" : "low";
        }
    }

    function renderAiEvidence(items) {
        if (!dom.aiEvidence) {
            return;
        }
        dom.aiEvidence.innerHTML = items.map((item) => `<span>${escapeHtml(item)}</span>`).join("");
    }

    async function clearSelectedHistory() {
        if (!state.selectedId) {
            pushLog("当前没有可清空的设备轨迹", "warn");
            return;
        }
        try {
            await fetchJson(`${state.apiBase}/devices/${encodeURIComponent(state.selectedId)}/history`, { method: "DELETE" });
            state.history = [];
            dom.historyCount.textContent = "0 点";
            drawTrack();
            drawSpark();
            pushLog(`${state.selectedId} 轨迹已清空`, "success");
        } catch (error) {
            pushLog(`清空失败：${error.message}`, "error");
        }
    }

    async function copyCommand() {
        const command = dom.sampleCode.textContent;
        try {
            await navigator.clipboard.writeText(command);
            pushLog("启动命令已复制", "success");
        } catch (error) {
            pushLog("当前浏览器不允许自动复制，请手动选择命令", "warn");
        }
    }

    function setCommand(mode) {
        if (!COMMANDS[mode]) {
            return;
        }
        state.commandMode = mode;
        dom.sampleCode.textContent = COMMANDS[mode];
        dom.commandModeButtons.forEach((button) => {
            button.classList.toggle("active", button.dataset.command === mode);
        });
    }

    function drawTrack() {
        const canvas = dom.trackCanvas;
        const ctx = canvas.getContext("2d");
        const rect = resizeCanvas(canvas);
        const points = state.history
            .map((point) => {
                const data = point.data || {};
                const x = numberOrNull(data.TrackX ?? data.PositionX);
                const z = numberOrNull(data.TrackZ ?? data.PositionZ);
                return x == null || z == null ? null : { x, z, status: data.TrackStatus };
            })
            .filter(Boolean);

        clearCanvas(ctx, rect);
        drawPanelBackground(ctx, rect);
        if (points.length < 2) {
            drawCanvasNotice(ctx, rect, "等待轨迹数据", "TrackX / TrackZ");
            return;
        }

        const bounds = paddedBounds(points, ["x", "z"], 0.5);
        const mapX = (value) => 42 + ((value - bounds.x.min) / (bounds.x.max - bounds.x.min || 1)) * (rect.width - 74);
        const mapY = (value) => rect.height - 34 - ((value - bounds.z.min) / (bounds.z.max - bounds.z.min || 1)) * (rect.height - 70);

        drawGrid(ctx, rect);
        ctx.lineWidth = 3;
        ctx.strokeStyle = "rgba(34, 211, 238, 0.9)";
        ctx.beginPath();
        points.forEach((point, index) => {
            const x = mapX(point.x);
            const y = mapY(point.z);
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();

        const latest = points[points.length - 1];
        ctx.fillStyle = latest.status === "Corrected" ? "#34d399" : "#60a5fa";
        ctx.beginPath();
        ctx.arc(mapX(latest.x), mapY(latest.z), 5, 0, Math.PI * 2);
        ctx.fill();
        drawCanvasCaption(ctx, rect, `X ${formatNumber(latest.x, 3)} m / Z ${formatNumber(latest.z, 3)} m`);
    }

    function drawSpark() {
        const canvas = dom.sparkCanvas;
        const ctx = canvas.getContext("2d");
        const rect = resizeCanvas(canvas);
        const values = state.history
            .map((point) => numberOrNull((point.data || {}).AccMagnitude))
            .filter((value) => value != null);

        clearCanvas(ctx, rect);
        drawPanelBackground(ctx, rect);
        if (values.length < 2) {
            drawCanvasNotice(ctx, rect, "等待加速度样本", "AccMagnitude");
            return;
        }

        const min = Math.min(...values);
        const max = Math.max(...values);
        const span = Math.max(0.2, max - min);
        drawGrid(ctx, rect);
        ctx.lineWidth = 3;
        ctx.strokeStyle = "rgba(52, 211, 153, 0.9)";
        ctx.beginPath();
        values.forEach((value, index) => {
            const x = 42 + (index / (values.length - 1)) * (rect.width - 74);
            const y = rect.height - 34 - ((value - min) / span) * (rect.height - 70);
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();
        drawCanvasCaption(ctx, rect, `范围 ${formatNumber(min, 2)}-${formatNumber(max, 2)} g`);
    }

    async function fetchJson(url, options = {}) {
        const response = await fetch(url, { cache: "no-store", ...options });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
    }

    function setConnection(type, text) {
        dom.ngimuConnectionPill.textContent = text;
        dom.ngimuConnectionPill.dataset.state = type;
    }

    function pushLog(text, type = "info") {
        const item = document.createElement("div");
        item.className = `log-item ${type}`;
        item.innerHTML = `<span>${new Date().toLocaleTimeString("zh-CN", { hour12: false })}</span><strong>${escapeHtml(text)}</strong>`;
        dom.hardwareStatusLog.prepend(item);
        while (dom.hardwareStatusLog.children.length > 8) {
            dom.hardwareStatusLog.lastElementChild.remove();
        }
    }

    function updateDashboardLink(base) {
        const url = base.replace(/\/api\/?$/, "/");
        dom.apiOpenDashboard.href = url;
    }

    function normalizeBase(value) {
        let base = String(value || "").trim();
        if (!base) {
            return DEFAULT_BASES[0];
        }
        base = base.replace(/\/+$/, "");
        if (!/\/api$/.test(base)) {
            base += "/api";
        }
        return base;
    }

    function unique(values) {
        return Array.from(new Set(values.filter(Boolean)));
    }

    function toCamel(id) {
        return id.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
    }

    function setText(key, value) {
        if (dom[key]) {
            dom[key].textContent = value == null || value === "" ? "--" : String(value);
        }
    }

    function formatNumber(value, digits = 1) {
        const number = Number(value);
        if (!Number.isFinite(number)) {
            return "--";
        }
        return number.toFixed(digits);
    }

    function formatMetric(value, unit, digits = 1) {
        const number = Number(value);
        if (!Number.isFinite(number)) {
            return "--";
        }
        return `${number.toFixed(digits)} ${unit}`;
    }

    function vectorText(data, keys, unit, digits) {
        const values = keys.map((key) => formatNumber(data[key], digits));
        if (values.some((value) => value === "--")) {
            return "--";
        }
        return `${values.join(" / ")} ${unit}`;
    }

    function numberOrNull(value) {
        const number = Number(value);
        return Number.isFinite(number) ? number : null;
    }

    function formatTime(value) {
        if (!value) {
            return "--";
        }
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            return String(value).slice(11, 19) || String(value);
        }
        return date.toLocaleTimeString("zh-CN", { hour12: false });
    }

    function resizeCanvas(canvas) {
        const rect = canvas.getBoundingClientRect();
        const ratio = window.devicePixelRatio || 1;
        const width = Math.max(320, Math.floor(rect.width || canvas.width));
        const height = Math.max(220, Math.floor(rect.height || canvas.height));
        canvas.width = Math.floor(width * ratio);
        canvas.height = Math.floor(height * ratio);
        const ctx = canvas.getContext("2d");
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
        return { width, height };
    }

    function clearCanvas(ctx, rect) {
        ctx.clearRect(0, 0, rect.width, rect.height);
    }

    function drawPanelBackground(ctx, rect) {
        const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
        gradient.addColorStop(0, "rgba(15, 23, 42, 0.96)");
        gradient.addColorStop(1, "rgba(8, 19, 36, 0.96)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, rect.width, rect.height);
    }

    function drawGrid(ctx, rect) {
        ctx.strokeStyle = "rgba(148, 163, 184, 0.12)";
        ctx.lineWidth = 1;
        for (let x = 42; x < rect.width - 20; x += 56) {
            ctx.beginPath();
            ctx.moveTo(x, 18);
            ctx.lineTo(x, rect.height - 34);
            ctx.stroke();
        }
        for (let y = 26; y < rect.height - 34; y += 42) {
            ctx.beginPath();
            ctx.moveTo(32, y);
            ctx.lineTo(rect.width - 24, y);
            ctx.stroke();
        }
    }

    function drawCanvasNotice(ctx, rect, title, subtitle) {
        ctx.fillStyle = "rgba(226, 232, 240, 0.82)";
        ctx.font = "600 16px Microsoft YaHei, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(title, rect.width / 2, rect.height / 2 - 8);
        ctx.fillStyle = "rgba(148, 163, 184, 0.72)";
        ctx.font = "13px Microsoft YaHei, sans-serif";
        ctx.fillText(subtitle, rect.width / 2, rect.height / 2 + 18);
    }

    function drawCanvasCaption(ctx, rect, text) {
        ctx.fillStyle = "rgba(226, 232, 240, 0.84)";
        ctx.font = "600 13px Microsoft YaHei, sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(text, 42, rect.height - 12);
    }

    function paddedBounds(points, keys, minSpan) {
        const result = {};
        keys.forEach((key) => {
            const values = points.map((point) => point[key]);
            const min = Math.min(...values);
            const max = Math.max(...values);
            const span = Math.max(minSpan, max - min);
            const mid = (min + max) / 2;
            result[key] = {
                min: mid - span * 0.58,
                max: mid + span * 0.58
            };
        });
        return result;
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }
})();
