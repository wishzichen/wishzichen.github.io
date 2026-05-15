(function elderFriendlyApp() {
  "use strict";

  const STORAGE_KEY = "zhsl_elder_web_state_v1";
  const TARGET_SECONDS = 6 * 60;
  const TICK_MS = 500;
  const TICK_SECONDS = 6;

  const REMINDERS = [
    {
      id: "comfort_walk",
      icon: "walk",
      color: "blue",
      title: "完成 6 分钟舒适步行",
      detail: "建议在社区花园或平坦路面进行。",
      action: "开始",
      shouldStore: false,
    },
    {
      id: "evening_medicine",
      icon: "bell",
      color: "warm",
      title: "晚饭后服药提醒",
      detail: "18:30 提醒降压药，处理后会进入今日历史。",
      action: "知道了",
      shouldStore: true,
    },
    {
      id: "weekly_report",
      icon: "report",
      color: "teal",
      title: "本周健康摘要已更新",
      detail: "家人可以查看步态变化、活动趋势和照护建议。",
      action: "查看",
      shouldStore: false,
    },
  ];

  const DEVICE_STATUS = [
    { label: "腰带传感器", value: "在线 98%", progress: 0.98, tone: "teal" },
    { label: "左足鞋垫", value: "在线 94%", progress: 0.94, tone: "blue" },
    { label: "右足鞋垫", value: "在线 93%", progress: 0.93, tone: "warm" },
  ];

  const WALK_GUIDANCE = [
    { icon: "calendar", title: "路线建议", detail: "选择平坦路面，避免台阶和湿滑区域。", tone: "blue" },
    { icon: "walk", title: "姿态提示", detail: "自然摆臂，抬头看清前方，不要急着走快。", tone: "teal" },
    { icon: "shield", title: "安全提醒", detail: "建议有人陪同，身边保留扶手或座椅。", tone: "warm" },
  ];

  const GAIT_PROFILES = {
    today: {
      label: "今天",
      score: 0.92,
      status: "今日稳定",
      scoreStatus: "良好",
      summary: "今天左右脚用力比较均匀，走路比较稳。",
      stepDiff: "2.8 cm",
      supportDiff: "0.03 s",
      leftPercent: 49,
      rightPercent: 51,
      trendLabel: "今日稳定",
      trendColor: "#17c3b2",
      trendValues: [88, 90, 89, 91, 90, 92, 92],
      sensors: [
        { icon: "walk", label: "平均步长", value: "52 cm", tone: "blue" },
        { icon: "activity", label: "每步用时", value: "1.08 s", tone: "purple" },
        { icon: "chart", label: "走路波动", value: "4.6%", tone: "warm" },
      ],
    },
    week: {
      label: "7 天",
      score: 0.88,
      status: "周内平稳",
      scoreStatus: "平稳",
      summary: "最近一周整体平稳，傍晚走路会略微不如白天稳。",
      stepDiff: "3.6 cm",
      supportDiff: "0.05 s",
      leftPercent: 48,
      rightPercent: 52,
      trendLabel: "周内波动",
      trendColor: "#2b7cff",
      trendValues: [91, 89, 87, 86, 88, 90, 88],
      sensors: [
        { icon: "walk", label: "平均步长", value: "51 cm", tone: "blue" },
        { icon: "activity", label: "每步用时", value: "1.11 s", tone: "purple" },
        { icon: "chart", label: "走路波动", value: "5.3%", tone: "warm" },
      ],
    },
    month: {
      label: "30 天",
      score: 0.84,
      status: "需要关注",
      scoreStatus: "需关注",
      summary: "最近 30 天右脚用力多一些，建议让家人或医生帮忙看看。",
      stepDiff: "5.1 cm",
      supportDiff: "0.07 s",
      leftPercent: 47,
      rightPercent: 53,
      trendLabel: "长期略降",
      trendColor: "#ff8a3d",
      trendValues: [91, 90, 88, 87, 86, 85, 84],
      sensors: [
        { icon: "walk", label: "平均步长", value: "50 cm", tone: "blue" },
        { icon: "activity", label: "每步用时", value: "1.14 s", tone: "purple" },
        { icon: "chart", label: "走路波动", value: "6.2%", tone: "warm" },
      ],
    },
  };

  const RISK_ITEMS = ["步速较慢", "握力下降", "近一周疲劳感", "活动范围减少", "体重明显变化"];

  const DEFAULT_CONTACTS = [
    { id: "doctor", name: "李医生", role: "社区家庭医生", status: "在线", icon: "care", color: "#2b7cff" },
    { id: "son", name: "王明", role: "儿子", status: "今日已查看", icon: "phone", color: "#ff8a3d" },
    { id: "nurse", name: "社区护士站", role: "紧急协助", status: "24 小时", icon: "shield", color: "#16a085" },
  ];

  const TONE_COLORS = {
    blue: "#2b7cff",
    teal: "#16a085",
    warm: "#ff8a3d",
    purple: "#725cff",
    danger: "#ff4d6d",
  };

  let state = loadState();
  let walkTimer = null;

  function defaults() {
    return {
      activeScreen: "overview",
      isLive: true,
      settings: {
        fontScale: 1.12,
        highContrast: false,
        simpleMode: true,
        voiceReminder: true,
        fallAlert: true,
      },
      care: {
        medicineReminder: true,
        familyShare: true,
      },
      riskSensitivity: 0.72,
      reminderHistory: [],
      customContacts: [],
      riskChecked: ["步速较慢", "握力下降"],
      gaitRange: "today",
      calibratedAt: null,
      walking: {
        isDetecting: false,
        elapsedSeconds: 0,
        steps: 0,
        records: [],
      },
      lastSavedAt: Date.now(),
    };
  }

  function loadState() {
    const base = defaults();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return base;
      }
      const parsed = JSON.parse(raw);
      return mergeState(base, parsed);
    } catch (error) {
      console.warn("Failed to load elder web state", error);
      return base;
    }
  }

  function mergeState(base, incoming) {
    if (!incoming || typeof incoming !== "object") {
      return base;
    }
    const merged = { ...base, ...incoming };
    merged.settings = { ...base.settings, ...(incoming.settings || {}) };
    merged.care = { ...base.care, ...(incoming.care || {}) };
    merged.walking = { ...base.walking, ...(incoming.walking || {}) };
    merged.walking.isDetecting = false;
    if (!Array.isArray(merged.reminderHistory)) merged.reminderHistory = [];
    if (!Array.isArray(merged.customContacts)) merged.customContacts = [];
    if (!Array.isArray(merged.riskChecked)) merged.riskChecked = base.riskChecked;
    if (!Array.isArray(merged.walking.records)) merged.walking.records = [];
    if (!GAIT_PROFILES[merged.gaitRange]) merged.gaitRange = "today";
    if (!["overview", "walk", "gait", "care", "settings"].includes(merged.activeScreen)) {
      merged.activeScreen = "overview";
    }
    return merged;
  }

  function saveState() {
    state.lastSavedAt = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function byId(id) {
    return document.getElementById(id);
  }

  function icon(name) {
    return `<svg class="ui-icon" aria-hidden="true"><use href="#icon-${name}"></use></svg>`;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function sameDay(timestamp, date = new Date()) {
    const d = new Date(timestamp);
    return d.getFullYear() === date.getFullYear() &&
      d.getMonth() === date.getMonth() &&
      d.getDate() === date.getDate();
  }

  function formatClock(timestamp) {
    const date = new Date(timestamp);
    const pad = (value) => String(value).padStart(2, "0");
    return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const leftSeconds = seconds % 60;
    return `${minutes}:${String(leftSeconds).padStart(2, "0")}`;
  }

  function formatNumber(value) {
    return new Intl.NumberFormat("zh-CN").format(value);
  }

  function fontLabel(scale) {
    if (scale < 1.05) return "标准";
    if (scale < 1.22) return "较大";
    return "特大";
  }

  function getProfile() {
    return GAIT_PROFILES[state.gaitRange] || GAIT_PROFILES.today;
  }

  function getRiskAssessment() {
    const profile = getProfile();
    const checkedWeight = state.riskChecked.length * 6;
    const profileWeight = (1 - profile.score) * 70;
    const sensitivityWeight = state.riskSensitivity > 0.8 ? -2 : 4;
    const score = clamp(Math.round(checkedWeight + profileWeight + sensitivityWeight), 8, 78);
    if (score >= 45) {
      return {
        score,
        label: "需要人工关注",
        tone: "danger",
        copy: "步态波动和观察项偏多，建议联系家属或社区医生复核。",
      };
    }
    if (score >= 28) {
      return {
        score,
        label: "需要关注",
        tone: "warn",
        copy: "有少量风险信号，建议减少夜间独自行走并保持观察。",
      };
    }
    return {
      score,
      label: "综合风险低",
      tone: "success",
      copy: "本周步态变异下降，活动规律良好。",
    };
  }

  function getWalkMetrics() {
    const elapsed = state.walking.elapsedSeconds;
    if (!elapsed) {
      return { speed: 0, cadence: 0, stability: 92 };
    }
    return {
      speed: 0.84 + Math.sin(elapsed / 28) * 0.05,
      cadence: 94 + Math.cos(elapsed / 22) * 4,
      stability: 92 + Math.sin(elapsed / 31) * 3,
    };
  }

  function weeklyBullets() {
    if (state.settings.simpleMode) {
      return [
        "本周没有明显跌倒风险。",
        "走路整体比上周更稳。",
        "建议本周安排一次家人陪伴散步。",
      ];
    }
    return [
      "本周无跌倒预警，夜间活动平稳。",
      "步态对称性平均 90 分，较上周提升。",
      "建议安排一次家人陪伴散步，并确认随身设备佩戴舒适。",
    ];
  }

  function applyAccessibility() {
    document.documentElement.style.setProperty("--font-scale", state.settings.fontScale.toFixed(2));
    document.body.classList.toggle("is-contrast", state.settings.highContrast);
    document.body.classList.toggle("is-simple", state.settings.simpleMode);
  }

  function setRing(id, value) {
    const element = byId(id);
    if (element) {
      element.style.setProperty("--value", String(clamp(value, 0, 1)));
    }
  }

  function updateChips() {
    const risk = getRiskAssessment();
    byId("chip-live").textContent = state.isLive ? "守护中" : "已暂停";
    byId("chip-live").dataset.tone = state.isLive ? "success" : "warn";
    byId("chip-risk").textContent = risk.label;
    byId("chip-risk").dataset.tone = risk.tone === "danger" ? "warn" : "success";
    byId("chip-mode").textContent = state.settings.simpleMode ? "简洁模式" : "专业模式";
    byId("chip-sync").textContent = `已同步 ${formatClock(state.lastSavedAt)}`;
  }

  function setScreen(screen, options = {}) {
    state.activeScreen = screen;
    document.querySelectorAll(".screen").forEach((section) => {
      section.classList.toggle("is-active", section.dataset.screen === screen);
    });
    document.querySelectorAll("[data-nav]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.nav === screen);
    });
    if (options.save !== false) {
      saveState();
      updateChips();
    }
    if (screen === "gait") {
      requestAnimationFrame(drawTrendChart);
    }
    if (options.scroll !== false) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function renderAll() {
    applyAccessibility();
    updateChips();
    setScreen(state.activeScreen, { save: false, scroll: false });
    renderOverview();
    renderWalk();
    renderGait();
    renderCare();
    renderSettings();
    if (state.activeScreen === "gait") {
      requestAnimationFrame(drawTrendChart);
    }
  }

  function renderOverview() {
    const profile = GAIT_PROFILES.today;
    const visibleReminders = getVisibleReminders();
    const records = getTodayRecords();
    const totalSteps = records.length
      ? records.reduce((sum, record) => sum + record.steps, 0)
      : 4286;
    const walkTime = records.length
      ? Math.max(6, Math.round(records.reduce((sum, record) => sum + record.durationSeconds, 0) / 60))
      : 18;

    byId("overview-live-state").textContent = state.isLive ? "实时守护开启" : "实时守护暂停";
    byId("overview-summary").textContent = state.isLive
      ? "暂时没有发现容易摔倒的明显信号，请继续慢慢走、稳稳走。"
      : "守护已暂停，重新开启后会继续显示健康提醒。";
    byId("overview-steps").textContent = formatNumber(totalSteps);
    byId("overview-walk-time").textContent = `${walkTime} 分`;
    byId("overview-battery").textContent = "96%";
    byId("overview-ring-value").textContent = Math.round(profile.score * 100);
    setRing("overview-ring", profile.score);

    byId("reminder-count").textContent = `${visibleReminders.length} 项`;
    renderDevices(byId("overview-devices"), DEVICE_STATUS);
    renderReminders(visibleReminders);
    renderHistory();
  }

  function getVisibleReminders() {
    const todayHistory = state.reminderHistory.filter((entry) => sameDay(entry.handledAt));
    const handledIds = new Set(todayHistory.map((entry) => entry.id));
    return REMINDERS.filter((reminder) => !reminder.shouldStore || !handledIds.has(reminder.id));
  }

  function renderDevices(container, devices) {
    container.innerHTML = "";
    devices.forEach((device) => {
      const item = document.createElement("div");
      item.className = "device-row";
      item.innerHTML = `
        <div>
          <strong>${escapeHtml(device.label)}</strong>
          <small>${escapeHtml(device.value)}</small>
        </div>
        <div class="device-meter"><span style="width:${Math.round(device.progress * 100)}%; background:${TONE_COLORS[device.tone] || TONE_COLORS.blue}"></span></div>
      `;
      container.appendChild(item);
    });
  }

  function renderReminders(reminders) {
    const container = byId("overview-reminders");
    container.innerHTML = "";
    if (!reminders.length) {
      container.appendChild(emptyCard("今天的可确认提醒都处理好了。"));
      return;
    }
    reminders.forEach((reminder) => {
      const card = document.createElement("article");
      card.className = "reminder-card";
      card.innerHTML = `
        <span class="list-icon" style="color:${TONE_COLORS[reminder.color] || TONE_COLORS.blue}; background:${hexAlpha(TONE_COLORS[reminder.color] || TONE_COLORS.blue, 0.12)}">${icon(reminder.icon)}</span>
        <span class="list-main">
          <strong>${escapeHtml(reminder.title)}</strong>
          <small>${escapeHtml(reminder.detail)}</small>
        </span>
        <button class="small-link" type="button">${escapeHtml(reminder.action)}</button>
      `;
      card.querySelector("button").addEventListener("click", () => handleReminder(reminder.id));
      container.appendChild(card);
    });
  }

  function renderHistory() {
    const container = byId("overview-history");
    const todayHistory = state.reminderHistory
      .filter((entry) => sameDay(entry.handledAt))
      .sort((a, b) => b.handledAt - a.handledAt);
    byId("history-count").textContent = `${todayHistory.length} 条`;
    container.innerHTML = "";
    if (!todayHistory.length) {
      container.appendChild(emptyCard("还没有确认记录，处理后的提醒会按时间显示在这里。"));
      return;
    }
    todayHistory.forEach((entry) => {
      const card = document.createElement("article");
      card.className = "history-card";
      card.innerHTML = `
        <span class="list-icon" style="color:${TONE_COLORS.teal}; background:${hexAlpha(TONE_COLORS.teal, 0.12)}">${icon("check")}</span>
        <span class="list-main">
          <strong>${escapeHtml(entry.title)}</strong>
          <small>${escapeHtml(entry.detail)} · ${escapeHtml(entry.action)}</small>
        </span>
        <strong>${formatClock(entry.handledAt)}</strong>
      `;
      container.appendChild(card);
    });
  }

  function handleReminder(id) {
    const reminder = REMINDERS.find((item) => item.id === id);
    if (!reminder) return;
    if (id === "comfort_walk") {
      setScreen("walk");
      notify("已进入步行检测页，可以点击开始记录。", "success", { speak: true });
      return;
    }
    if (id === "weekly_report") {
      openReportModal();
      return;
    }
    acknowledgeReminder(reminder);
  }

  function acknowledgeReminder(reminder) {
    const now = Date.now();
    state.reminderHistory = state.reminderHistory
      .filter((entry) => !(entry.id === reminder.id && sameDay(entry.handledAt, new Date(now))));
    state.reminderHistory.unshift({
      id: reminder.id,
      title: reminder.title,
      detail: reminder.detail,
      action: reminder.action,
      handledAt: now,
    });
    saveState();
    renderAll();
    notify(`${reminder.title}已确认，已经保存到今日提醒历史。`, "success", { speak: true });
  }

  function emptyCard(message) {
    const card = document.createElement("div");
    card.className = "history-card";
    card.innerHTML = `
      <span class="list-icon">${icon("check")}</span>
      <span class="list-main"><strong>${escapeHtml(message)}</strong><small>记录会保存在这台设备上，方便下次继续查看。</small></span>
    `;
    return card;
  }

  function renderWalk() {
    const progress = clamp(state.walking.elapsedSeconds / TARGET_SECONDS, 0, 1);
    const metrics = getWalkMetrics();
    byId("walk-session-status").textContent = state.walking.isDetecting ? "检测进行中" : "准备开始检测";
    byId("walk-ring-value").textContent = `${Math.round(progress * 100)}%`;
    byId("walk-elapsed").textContent = formatDuration(state.walking.elapsedSeconds);
    byId("walk-target").textContent = formatDuration(TARGET_SECONDS);
    byId("walk-steps").textContent = formatNumber(state.walking.steps);
    byId("walk-speed").textContent = `${metrics.speed.toFixed(2)} m/s`;
    byId("walk-cadence").textContent = `${Math.round(metrics.cadence)} 步/分`;
    byId("walk-stability").textContent = `${Math.round(metrics.stability)} 分`;
    byId("walk-progress-line").style.width = `${Math.round(progress * 100)}%`;
    setRing("walk-ring", progress);

    const toggle = byId("walk-toggle");
    toggle.innerHTML = `${icon(state.walking.isDetecting ? "pause" : "play")}<span>${state.walking.isDetecting ? "暂停检测" : "开始检测"}</span>`;
    renderWalkGuidance();
    renderWalkRecords();
    renderDevices(byId("walk-device-status"), DEVICE_STATUS);
  }

  function renderWalkGuidance() {
    const container = byId("walk-guidance");
    container.innerHTML = "";
    WALK_GUIDANCE.forEach((item) => {
      const row = document.createElement("article");
      row.className = "guidance-row";
      row.innerHTML = `
        <span class="list-icon" style="color:${TONE_COLORS[item.tone]}; background:${hexAlpha(TONE_COLORS[item.tone], 0.12)}">${icon(item.icon)}</span>
        <span class="list-main">
          <strong>${escapeHtml(item.title)}</strong>
          <small>${escapeHtml(item.detail)}</small>
        </span>
      `;
      container.appendChild(row);
    });
  }

  function getTodayRecords() {
    return state.walking.records
      .filter((record) => sameDay(record.savedAt))
      .sort((a, b) => b.savedAt - a.savedAt);
  }

  function renderWalkRecords() {
    const container = byId("walk-records");
    const todayRecords = getTodayRecords();
    byId("walk-record-count").textContent = `${todayRecords.length} 条`;
    container.innerHTML = "";
    if (!todayRecords.length) {
      container.appendChild(emptyCard("保存一次步行检测后，会在这里显示今天走过的记录。"));
      return;
    }
    todayRecords.forEach((record) => {
      const card = document.createElement("article");
      card.className = "record-card";
      card.innerHTML = `
        <span class="list-icon" style="color:${TONE_COLORS.teal}; background:${hexAlpha(TONE_COLORS.teal, 0.12)}">${icon("save")}</span>
        <span class="list-main">
          <strong>${formatClock(record.savedAt)} 步行检测</strong>
          <small>时长 ${formatDuration(record.durationSeconds)} · ${formatNumber(record.steps)} 步 · 稳定 ${Math.round(record.stability)} 分</small>
        </span>
      `;
      container.appendChild(card);
    });
  }

  function startWalkSession() {
    if (state.walking.elapsedSeconds >= TARGET_SECONDS) {
      state.walking.elapsedSeconds = 0;
      state.walking.steps = 0;
    }
    state.walking.isDetecting = true;
    clearInterval(walkTimer);
    walkTimer = setInterval(tickWalkSession, TICK_MS);
    renderAll();
    notify("步行记录已开始，请慢慢走，注意脚下安全。", "success", { speak: true });
  }

  function pauseWalkSession() {
    clearInterval(walkTimer);
    walkTimer = null;
    state.walking.isDetecting = false;
    renderAll();
    notify("步行记录已暂停，休息好后可以继续。", "warn", { speak: true });
  }

  function tickWalkSession() {
    state.walking.elapsedSeconds = Math.min(TARGET_SECONDS, state.walking.elapsedSeconds + TICK_SECONDS);
    state.walking.steps += 10 + (Math.floor(state.walking.elapsedSeconds / 24) % 4);
    if (state.walking.elapsedSeconds >= TARGET_SECONDS) {
      finishWalkSession(true);
      return;
    }
    renderAll();
  }

  function finishWalkSession(auto = false) {
    if (state.walking.elapsedSeconds <= 0) {
      notify("请先开始步行检测。", "warn");
      return;
    }
    const metrics = getWalkMetrics();
    clearInterval(walkTimer);
    walkTimer = null;
    state.walking.isDetecting = false;
    state.walking.records.unshift({
      savedAt: Date.now(),
      durationSeconds: state.walking.elapsedSeconds,
      steps: Math.max(state.walking.steps, 12),
      speed: metrics.speed,
      cadence: metrics.cadence,
      stability: metrics.stability,
    });
    state.walking.records = state.walking.records.slice(0, 80);
    state.walking.elapsedSeconds = 0;
    state.walking.steps = 0;
    saveState();
    renderAll();
    notify(auto ? "6 分钟步行记录已完成并保存。" : "本次步行记录已保存。", "success", { speak: true });
  }

  function renderGait() {
    const profile = getProfile();
    const risk = getRiskAssessment();
    byId("gait-status").textContent = `${profile.status} · ${profile.scoreStatus}`;
    byId("gait-summary").textContent = profile.summary;
    byId("gait-score").textContent = Math.round(profile.score * 100);
    byId("gait-step-diff").textContent = `左右步子差 ${profile.stepDiff}`;
    byId("gait-support-diff").textContent = `用力差 ${profile.supportDiff}`;
    byId("gait-left-percent").textContent = `${profile.leftPercent}%`;
    byId("gait-right-percent").textContent = `${profile.rightPercent}%`;
    byId("gait-left-bar").style.width = `${profile.leftPercent}%`;
    byId("gait-right-bar").style.width = `${profile.rightPercent}%`;
    byId("gait-trend-label").textContent = profile.trendLabel;
    byId("gait-range-label").textContent = profile.label;
    byId("risk-title").textContent = `${risk.label} · ${risk.score}%`;
    byId("risk-copy").textContent = risk.copy;
    const riskIcon = byId("risk-icon");
    riskIcon.className = `icon-badge ${risk.tone === "danger" ? "danger" : risk.tone === "warn" ? "warm" : "success"}`;
    byId("gait-calibration-label").textContent = state.calibratedAt
      ? `今日已校准 ${formatClock(state.calibratedAt)}`
      : "未校准";
    setRing("gait-ring", profile.score);
    renderRangeTabs();
    renderGaitSensors(profile);
    renderRiskObservations();
  }

  function renderRangeTabs() {
    const container = byId("gait-range-tabs");
    container.innerHTML = "";
    Object.entries(GAIT_PROFILES).forEach(([key, profile]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.range = key;
      button.className = key === state.gaitRange ? "is-active" : "";
      button.textContent = profile.label;
      container.appendChild(button);
    });
  }

  function renderGaitSensors(profile) {
    const container = byId("gait-sensors");
    container.innerHTML = "";
    profile.sensors.forEach((sensor) => {
      const row = document.createElement("article");
      row.className = "sensor-row";
      row.innerHTML = `
        <span class="list-icon" style="color:${TONE_COLORS[sensor.tone]}; background:${hexAlpha(TONE_COLORS[sensor.tone], 0.12)}">${icon(sensor.icon)}</span>
        <span class="list-main"><strong>${escapeHtml(sensor.label)}</strong></span>
        <strong>${escapeHtml(sensor.value)}</strong>
      `;
      container.appendChild(row);
    });
  }

  function renderRiskObservations() {
    const container = byId("risk-observations");
    container.innerHTML = "";
    RISK_ITEMS.forEach((item) => {
      const label = document.createElement("label");
      label.className = "toggle-row";
      label.innerHTML = `
        <span>
          <strong>${escapeHtml(item)}</strong>
          <small>${state.settings.simpleMode ? "家属可协助观察" : "用于综合风险解释和干预建议"}</small>
        </span>
        <input type="checkbox" ${state.riskChecked.includes(item) ? "checked" : ""} />
      `;
      label.querySelector("input").addEventListener("change", (event) => {
        const checked = event.currentTarget.checked;
        const current = new Set(state.riskChecked);
        if (checked) current.add(item);
        else current.delete(item);
        state.riskChecked = Array.from(current);
        saveState();
        renderAll();
        notify("风险观察项已更新。", "success");
      });
      container.appendChild(label);
    });
  }

  function drawTrendChart() {
    const canvas = byId("gait-trend-canvas");
    if (!canvas) return;
    const profile = getProfile();
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(360, Math.floor(rect.width || canvas.parentElement.clientWidth || 960));
    const height = Math.max(220, Math.floor(rect.height || 260));
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const gridColor = document.body.classList.contains("is-contrast") ? "rgba(15, 23, 42, 0.16)" : "rgba(102, 112, 133, 0.14)";
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    for (let i = 1; i <= 3; i += 1) {
      const y = (height * i) / 4;
      ctx.beginPath();
      ctx.moveTo(18, y);
      ctx.lineTo(width - 18, y);
      ctx.stroke();
    }

    const values = profile.trendValues;
    const min = Math.min(...values) - 4;
    const max = Math.max(...values) + 4;
    const range = Math.max(max - min, 1);
    const points = values.map((value, index) => {
      const x = 24 + ((width - 48) * index) / Math.max(values.length - 1, 1);
      const y = height * 0.86 - ((value - min) / range) * (height * 0.62);
      return { x, y };
    });

    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, hexAlpha(profile.trendColor, 0.22));
    gradient.addColorStop(1, hexAlpha(profile.trendColor, 0));
    ctx.beginPath();
    ctx.moveTo(points[0].x, height - 18);
    points.forEach((point) => ctx.lineTo(point.x, point.y));
    ctx.lineTo(points[points.length - 1].x, height - 18);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.beginPath();
    points.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
        return;
      }
      const previous = points[index - 1];
      const midX = (previous.x + point.x) / 2;
      ctx.bezierCurveTo(midX, previous.y, midX, point.y, point.x, point.y);
    });
    const lineGradient = ctx.createLinearGradient(24, 0, width - 24, 0);
    lineGradient.addColorStop(0, "#2b7cff");
    lineGradient.addColorStop(1, profile.trendColor);
    ctx.strokeStyle = lineGradient;
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.stroke();

    points.forEach((point) => {
      ctx.beginPath();
      ctx.fillStyle = profile.trendColor;
      ctx.arc(point.x, point.y, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.fillStyle = "#ffffff";
      ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function renderCare() {
    byId("toggle-medicine").checked = state.care.medicineReminder;
    byId("toggle-family-share").checked = state.care.familyShare;
    renderWeeklySummary();
    renderContacts();
  }

  function renderWeeklySummary() {
    const container = byId("weekly-summary");
    container.innerHTML = "";
    weeklyBullets().forEach((text, index) => {
      const tones = ["teal", "blue", "warm"];
      const item = document.createElement("article");
      item.className = "summary-bullet";
      item.innerHTML = `
        <span class="list-icon" style="color:${TONE_COLORS[tones[index] || "blue"]}; background:${hexAlpha(TONE_COLORS[tones[index] || "blue"], 0.12)}">${icon(index === 2 ? "alert" : "check")}</span>
        <span class="list-main"><strong>${escapeHtml(text)}</strong></span>
      `;
      container.appendChild(item);
    });
  }

  function renderContacts() {
    const container = byId("care-contacts");
    container.innerHTML = "";
    const contacts = [...state.customContacts, ...DEFAULT_CONTACTS];
    contacts.forEach((contact, index) => {
      const color = contact.color || contactColor(index);
      const card = document.createElement("article");
      card.className = "contact-card";
      card.innerHTML = `
        <span class="contact-main">
          <span class="contact-avatar" style="color:${color}; background:${hexAlpha(color, 0.12)}">${icon(contact.icon || "care")}</span>
          <span>
            <strong>${escapeHtml(contact.name)}</strong>
            <small>${escapeHtml(contact.role)}</small>
          </span>
        </span>
        <span class="contact-actions">
          <small style="color:${color}; font-weight:900">${escapeHtml(contact.status)}</small>
          <button class="small-link" type="button">${icon("phone")}<span>呼叫</span></button>
        </span>
      `;
      card.querySelector("button").addEventListener("click", () => {
        notify(`正在为您联系 ${contact.name}，请稍等。`, "success", { speak: true });
      });
      container.appendChild(card);
    });
  }

  function contactColor(index) {
    const colors = ["#2b7cff", "#ff8a3d", "#16a085", "#725cff", "#e255a8"];
    return colors[index % colors.length];
  }

  function renderSettings() {
    byId("font-scale").value = state.settings.fontScale;
    byId("font-scale-label").textContent = fontLabel(state.settings.fontScale);
    byId("toggle-simple").checked = state.settings.simpleMode;
    byId("toggle-contrast").checked = state.settings.highContrast;
    byId("toggle-voice").checked = state.settings.voiceReminder;
    byId("toggle-fall").checked = state.settings.fallAlert;
    byId("risk-sensitivity").value = state.riskSensitivity;
    byId("sensitivity-label").textContent = `${Math.round(state.riskSensitivity * 100)}%`;
  }

  function openContactModal() {
    byId("contact-name").value = "";
    byId("contact-role").value = "家属";
    byId("contact-status").value = "可联系";
    openModal("contact-modal");
    setTimeout(() => byId("contact-name").focus(), 50);
  }

  function saveContact() {
    const name = byId("contact-name").value.trim();
    const role = byId("contact-role").value.trim();
    const status = byId("contact-status").value.trim();
    if (!name || !role || !status) {
      notify("请把姓名、关系和状态填写完整。", "warn");
      return;
    }
    state.customContacts.unshift({
      id: String(Date.now()),
      name,
      role,
      status,
      icon: "care",
      color: contactColor(state.customContacts.length + 3),
    });
    saveState();
    closeModals();
    renderAll();
    notify(`${name} 已添加到联系人。`, "success");
  }

  function openReportModal() {
    const container = byId("report-summary");
    const risk = getRiskAssessment();
    const records = getTodayRecords();
    const latestRecord = records[0];
    container.innerHTML = `
      <article class="summary-bullet">
        <span class="list-icon" style="color:${TONE_COLORS.teal}; background:${hexAlpha(TONE_COLORS.teal, 0.12)}">${icon("shield")}</span>
        <span class="list-main"><strong>${escapeHtml(risk.label)}</strong><small>${escapeHtml(risk.copy)}</small></span>
      </article>
      ${weeklyBullets().map((text, index) => `
        <article class="summary-bullet">
          <span class="list-icon" style="color:${TONE_COLORS[index === 2 ? "warm" : "blue"]}; background:${hexAlpha(TONE_COLORS[index === 2 ? "warm" : "blue"], 0.12)}">${icon(index === 2 ? "alert" : "check")}</span>
          <span class="list-main"><strong>${escapeHtml(text)}</strong></span>
        </article>
      `).join("")}
      <article class="summary-bullet">
        <span class="list-icon" style="color:${TONE_COLORS.purple}; background:${hexAlpha(TONE_COLORS.purple, 0.12)}">${icon("walk")}</span>
        <span class="list-main"><strong>今日检测</strong><small>${latestRecord ? `${formatDuration(latestRecord.durationSeconds)} · ${formatNumber(latestRecord.steps)} 步 · 稳定 ${Math.round(latestRecord.stability)} 分` : "尚未保存今日步行检测"}</small></span>
      </article>
    `;
    openModal("report-modal");
    speak("健康周报已打开。综合结论和本周建议已经显示在屏幕上。");
  }

  function printReport() {
    const risk = getRiskAssessment();
    const profile = getProfile();
    const reportWindow = window.open("", "_blank", "width=880,height=1160");
    if (!reportWindow) {
      notify("浏览器阻止了打印窗口，请允许弹出窗口后重试。", "warn");
      return;
    }
    const bullets = weeklyBullets().map((item) => `<li>${escapeHtml(item)}</li>`).join("");
    reportWindow.document.write(`
      <!doctype html>
      <html lang="zh-CN">
        <head>
          <meta charset="UTF-8" />
          <title>智守银龄周报</title>
          <style>
            body { font-family: "Microsoft YaHei", "PingFang SC", sans-serif; padding: 36px; color: #17233d; line-height: 1.7; }
            h1 { margin: 0 0 8px; }
            .meta { color: #667085; margin-bottom: 24px; }
            .card { border: 1px solid #d0d7e2; border-radius: 12px; padding: 18px; margin-bottom: 16px; }
            strong { color: #175cd3; }
          </style>
        </head>
        <body>
          <h1>智守银龄 · 家属周报</h1>
          <p class="meta">生成时间：${new Date().toLocaleString("zh-CN")}</p>
          <section class="card"><h2>综合结论</h2><p><strong>${escapeHtml(risk.label)}</strong>，${escapeHtml(risk.copy)}</p></section>
          <section class="card"><h2>步态状态</h2><p>${escapeHtml(profile.label)}步态平衡 ${Math.round(profile.score * 100)} 分。${escapeHtml(profile.summary)}</p></section>
          <section class="card"><h2>本周摘要</h2><ul>${bullets}</ul></section>
        </body>
      </html>
    `);
    reportWindow.document.close();
    reportWindow.focus();
    setTimeout(() => reportWindow.print(), 250);
    notify("健康周报已打开，可以打印或保存。", "success", { speak: true });
  }

  function openModal(id) {
    byId("modal-backdrop").hidden = false;
    const modal = byId(id);
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeModals() {
    byId("modal-backdrop").hidden = true;
    document.querySelectorAll(".modal").forEach((modal) => {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
    });
  }

  function speak(message, options = {}) {
    if (!message || !("speechSynthesis" in window)) {
      return;
    }
    if (!options.force && !state.settings.voiceReminder) {
      return;
    }
    const text = String(message).replace(/[，。！？,.!?]*$/, "。");
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "zh-CN";
    utterance.rate = 0.88;
    utterance.pitch = 1;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  }

  function screenSpeechText() {
    const risk = getRiskAssessment();
    const screen = state.activeScreen;
    if (screen === "overview") {
      return `首页。今天步态比较稳，${risk.label}。如需检测，请点击开始检测。`;
    }
    if (screen === "walk") {
      return state.walking.isDetecting
        ? "步行记录正在进行。请慢慢走，注意脚下安全。"
        : "步行检测页。点击开始记录后，像平时一样慢慢走六分钟。";
    }
    if (screen === "gait") {
      const profile = getProfile();
      return `步态趋势。${profile.status}，平衡分 ${Math.round(profile.score * 100)} 分。${profile.summary}`;
    }
    if (screen === "care") {
      return "关怀中心。可以联系家人、社区医生，也可以查看健康周报。紧急情况请点击紧急联系。";
    }
    return "设置页。可以调整字体大小、显示模式、语音提醒和提醒灵敏度。";
  }

  function notify(message, tone = "info", options = {}) {
    const zone = byId("toast-zone");
    const toast = document.createElement("div");
    toast.className = `toast ${tone}`;
    toast.textContent = message;
    zone.appendChild(toast);
    if (options.speak) {
      speak(options.speechText || message);
    }
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(-6px)";
      setTimeout(() => toast.remove(), 220);
    }, 2600);
  }

  function hexAlpha(hex, alpha) {
    const cleaned = hex.replace("#", "");
    const value = parseInt(cleaned.length === 3
      ? cleaned.split("").map((char) => char + char).join("")
      : cleaned, 16);
    const r = (value >> 16) & 255;
    const g = (value >> 8) & 255;
    const b = value & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function resetPreferences() {
    const base = defaults();
    state.settings = { ...base.settings };
    state.care = { ...base.care };
    state.riskSensitivity = base.riskSensitivity;
    saveState();
    renderAll();
    notify("字体、显示和提醒设置已恢复默认。", "success", { speak: true });
  }

  function bindEvents() {
    document.querySelectorAll("[data-nav]").forEach((button) => {
      button.addEventListener("click", () => setScreen(button.dataset.nav));
    });
    document.querySelectorAll("[data-jump]").forEach((button) => {
      button.addEventListener("click", () => setScreen(button.dataset.jump));
    });

    byId("walk-toggle").addEventListener("click", () => {
      state.walking.isDetecting ? pauseWalkSession() : startWalkSession();
    });
    byId("walk-save").addEventListener("click", () => finishWalkSession(false));
    byId("gait-range-tabs").addEventListener("click", (event) => {
      const button = event.target.closest("[data-range]");
      if (!button) return;
      state.gaitRange = button.dataset.range;
      saveState();
      renderAll();
    });
    byId("gait-calibrate").addEventListener("click", () => {
      state.calibratedAt = Date.now();
      saveState();
      renderAll();
      notify("步态校准已完成，之后看走路数据会更准确。", "success", { speak: true });
    });

    byId("care-emergency-call").addEventListener("click", () => notify("正在通知紧急联系人，请保持电话畅通。", "danger", { speak: true }));
    byId("care-emergency-call-wide").addEventListener("click", () => notify("正在通知紧急联系人，请保持电话畅通。", "danger", { speak: true }));
    byId("care-add-contact").addEventListener("click", openContactModal);
    byId("contact-save").addEventListener("click", saveContact);
    byId("open-report").addEventListener("click", openReportModal);
    byId("care-open-report").addEventListener("click", openReportModal);
    byId("report-print").addEventListener("click", printReport);
    byId("speak-page").addEventListener("click", () => speak(screenSpeechText(), { force: true }));
    byId("modal-backdrop").addEventListener("click", closeModals);
    document.querySelectorAll("[data-close-modal]").forEach((button) => {
      button.addEventListener("click", closeModals);
    });

    byId("toggle-medicine").addEventListener("change", (event) => {
      state.care.medicineReminder = event.currentTarget.checked;
      saveState();
      renderAll();
      notify(state.care.medicineReminder ? "服药提醒已开启。" : "服药提醒已关闭。", "success", { speak: true });
    });
    byId("toggle-family-share").addEventListener("change", (event) => {
      state.care.familyShare = event.currentTarget.checked;
      saveState();
      renderAll();
      notify(state.care.familyShare ? "家属共享已开启。" : "家属共享已关闭。", "success", { speak: true });
    });

    byId("font-scale").addEventListener("input", (event) => {
      state.settings.fontScale = Number(event.currentTarget.value);
      saveState();
      renderAll();
    });
    byId("toggle-simple").addEventListener("change", (event) => {
      state.settings.simpleMode = event.currentTarget.checked;
      saveState();
      renderAll();
    });
    byId("toggle-contrast").addEventListener("change", (event) => {
      state.settings.highContrast = event.currentTarget.checked;
      saveState();
      renderAll();
    });
    byId("toggle-voice").addEventListener("change", (event) => {
      state.settings.voiceReminder = event.currentTarget.checked;
      saveState();
      renderAll();
      if (state.settings.voiceReminder) {
        speak("语音提醒已开启。重要提醒会读给您听。", { force: true });
      } else {
        window.speechSynthesis?.cancel();
        notify("语音提醒已关闭。", "success");
      }
    });
    byId("toggle-fall").addEventListener("change", (event) => {
      state.settings.fallAlert = event.currentTarget.checked;
      saveState();
      renderAll();
    });
    byId("risk-sensitivity").addEventListener("input", (event) => {
      state.riskSensitivity = Number(event.currentTarget.value);
      saveState();
      renderAll();
    });
    byId("settings-reset").addEventListener("click", resetPreferences);
    byId("reset-settings-top").addEventListener("click", resetPreferences);

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeModals();
      }
    });
    window.addEventListener("resize", () => {
      if (state.activeScreen === "gait") {
        drawTrendChart();
      }
    });
  }

  bindEvents();
  renderAll();
})();
