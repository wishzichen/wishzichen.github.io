const COLORS = {
  blue: "#4f6dcc",
  green: "#73bf62",
  amber: "#f4b63f",
  red: "#e2564d",
  cyan: "#20a6b8",
  violet: "#8659c7",
  grid: "#dbe2ec",
  axis: "#6b7280",
  ink: "#1b2430",
};

const REAL_IMU_MODEL_URL = "/assets/3d/NGIMU Housing Solid Body.obj";
const DEVICE_COLORS = ["#4f6dcc", "#20a6b8", "#73bf62", "#f4b63f", "#e2564d", "#8659c7", "#2b8a7e"];
const LIVE_POLL_MS = 120;
const DEVICE_LIST_POLL_MS = 900;
const HISTORY_POLL_MS = 320;
const SLOW_RENDER_MS = 520;
const THEME_STORAGE_KEY = "bs-imu-dashboard-theme";
const HISTORY_LIMIT = 60000;
const RENDER_POINT_LIMIT = 2600;
const TRACK_MIN_SPAN_M = 0.5;
const SPACE_MIN_SPAN_M = 0.001;
const SPACE_TARGET_SPAN = 4.2;
const TRACK_REVEAL_POINTS_PER_SECOND = 120;
const SIMULATION_PREFIXES = ["BSLEG", "BS55LEG"];
const MOCAP_ROLE_LABELS = {
  pelvis: "骨盆",
  left_thigh: "左大腿",
  left_shank: "左小腿",
  left_foot: "左足",
  right_thigh: "右大腿",
  right_shank: "右小腿",
  right_foot: "右足",
};
const MOCAP_ROLE_SETS = {
  two: ["left_foot", "right_foot"],
  four: ["left_shank", "left_foot", "right_shank", "right_foot"],
  lower: ["pelvis", "left_thigh", "left_shank", "left_foot", "right_thigh", "right_shank", "right_foot"],
};

const state = {
  devices: [],
  selectedId: null,
  current: null,
  history: [],
  deviceHistories: {},
  paused: false,
  trackOrigin: null,
  trackOrigins: {},
  trackStartIds: {},
  mapBoundsState: { key: null, pointCount: 0, bounds: null },
  spaceBoundsState: { key: null, pointCount: 0, bounds: null },
  trackPlayback: { map: {}, space: {} },
  mapMode: "xyz",
  mocapMode: "auto",
  refreshInFlight: false,
  historyInFlight: false,
  lastDeviceListFetch: 0,
  lastHistoryFetch: 0,
  lastSlowRender: 0,
};

const metricDefs = [
  { key: "device_id", label: "设备 ID", from: "root" },
  { key: "AccMagnitude", label: "加速度模长", unit: "g" },
  { key: "GyroMagnitude", label: "角速度模长", unit: "deg/s" },
  { key: "MagMagnitude", label: "磁场模长", unit: "uT" },
  { key: "AngleX", label: "Roll", unit: "deg" },
  { key: "AngleY", label: "Pitch", unit: "deg" },
  { key: "AngleZ", label: "Yaw", unit: "deg" },
  { key: "LinearAccX", label: "线加速度 X", unit: "g" },
  { key: "LinearAccY", label: "线加速度 Y", unit: "g" },
  { key: "LinearAccZ", label: "线加速度 Z", unit: "g" },
  { key: "EarthAccX", label: "地球加速度 X", unit: "g" },
  { key: "EarthAccY", label: "地球加速度 Y", unit: "g" },
  { key: "EarthAccZ", label: "地球加速度 Z", unit: "g" },
  { key: "TrackX", label: "3D 轨迹 X", unit: "m" },
  { key: "TrackY", label: "3D 轨迹 Y", unit: "m" },
  { key: "TrackZ", label: "3D 轨迹 Z", unit: "m" },
  { key: "EstimatedAltitude", label: "估计高度", unit: "m" },
  { key: "TrackSpeed", label: "轨迹速度", unit: "m/s" },
  { key: "TrackStatus", label: "轨迹修正" },
  { key: "MotionState", label: "运动状态" },
  { key: "MotionConfidence", label: "运动置信度" },
  { key: "MotionAccelerationMagnitude", label: "运动加速度", unit: "m/s²" },
  { key: "MotionSegmentCount", label: "ZUPT 段数" },
  { key: "BatteryVoltage", label: "电池电压", unit: "V" },
  { key: "ElectricPercentage", label: "电量", unit: "%" },
  { key: "Rssi", label: "信号", unit: "dBm" },
  { key: "Version", label: "版本号" },
];

const charts = [
  {
    id: "accChart",
    series: [
      { key: "AccX", name: "X", color: COLORS.blue },
      { key: "AccY", name: "Y", color: COLORS.green },
      { key: "AccZ", name: "Z", color: COLORS.amber },
      { key: "AccMagnitude", name: "模长", color: COLORS.red },
    ],
  },
  {
    id: "linearChart",
    series: [
      { key: "LinearAccX", name: "X", color: COLORS.blue },
      { key: "LinearAccY", name: "Y", color: COLORS.green },
      { key: "LinearAccZ", name: "Z", color: COLORS.amber },
    ],
  },
  {
    id: "earthChart",
    series: [
      { key: "EarthAccX", name: "X", color: COLORS.blue },
      { key: "EarthAccY", name: "Y", color: COLORS.green },
      { key: "EarthAccZ", name: "Z", color: COLORS.amber },
    ],
  },
  {
    id: "gyroChart",
    series: [
      { key: "AsX", name: "X", color: COLORS.blue },
      { key: "AsY", name: "Y", color: COLORS.green },
      { key: "AsZ", name: "Z", color: COLORS.amber },
      { key: "GyroMagnitude", name: "模长", color: COLORS.red },
    ],
  },
  {
    id: "angleChart",
    series: [
      { key: "AngleX", name: "Roll", color: COLORS.blue },
      { key: "AngleY", name: "Pitch", color: COLORS.green },
      { key: "AngleZ", name: "Yaw", color: COLORS.amber },
    ],
  },
  {
    id: "magChart",
    series: [
      { key: "GX", name: "X", color: COLORS.blue },
      { key: "GY", name: "Y", color: COLORS.green },
      { key: "GZ", name: "Z", color: COLORS.amber },
      { key: "MagMagnitude", name: "模长", color: COLORS.red },
    ],
  },
  {
    id: "motionChart",
    series: [
      { key: "EstimatedAltitude", name: "高度", color: COLORS.violet },
      { key: "TrackSpeed", name: "轨迹速度", color: COLORS.cyan },
    ],
  },
  {
    id: "statusChart",
    series: [
      { key: "ElectricPercentage", name: "电量", color: COLORS.green },
      { key: "Rssi", name: "RSSI", color: COLORS.amber },
    ],
  },
];

const dom = {
  connectionText: document.getElementById("connectionText"),
  connectionDot: document.getElementById("connectionDot"),
  deviceCount: document.getElementById("deviceCount"),
  deviceList: document.getElementById("deviceList"),
  selectedDevice: document.getElementById("selectedDevice"),
  selectedAddress: document.getElementById("selectedAddress"),
  selectedTime: document.getElementById("selectedTime"),
  lastSeen: document.getElementById("lastSeen"),
  trackerMode: document.getElementById("trackerMode"),
  motionStateText: document.getElementById("motionStateText"),
  deviceCompare: document.getElementById("deviceCompare"),
  metricGrid: document.getElementById("metricGrid"),
  reset3dView: document.getElementById("reset3dView"),
  resetSpaceView: document.getElementById("resetSpaceView"),
  resetMocapView: document.getElementById("resetMocapView"),
  refreshToggle: document.getElementById("refreshToggle"),
  themeToggle: document.getElementById("themeToggle"),
  clearHistory: document.getElementById("clearHistory"),
  resetTrack: document.getElementById("resetTrack"),
  attitudeMount: document.getElementById("attitudeMount"),
  attitudeCanvas: document.getElementById("attitudeCanvas"),
  attitudeMode: document.getElementById("attitudeMode"),
  attitudeAngles: document.getElementById("attitudeAngles"),
  trackCanvas: document.getElementById("trackCanvas"),
  trackDistance: document.getElementById("trackDistance"),
  mapSourceText: document.getElementById("mapSourceText"),
  mapCoordinateText: document.getElementById("mapCoordinateText"),
  mapScaleText: document.getElementById("mapScaleText"),
  mapModeButtons: Array.from(document.querySelectorAll("[data-map-mode]")),
  spaceMount: document.getElementById("spaceMount"),
  spaceCanvas: document.getElementById("spaceCanvas"),
  spaceModeText: document.getElementById("spaceModeText"),
  spaceSummary: document.getElementById("spaceSummary"),
  spaceCoordinateText: document.getElementById("spaceCoordinateText"),
  spaceScaleText: document.getElementById("spaceScaleText"),
  mocapMount: document.getElementById("mocapMount"),
  mocapCanvas: document.getElementById("mocapCanvas"),
  mocapModeText: document.getElementById("mocapModeText"),
  mocapSummary: document.getElementById("mocapSummary"),
  mocapRoleText: document.getElementById("mocapRoleText"),
  mocapSourceText: document.getElementById("mocapSourceText"),
  mocapModeButtons: Array.from(document.querySelectorAll("[data-mocap-mode]")),
};

function cssVariable(name, fallback) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

function syncChartColors() {
  charts.forEach((chart) => {
    chart.series.forEach((series) => {
      if (["AccX", "LinearAccX", "EarthAccX", "AsX", "AngleX", "GX"].includes(series.key)) {
        series.color = COLORS.blue;
      } else if (["AccY", "LinearAccY", "EarthAccY", "AsY", "AngleY", "GY", "ElectricPercentage"].includes(series.key)) {
        series.color = COLORS.green;
      } else if (["AccZ", "LinearAccZ", "EarthAccZ", "AsZ", "AngleZ", "GZ", "Rssi"].includes(series.key)) {
        series.color = COLORS.amber;
      } else if (["AccMagnitude", "GyroMagnitude", "MagMagnitude"].includes(series.key)) {
        series.color = COLORS.red;
      } else if (series.key === "EstimatedAltitude") {
        series.color = COLORS.violet;
      } else if (series.key === "TrackSpeed") {
        series.color = COLORS.cyan;
      }
    });
  });
}

function syncPaletteFromCss() {
  COLORS.blue = cssVariable("--blue", COLORS.blue);
  COLORS.green = cssVariable("--green", COLORS.green);
  COLORS.amber = cssVariable("--amber", COLORS.amber);
  COLORS.red = cssVariable("--red", COLORS.red);
  COLORS.cyan = cssVariable("--cyan", COLORS.cyan);
  COLORS.violet = cssVariable("--violet", COLORS.violet);
  COLORS.grid = cssVariable("--line", COLORS.grid);
  COLORS.axis = cssVariable("--muted", COLORS.axis);
  COLORS.ink = cssVariable("--ink", COLORS.ink);
  syncChartColors();
}

function storedTheme() {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY) === "day" ? "day" : "night";
  } catch (error) {
    return "night";
  }
}

function applyTheme(theme, options = {}) {
  const nextTheme = theme === "day" ? "day" : "night";
  document.documentElement.dataset.theme = nextTheme;
  syncPaletteFromCss();

  if (dom.themeToggle) {
    const isDay = nextTheme === "day";
    dom.themeToggle.textContent = isDay ? "夜间模式" : "白天模式";
    dom.themeToggle.setAttribute("aria-pressed", String(isDay));
  }

  if (options.persist) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch (error) {
      // Ignore private-mode storage failures; the default night theme still applies.
    }
  }

  if (options.render) {
    renderAll();
  }
}

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function dataNumber(data, key, fallback = 0) {
  const value = toNumber(data && data[key]);
  return value === null ? fallback : value;
}

function firstNumber(data, keys) {
  for (const key of keys) {
    const value = toNumber(data && data[key]);
    if (value !== null) {
      return value;
    }
  }
  return null;
}

function gpsPosition(data) {
  const latitude = firstNumber(data, ["Latitude", "Lat", "GPSLatitude", "GpsLatitude", "latitude", "lat"]);
  const longitude = firstNumber(data, ["Longitude", "Lng", "Lon", "GPSLongitude", "GpsLongitude", "longitude", "lng", "lon"]);

  if (latitude === null || longitude === null) {
    return null;
  }
  if (Math.abs(latitude) > 90 || Math.abs(longitude) > 180) {
    return null;
  }
  return { latitude, longitude };
}

function formatValue(value, digits = 3) {
  if (value === null || value === undefined || value === "") {
    return "--";
  }
  if (typeof value === "number") {
    return value.toLocaleString("zh-CN", { maximumFractionDigits: digits });
  }
  return String(value);
}

function formatMetric(value, unit) {
  const text = formatValue(value);
  if (text === "--" || !unit) {
    return text;
  }
  return `${text}${unit}`;
}

function formatClock(text) {
  if (!text) {
    return "--";
  }
  const timePart = String(text).split(" ")[1];
  return timePart || text;
}

function formatLastSeen(snapshot) {
  if (!snapshot || !snapshot.last_seen_ts) {
    return "--";
  }
  const age = Math.max(0, Date.now() / 1000 - snapshot.last_seen_ts);
  if (age < 1) {
    return "刚刚";
  }
  if (age < 60) {
    return `${Math.round(age)} 秒前`;
  }
  return snapshot.last_seen || "--";
}

async function fetchJson(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  return response.json();
}

function setConnection(mode, text) {
  dom.connectionText.textContent = text;
  dom.connectionDot.className = `status-dot ${mode}`;
}

function isOnline(device) {
  return device && device.last_seen_ts && Date.now() / 1000 - device.last_seen_ts < 3;
}

function sortedDevices() {
  return [...state.devices].sort((a, b) => (b.last_seen_ts || 0) - (a.last_seen_ts || 0));
}

function isSimulationDevice(device) {
  const deviceId = String((device && device.device_id) || "");
  return SIMULATION_PREFIXES.some((prefix) => deviceId.startsWith(prefix));
}

function lowerBodySimulationDevices() {
  return sortedDevices().filter(isSimulationDevice);
}

function selectedDeviceSnapshot() {
  return state.devices.find((device) => device.device_id === state.selectedId) || null;
}

function historyDevicesForView() {
  const simulated = lowerBodySimulationDevices();
  if (simulated.length) {
    return simulated.slice(0, 7);
  }
  const selected = selectedDeviceSnapshot();
  return selected ? [selected] : [];
}

function deviceColor(deviceId, index = 0) {
  const devices = sortedDevices();
  const foundIndex = Math.max(0, devices.findIndex((device) => device.device_id === deviceId));
  return DEVICE_COLORS[(foundIndex >= 0 ? foundIndex : index) % DEVICE_COLORS.length];
}

function historyPointId(point) {
  const data = (point && point.data) || {};
  return point.record_index ?? data.RecordIndex ?? data.MotionSampleIndex ?? point.ts ?? point.time ?? point.received_at ?? "";
}

function compareHistoryPoints(a, b) {
  const aRecordIndex = toNumber(a && a.record_index);
  const bRecordIndex = toNumber(b && b.record_index);
  if (aRecordIndex !== null && bRecordIndex !== null && aRecordIndex !== bRecordIndex) {
    return aRecordIndex - bRecordIndex;
  }

  const aIndex = toNumber(a && a.data && a.data.MotionSampleIndex);
  const bIndex = toNumber(b && b.data && b.data.MotionSampleIndex);
  if (aIndex !== null && bIndex !== null && aIndex !== bIndex) {
    return aIndex - bIndex;
  }
  return ((a && a.ts) || 0) - ((b && b.ts) || 0);
}

function snapshotToHistoryPoint(snapshot) {
  const data = snapshot && snapshot.data ? { ...snapshot.data } : {};
  return {
    device_id: snapshot.device_id,
    address: snapshot.address,
    record_index: snapshot.record_index,
    time: data.Time,
    received_at: snapshot.last_seen,
    ts: snapshot.last_seen_ts,
    data,
  };
}

function mergeHistoryPoints(deviceId, incomingPoints) {
  if (!deviceId || !incomingPoints || !incomingPoints.length) {
    return;
  }

  const history = state.deviceHistories[deviceId] || [];
  const byId = new Map();
  history.forEach((point) => {
    byId.set(historyPointId(point), point);
  });
  incomingPoints.forEach((point) => {
    byId.set(historyPointId(point), point);
  });

  state.deviceHistories[deviceId] = Array.from(byId.values()).sort(compareHistoryPoints);
  if (deviceId === state.selectedId) {
    state.history = state.deviceHistories[deviceId];
  }
}

function mergeCurrentIntoHistory(snapshot) {
  if (!snapshot || !snapshot.device_id) {
    return;
  }

  const point = snapshotToHistoryPoint(snapshot);
  const history = state.deviceHistories[snapshot.device_id] || [];
  const existingIndex = history.findIndex((item) => historyPointId(item) === historyPointId(point));
  const last = history[history.length - 1];
  if (existingIndex >= 0) {
    history[existingIndex] = point;
  } else if (last && historyPointId(last) === historyPointId(point)) {
    history[history.length - 1] = point;
  } else {
    history.push(point);
  }
  state.deviceHistories[snapshot.device_id] = history;
  if (snapshot.device_id === state.selectedId) {
    state.history = history;
  }
}

function downsamplePoints(points, limit = RENDER_POINT_LIMIT) {
  if (points.length <= limit) {
    return points;
  }

  const result = [];
  const step = (points.length - 1) / (limit - 1);
  for (let index = 0; index < limit; index++) {
    result.push(points[Math.round(index * step)]);
  }
  return result;
}

function emptyBounds(axes) {
  return axes.reduce((bounds, axis) => {
    bounds[axis] = { min: Infinity, max: -Infinity };
    return bounds;
  }, {});
}

function cloneBounds(bounds, axes) {
  if (!bounds) {
    return null;
  }
  return axes.reduce((copy, axis) => {
    copy[axis] = { min: bounds[axis].min, max: bounds[axis].max };
    return copy;
  }, {});
}

function pointsBounds(points, axes) {
  const bounds = emptyBounds(axes);
  let count = 0;

  points.forEach((point) => {
    if (!point) {
      return;
    }
    const values = axes.map((axis) => toNumber(point[axis]));
    if (values.some((value) => value === null)) {
      return;
    }
    values.forEach((value, index) => {
      const axis = axes[index];
      bounds[axis].min = Math.min(bounds[axis].min, value);
      bounds[axis].max = Math.max(bounds[axis].max, value);
    });
    count += 1;
  });

  return count ? bounds : null;
}

function mergeBounds(current, next, axes) {
  if (!next) {
    return current ? cloneBounds(current, axes) : null;
  }
  if (!current) {
    return cloneBounds(next, axes);
  }

  const merged = cloneBounds(current, axes);
  axes.forEach((axis) => {
    merged[axis].min = Math.min(merged[axis].min, next[axis].min);
    merged[axis].max = Math.max(merged[axis].max, next[axis].max);
  });
  return merged;
}

function updateExpandingBounds(boundsState, key, points, axes) {
  const pointCount = points.length;
  if (boundsState.key !== key || pointCount < boundsState.pointCount) {
    boundsState.bounds = null;
  }

  boundsState.key = key;
  boundsState.pointCount = pointCount;
  boundsState.bounds = mergeBounds(boundsState.bounds, pointsBounds(points, axes), axes);
  return boundsState.bounds;
}

function paddedBounds(bounds, axes, minimumSpan, paddingRatio = 0.12) {
  if (!bounds) {
    return null;
  }

  const padded = cloneBounds(bounds, axes);
  axes.forEach((axis) => {
    let min = padded[axis].min;
    let max = padded[axis].max;
    let span = max - min;
    if (span < minimumSpan) {
      const center = (min + max) / 2;
      min = center - minimumSpan / 2;
      max = center + minimumSpan / 2;
      span = minimumSpan;
    }

    const padding = Math.max(span * paddingRatio, minimumSpan * paddingRatio);
    padded[axis].min = min - padding;
    padded[axis].max = max + padding;
  });

  return padded;
}

function boundsValues(bounds, axes) {
  if (!bounds) {
    return [];
  }
  return axes.flatMap((axis) => [bounds[axis].min, bounds[axis].max]);
}

function resetMapBounds() {
  state.mapBoundsState = { key: null, pointCount: 0, bounds: null };
  state.trackPlayback.map = {};
}

function resetSpaceBounds() {
  state.spaceBoundsState = { key: null, pointCount: 0, bounds: null };
  state.trackPlayback.space = {};
}

function resetTrackViewBounds() {
  resetMapBounds();
  resetSpaceBounds();
}

function displayPointId(point, fallbackIndex = 0) {
  return point.recordId ?? point.record_index ?? point.sampleIndex ?? point.time ?? `${point.x},${point.y},${point.z},${fallbackIndex}`;
}

function visiblePlaybackPoints(group, key, points) {
  if (!points.length) {
    delete state.trackPlayback[group][key];
    return [];
  }

  const now = performance.now();
  const firstId = String(displayPointId(points[0], 0));
  const lastId = String(displayPointId(points[points.length - 1], points.length - 1));
  let playback = state.trackPlayback[group][key];

  if (!playback || playback.firstId !== firstId || playback.totalPoints > points.length) {
    playback = {
      firstId,
      lastId,
      totalPoints: points.length,
      visibleCount: Math.min(1, points.length),
      lastUpdate: now,
    };
    state.trackPlayback[group][key] = playback;
    return points.slice(0, playback.visibleCount);
  }

  const elapsedSeconds = Math.max(0, (now - playback.lastUpdate) / 1000);
  const revealStep = Math.max(1, Math.floor(elapsedSeconds * TRACK_REVEAL_POINTS_PER_SECOND));

  playback.totalPoints = points.length;
  playback.lastId = lastId;
  playback.visibleCount = Math.min(points.length, playback.visibleCount + revealStep);
  playback.lastUpdate = now;
  return points.slice(0, playback.visibleCount);
}

function chooseSelectedDevice() {
  const previousId = state.selectedId;
  if (state.selectedId && state.devices.some((item) => item.device_id === state.selectedId)) {
    return;
  }
  const newest = sortedDevices()[0];
  state.selectedId = newest ? newest.device_id : null;
  if (state.selectedId !== previousId) {
    state.trackOrigin = null;
    resetTrackViewBounds();
  }
}

function renderDevices() {
  dom.deviceCount.textContent = state.devices.length.toString();
  dom.deviceList.replaceChildren();

  if (!state.devices.length) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent = "等待设备数据";
    dom.deviceList.appendChild(empty);
    return;
  }

  const devices = sortedDevices();
  devices.forEach((device) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = `device-card${device.device_id === state.selectedId ? " active" : ""}`;
    card.style.borderLeftColor = deviceColor(device.device_id);
    card.style.borderLeftWidth = "5px";

    const header = document.createElement("header");
    const name = document.createElement("strong");
    name.textContent = device.device_id;
    const statePill = document.createElement("i");
    statePill.className = `device-state${isOnline(device) ? " online" : ""}`;
    header.append(name, statePill);

    const address = document.createElement("p");
    address.textContent = device.address ? `ADDR: ${device.address}` : "ADDR: --";

    const seen = document.createElement("p");
    seen.textContent = `最近接收: ${formatLastSeen(device)}`;

    card.append(header, address, seen);
    card.addEventListener("click", () => {
      if (state.selectedId !== device.device_id) {
        state.trackOrigin = null;
        resetTrackViewBounds();
      }
      state.selectedId = device.device_id;
      refreshNow(true);
    });
    dom.deviceList.appendChild(card);
  });
}

function renderStrip() {
  const current = state.current;
  const data = current ? current.data || {} : {};
  dom.selectedDevice.textContent = current ? current.device_id : "等待设备";
  dom.selectedAddress.textContent = current && current.address ? current.address : "--";
  dom.selectedTime.textContent = data.Time || "--";
  dom.lastSeen.textContent = formatLastSeen(current);
  dom.trackerMode.textContent = data.TrackerMode || "--";
  if (data.MotionState) {
    dom.motionStateText.textContent = `${data.MotionState} / ${formatValue(data.MotionConfidence, 2)}`;
  } else {
    dom.motionStateText.textContent = "--";
  }
}

function renderCompare() {
  dom.deviceCompare.replaceChildren();

  const devices = sortedDevices().slice(0, 4);
  if (!devices.length) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent = "等待设备数据";
    dom.deviceCompare.appendChild(empty);
    return;
  }

  devices.forEach((device, index) => {
    const data = device.data || {};
    const card = document.createElement("article");
    card.className = "compare-card";
    card.style.borderLeftColor = deviceColor(device.device_id, index);

    const header = document.createElement("header");
    const name = document.createElement("strong");
    name.textContent = device.device_id;
    const status = document.createElement("span");
    status.className = "compare-status";
    status.textContent = isOnline(device) ? "在线" : formatLastSeen(device);
    header.append(name, status);

    const grid = document.createElement("div");
    grid.className = "compare-grid";
    [
      ["Roll/Pitch/Yaw", `${formatValue(dataNumber(data, "AngleX", 0), 1)} / ${formatValue(dataNumber(data, "AngleY", 0), 1)} / ${formatValue(dataNumber(data, "AngleZ", 0), 1)}`],
      ["加速度", formatMetric(data.AccMagnitude, "g")],
      ["状态 / 速度", `${data.MotionState || "--"} / ${formatMetric(data.TrackSpeed, "m/s")}`],
      ["电量 / 信号", `${formatMetric(data.ElectricPercentage, "%")} / ${formatMetric(data.Rssi, "dBm")}`],
    ].forEach(([labelText, valueText]) => {
      const cell = document.createElement("div");
      const label = document.createElement("span");
      label.textContent = labelText;
      const value = document.createElement("b");
      value.textContent = valueText;
      cell.append(label, value);
      grid.appendChild(cell);
    });

    card.append(header, grid);
    dom.deviceCompare.appendChild(card);
  });
}

function renderMetrics() {
  dom.metricGrid.replaceChildren();

  if (!state.current) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent = "等待设备数据";
    dom.metricGrid.appendChild(empty);
    return;
  }

  const data = state.current.data || {};
  metricDefs.forEach((metric) => {
    const card = document.createElement("article");
    card.className = "metric-card";
    const value = metric.from === "root" ? state.current[metric.key] : data[metric.key];

    const strong = document.createElement("strong");
    strong.textContent = formatMetric(value, metric.unit);
    const label = document.createElement("span");
    label.textContent = metric.label;

    card.append(strong, label);
    dom.metricGrid.appendChild(card);
  });
}

function initLegends() {
  charts.forEach((chart) => {
    const legend = document.querySelector(`[data-legend="${chart.id}"]`);
    if (!legend) {
      return;
    }
    legend.replaceChildren();
    chart.series.forEach((series) => {
      const item = document.createElement("span");
      item.className = "legend-item";
      const dot = document.createElement("i");
      dot.className = "legend-dot";
      dot.style.background = series.color;
      const name = document.createElement("span");
      name.textContent = series.name;
      item.append(dot, name);
      legend.appendChild(item);
    });
  });
}

function getChartValues(points, chart) {
  const values = [];
  points.forEach((point) => {
    chart.series.forEach((series) => {
      const value = toNumber(point.data && point.data[series.key]);
      if (value !== null) {
        values.push(value);
      }
    });
  });
  return values;
}

function niceRange(values) {
  if (!values.length) {
    return { min: -1, max: 1, ticks: [-1, -0.5, 0, 0.5, 1] };
  }

  let min = Math.min(...values);
  let max = Math.max(...values);
  if (min === max) {
    const padding = Math.abs(min) > 1 ? Math.abs(min) * 0.2 : 1;
    min -= padding;
    max += padding;
  }

  const span = max - min;
  min -= span * 0.12;
  max += span * 0.12;

  const rawStep = (max - min) / 4;
  const power = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const normalized = rawStep / power;
  const step = (normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10) * power;
  const niceMin = Math.floor(min / step) * step;
  const niceMax = Math.ceil(max / step) * step;
  const ticks = [];
  for (let value = niceMin; value <= niceMax + step * 0.5; value += step) {
    ticks.push(Number(value.toFixed(8)));
  }
  return { min: niceMin, max: niceMax, ticks };
}

function drawNoData(ctx, width, height) {
  ctx.fillStyle = COLORS.axis;
  ctx.font = "14px Microsoft YaHei, Segoe UI, Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("等待数据", width / 2, height / 2);
}

function drawCanvasNotice(ctx, width, height, title, detail) {
  ctx.fillStyle = COLORS.ink;
  ctx.font = "700 16px Microsoft YaHei, Segoe UI, Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(title, width / 2, height / 2 - 12);

  if (detail) {
    ctx.fillStyle = COLORS.axis;
    ctx.font = "13px Microsoft YaHei, Segoe UI, Arial";
    ctx.fillText(detail, width / 2, height / 2 + 16);
  }
}

function drawChart(chart) {
  const canvas = document.getElementById(chart.id);
  if (!canvas) {
    return;
  }

  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.max(1, Math.floor(rect.width * dpr));
  canvas.height = Math.max(1, Math.floor(rect.height * dpr));

  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const width = rect.width;
  const height = rect.height;
  ctx.clearRect(0, 0, width, height);

  if (!state.history.length) {
    drawNoData(ctx, width, height);
    return;
  }

  const padding = { left: 58, right: 16, top: 18, bottom: 48 };
  const plotW = Math.max(1, width - padding.left - padding.right);
  const plotH = Math.max(1, height - padding.top - padding.bottom);
  const values = getChartValues(state.history, chart);

  if (!values.length) {
    drawNoData(ctx, width, height);
    return;
  }

  const range = niceRange(values);
  const yToPx = (value) => {
    const ratio = (value - range.min) / (range.max - range.min || 1);
    return padding.top + plotH - ratio * plotH;
  };
  const xToPx = (index) => {
    if (state.history.length <= 1) {
      return padding.left + plotW;
    }
    return padding.left + (index / (state.history.length - 1)) * plotW;
  };

  ctx.lineWidth = 1;
  ctx.strokeStyle = COLORS.grid;
  ctx.fillStyle = COLORS.axis;
  ctx.font = "12px Microsoft YaHei, Segoe UI, Arial";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";

  range.ticks.forEach((tick) => {
    const y = yToPx(tick);
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
    ctx.fillText(formatValue(tick), padding.left - 10, y);
  });

  ctx.strokeStyle = COLORS.axis;
  ctx.beginPath();
  ctx.moveTo(padding.left, padding.top);
  ctx.lineTo(padding.left, padding.top + plotH);
  ctx.lineTo(width - padding.right, padding.top + plotH);
  ctx.stroke();

  const labelStep = Math.max(1, Math.ceil(state.history.length / 7));
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  state.history.forEach((point, index) => {
    if (index % labelStep !== 0 && index !== state.history.length - 1) {
      return;
    }
    const x = xToPx(index);
    ctx.save();
    ctx.translate(x, padding.top + plotH + 12);
    ctx.rotate(-Math.PI / 4);
    ctx.fillText(formatClock(point.time || point.received_at), 0, 0);
    ctx.restore();
  });

  chart.series.forEach((series) => {
    ctx.strokeStyle = series.color;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    let started = false;

    state.history.forEach((point, index) => {
      const value = toNumber(point.data && point.data[series.key]);
      if (value === null) {
        started = false;
        return;
      }
      const x = xToPx(index);
      const y = yToPx(value);
      if (!started) {
        ctx.moveTo(x, y);
        started = true;
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();
  });
}

function renderCharts() {
  charts.forEach(drawChart);
}

function getQuaternion(data) {
  return [
    dataNumber(data, "QuaternionW", 1),
    dataNumber(data, "QuaternionX", 0),
    dataNumber(data, "QuaternionY", 0),
    dataNumber(data, "QuaternionZ", 0),
  ];
}

function getThreeQuaternion(data) {
  const [w, x, y, z] = getQuaternion(data || {});
  return new THREE.Quaternion(x, y, z, w).normalize();
}

function rotationMatrixFromQuaternion(quaternion) {
  const [w, x, y, z] = quaternion;
  const qwqw = w * w;
  const qwqx = w * x;
  const qwqy = w * y;
  const qwqz = w * z;
  const qxqy = x * y;
  const qxqz = x * z;
  const qyqz = y * z;
  return [
    2 * (qwqw - 0.5 + x * x), 2 * (qxqy + qwqz), 2 * (qxqz - qwqy),
    2 * (qxqy - qwqz), 2 * (qwqw - 0.5 + y * y), 2 * (qyqz + qwqx),
    2 * (qxqz + qwqy), 2 * (qyqz - qwqx), 2 * (qwqw - 0.5 + z * z),
  ];
}

function ngimuAttitudeMatrix(w, x, y, z) {
  const s = Math.SQRT1_2;
  const cw = s * (w - x);
  const cx = s * (w + x);
  const cy = cx;
  const cz = s * (y - z);
  const cw2 = cw * cw, cx2 = cx * cx, cy2 = cy * cy, cz2 = cz * cz;
  const cxcy = cx * cy, cxcz = cx * cz, cycz = cy * cz;
  const cwcx = cw * cx, cwcy = cw * cy, cwcz = cw * cz;
  return [
    2 * (cy2 + cz2 - 0.5), 2 * (cxcy + cwcz), 2 * (cxcz - cwcy),
    2 * (cxcy - cwcz), 2 * (cx2 + cz2 - 0.5), 2 * (cycz + cwcx),
    2 * (cxcz + cwcy), 2 * (cycz - cwcx), 2 * (cx2 + cy2 - 0.5),
  ];
}

function parseObjGeometry(text) {
  const vertices = [];
  const normals = [];
  const positions = [];
  const normalValues = [];
  const lines = text.split(/\r?\n/);

  const readIndex = (rawIndex, collectionLength) => {
    const index = Number.parseInt(rawIndex, 10);
    if (!Number.isFinite(index)) {
      return null;
    }
    return index < 0 ? collectionLength + index : index - 1;
  };

  const addVertex = (token) => {
    const parts = token.split("/");
    const vertexIndex = readIndex(parts[0], vertices.length);
    if (vertexIndex === null || !vertices[vertexIndex]) {
      return false;
    }

    const vertex = vertices[vertexIndex];
    positions.push(vertex[0], vertex[1], vertex[2]);

    const normalIndex = parts[2] ? readIndex(parts[2], normals.length) : null;
    if (normalIndex !== null && normals[normalIndex]) {
      const normal = normals[normalIndex];
      normalValues.push(normal[0], normal[1], normal[2]);
    }
    return true;
  };

  for (const line of lines) {
    if (line.startsWith("v ")) {
      const parts = line.trim().split(/\s+/);
      vertices.push([Number(parts[1]), Number(parts[2]), Number(parts[3])]);
      continue;
    }

    if (line.startsWith("vn ")) {
      const parts = line.trim().split(/\s+/);
      normals.push([Number(parts[1]), Number(parts[2]), Number(parts[3])]);
      continue;
    }

    if (line.startsWith("f ")) {
      const face = line.trim().split(/\s+/).slice(1);
      for (let index = 1; index < face.length - 1; index++) {
        addVertex(face[0]);
        addVertex(face[index]);
        addVertex(face[index + 1]);
      }
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  if (normalValues.length === positions.length) {
    geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normalValues, 3));
  }
  return geometry;
}

function disposeObject3D(root) {
  if (!root) {
    return;
  }
  root.traverse((object) => {
    if (object.geometry) {
      object.geometry.dispose();
    }
    if (object.material) {
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      materials.forEach((material) => {
        if (material.map && material.map.dispose) {
          material.map.dispose();
        }
        if (material.dispose) {
          material.dispose();
        }
      });
    }
  });
  root.clear();
}

function resizeThreeRenderer(view, mount) {
  if (!view.enabled || !view.renderer || !mount) {
    return;
  }
  const rect = mount.getBoundingClientRect();
  const width = Math.max(1, Math.floor(rect.width));
  const height = Math.max(1, Math.floor(rect.height));
  if (view._lastWidth === width && view._lastHeight === height) {
    return;
  }
  view._lastWidth = width;
  view._lastHeight = height;
  view.camera.aspect = width / height;
  view.camera.updateProjectionMatrix();
  view.renderer.setSize(width, height, false);
  view.updateCamera();
}

function makeTextSprite(text, color, options = {}) {
  const fontSize = options.fontSize || 30;
  const paddingX = options.paddingX || 18;
  const paddingY = options.paddingY || 12;
  const canvas = document.createElement("canvas");
  const measureCanvas = document.createElement("canvas");
  const measureCtx = measureCanvas.getContext("2d");
  measureCtx.font = `700 ${fontSize}px Microsoft YaHei, Segoe UI, Arial`;
  const textWidth = Math.ceil(measureCtx.measureText(text).width);
  canvas.width = Math.max(144, textWidth + paddingX * 2);
  canvas.height = Math.max(56, fontSize + paddingY * 2);
  const ctx = canvas.getContext("2d");
  ctx.font = `700 ${fontSize}px Microsoft YaHei, Segoe UI, Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(255, 255, 255, 0.86)";
  ctx.fillRect(4, 4, canvas.width - 8, canvas.height - 8);
  ctx.strokeStyle = color;
  ctx.lineWidth = options.lineWidth || 3;
  ctx.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);
  ctx.fillStyle = color;
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(material);
  const scale = options.scale || 0.0032;
  sprite.scale.set(canvas.width * scale, canvas.height * scale, 1);
  return sprite;
}

function renderAttitudeCanvas(data) {
  const canvas = dom.attitudeCanvas;
  const rect = dom.attitudeMount.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.max(1, Math.floor(rect.width * dpr));
  canvas.height = Math.max(1, Math.floor(rect.height * dpr));

  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, rect.width, rect.height);

  if (!data) {
    drawNoData(ctx, rect.width, rect.height);
    return;
  }

  const [qw, qx, qy, qz] = getQuaternion(data);
  const m = ngimuAttitudeMatrix(qw, qx, qy, qz);
  const vertices = [
    [-1.7, -1.0, -0.48], [1.7, -1.0, -0.48], [1.7, 1.0, -0.48], [-1.7, 1.0, -0.48],
    [-1.7, -1.0, 0.48], [1.7, -1.0, 0.48], [1.7, 1.0, 0.48], [-1.7, 1.0, 0.48],
  ];
  const faces = [
    [0, 1, 2, 3, "#26374a"], [4, 5, 6, 7, "#1f7d5c"], [0, 1, 5, 4, "#94a3b8"],
    [2, 3, 7, 6, "#64748b"], [1, 2, 6, 5, "#475569"], [0, 3, 7, 4, "#475569"],
  ];

  const rotate = ([x, y, z]) => [
    m[0] * x + m[1] * y + m[2] * z,
    m[3] * x + m[4] * y + m[5] * z,
    m[6] * x + m[7] * y + m[8] * z,
  ];
  const scale = Math.min(rect.width, rect.height) * 0.17;
  const center = [rect.width / 2, rect.height / 2 + 10];
  const projected = vertices.map((vertex) => {
    const [x, y, z] = rotate(vertex);
    return {
      x: center[0] + (x - z * 0.42) * scale,
      y: center[1] + (-y - z * 0.24) * scale,
      z,
    };
  });

  ctx.lineWidth = 1.5;
  faces
    .map((face) => ({ face, depth: face.slice(0, 4).reduce((sum, index) => sum + projected[index].z, 0) }))
    .sort((a, b) => a.depth - b.depth)
    .forEach(({ face }) => {
      ctx.beginPath();
      face.slice(0, 4).forEach((index, order) => {
        const point = projected[index];
        if (order === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.closePath();
      ctx.fillStyle = face[4];
      ctx.globalAlpha = 0.72;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = "rgba(27,36,48,0.55)";
      ctx.stroke();
    });

  const surfaceParts = [
    { p: [-0.9, -0.42, 0.52], w: 0.48, h: 0.34, color: "#111827" },
    { p: [0.12, -0.45, 0.52], w: 0.62, h: 0.42, color: "#334155" },
    { p: [0.92, -0.18, 0.52], w: 0.42, h: 0.22, color: "#cbd5e1" },
    { p: [-1.15, 0.48, 0.52], w: 0.2, h: 0.2, color: "#22c55e" },
    { p: [-0.78, 0.48, 0.52], w: 0.2, h: 0.2, color: "#ef4444" },
  ];

  surfaceParts.forEach((part) => {
    const [x, y, z] = rotate(part.p);
    const px = center[0] + (x - z * 0.42) * scale;
    const py = center[1] + (-y - z * 0.24) * scale;
    ctx.fillStyle = part.color;
    ctx.globalAlpha = 0.86;
    ctx.fillRect(px - part.w * scale * 0.5, py - part.h * scale * 0.5, part.w * scale, part.h * scale);
    ctx.globalAlpha = 1;
  });

  const axes = [
    { end: rotate([1.85, 0, 0]), color: COLORS.red, label: "X" },
    { end: rotate([0, 1.85, 0]), color: COLORS.green, label: "Y" },
    { end: rotate([0, 0, 1.85]), color: COLORS.blue, label: "Z" },
  ];
  axes.forEach((axis) => {
    const x = center[0] + (axis.end[0] - axis.end[2] * 0.42) * scale;
    const y = center[1] + (-axis.end[1] - axis.end[2] * 0.24) * scale;
    ctx.strokeStyle = axis.color;
    ctx.fillStyle = axis.color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(center[0], center[1]);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.font = "700 14px Microsoft YaHei, Segoe UI, Arial";
    ctx.fillText(axis.label, x + 5, y - 5);
  });
}

const attitude3d = {
  enabled: false,
  renderer: null,
  scene: null,
  camera: null,
  model: null,
  realModel: null,
  grid: null,
  pointer: null,
  loadingModel: false,
  modelLoadFailed: false,
  viewYaw: 0,
  viewPitch: 0.18,
  viewDistance: 6.2,
  _lastWidth: 0,
  _lastHeight: 0,

  init() {
    if (!window.THREE || this.renderer || !dom.attitudeMount) {
      return;
    }

    this.enabled = true;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(cssVariable("--panel", "#111827"));
    this.camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio || 1);
    this.renderer.domElement.className = "attitude-webgl";
    dom.attitudeCanvas.style.display = "none";
    dom.attitudeMount.appendChild(this.renderer.domElement);

    this.model = new THREE.Group();
    this.scene.add(this.model);
    this.createFallbackModel();

    this.scene.add(new THREE.AmbientLight(0xffffff, 0.72));
    const light = new THREE.DirectionalLight(0xffffff, 0.85);
    light.position.set(2, 4, 5);
    this.scene.add(light);
    this.scene.add(new THREE.AxesHelper(2.4));
    this.grid = new THREE.GridHelper(5.5, 11, 0xb8c2d2, 0xd8dee8);
    this.grid.position.y = -1.25;
    this.scene.add(this.grid);
    this.applyTheme();
    this.bindPointerControls();
    this.updateCamera();
    dom.attitudeMode.textContent = "正在加载 NGIMU 模型";
    this.loadRealModel();
  },

  applyTheme() {
    if (!this.scene || !window.THREE) {
      return;
    }
    this.scene.background = new THREE.Color(cssVariable("--panel", "#111827"));
    if (this.grid) {
      const materials = Array.isArray(this.grid.material) ? this.grid.material : [this.grid.material];
      if (materials[0]) {
        materials[0].color.set(COLORS.axis);
        materials[0].needsUpdate = true;
      }
      if (materials[1]) {
        materials[1].color.set(COLORS.grid);
        materials[1].needsUpdate = true;
      }
    }
  },

  createFallbackModel() {
    this.model.clear();

    const board = new THREE.Mesh(
      new THREE.BoxGeometry(3.4, 2.0, 0.96),
      new THREE.MeshStandardMaterial({ color: 0x1f7d5c, roughness: 0.58, metalness: 0.08 })
    );
    board.position.z = 0;

    const caseTop = new THREE.Mesh(
      new THREE.BoxGeometry(3.5, 2.1, 0.22),
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.48, metalness: 0.12, transparent: true, opacity: 0.78 })
    );
    caseTop.position.z = 0.59;

    const chip = new THREE.Mesh(
      new THREE.BoxGeometry(0.66, 0.54, 0.16),
      new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.45 })
    );
    chip.position.set(-0.55, -0.18, 0.65);

    const sensor = new THREE.Mesh(
      new THREE.BoxGeometry(0.48, 0.4, 0.13),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.42 })
    );
    sensor.position.set(0.32, -0.26, 0.65);

    const connector = new THREE.Mesh(
      new THREE.BoxGeometry(0.58, 0.36, 0.2),
      new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.28, metalness: 0.45 })
    );
    connector.position.set(1.35, 0, 0.65);

    const ledGreen = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.05, 18),
      new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x0a5a25, roughness: 0.2 })
    );
    ledGreen.rotation.x = Math.PI / 2;
    ledGreen.position.set(-1.25, 0.58, 0.67);

    const ledRed = ledGreen.clone();
    ledRed.material = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0x641111, roughness: 0.2 });
    ledRed.position.x = -0.98;

    const edge = new THREE.LineSegments(
      new THREE.EdgesGeometry(caseTop.geometry),
      new THREE.LineBasicMaterial({ color: 0x0f172a, transparent: true, opacity: 0.72 })
    );
    edge.position.copy(caseTop.position);

    this.model.add(board, caseTop, edge, chip, sensor, connector, ledGreen, ledRed);
    dom.attitudeMode.textContent = "NGIMU 模型加载中";
  },

  async loadRealModel() {
    if (this.loadingModel || this.realModel || this.modelLoadFailed) {
      return;
    }

    this.loadingModel = true;
    try {
      const response = await fetch(REAL_IMU_MODEL_URL);
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }
      const text = await response.text();
      const geometry = parseObjGeometry(text);
      geometry.computeBoundingBox();
      geometry.center();
      const size = new THREE.Vector3();
      geometry.boundingBox.getSize(size);
      const scale = 3.4 / Math.max(size.x, size.y, size.z || 1);
      geometry.scale(scale, scale, scale);
      geometry.computeBoundingSphere();
      if (!geometry.attributes.normal) {
        geometry.computeVertexNormals();
      }

      const material = new THREE.MeshStandardMaterial({
        color: 0xd7dde8,
        roughness: 0.5,
        metalness: 0.18,
      });
      const mesh = new THREE.Mesh(geometry, material);

      this.realModel = mesh;
      this.model.clear();
      this.model.add(mesh);
      dom.attitudeMode.textContent = "NGIMU 真实外壳模型";
      this.render(state.current ? state.current.data || {} : null);
    } catch (error) {
      this.modelLoadFailed = true;
      dom.attitudeMode.textContent = "NGIMU 结构示意模型";
    } finally {
      this.loadingModel = false;
    }
  },

  bindPointerControls() {
    const canvas = this.renderer.domElement;
    canvas.addEventListener("pointerdown", (event) => {
      this.pointer = {
        id: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        yaw: this.viewYaw,
        pitch: this.viewPitch,
      };
      canvas.setPointerCapture(event.pointerId);
    });

    canvas.addEventListener("pointermove", (event) => {
      if (!this.pointer || this.pointer.id !== event.pointerId) {
        return;
      }
      this.viewYaw = this.pointer.yaw + (event.clientX - this.pointer.x) * 0.008;
      this.viewPitch = Math.max(-0.6, Math.min(0.9, this.pointer.pitch + (event.clientY - this.pointer.y) * 0.006));
      this.updateCamera();
      this.renderer.render(this.scene, this.camera);
    });

    canvas.addEventListener("pointerup", (event) => {
      if (this.pointer && this.pointer.id === event.pointerId) {
        this.pointer = null;
      }
    });

    canvas.addEventListener("wheel", (event) => {
      event.preventDefault();
      this.viewDistance = Math.max(3.4, Math.min(10, this.viewDistance + Math.sign(event.deltaY) * 0.45));
      this.updateCamera();
      this.renderer.render(this.scene, this.camera);
    }, { passive: false });
  },

  resetView() {
    this.viewYaw = 0;
    this.viewPitch = 0.18;
    this.viewDistance = 6.2;
    if (this.camera) {
      this.updateCamera();
    }
  },

  updateCamera() {
    if (!this.camera) {
      return;
    }
    const distance = this.viewDistance;
    const cosPitch = Math.cos(this.viewPitch);
    this.camera.position.set(
      Math.sin(this.viewYaw) * cosPitch * distance,
      1.15 + Math.sin(this.viewPitch) * distance,
      Math.cos(this.viewYaw) * cosPitch * distance
    );
    this.camera.lookAt(0, 0, 0);
  },

  resize() {
    resizeThreeRenderer(this, dom.attitudeMount);
  },

  render(data) {
    this.init();
    if (!this.enabled || !this.renderer) {
      dom.attitudeMode.textContent = "Canvas";
      renderAttitudeCanvas(data);
      return;
    }
    this.resize();
    this.applyTheme();
    if (data) {
      const [w, x, y, z] = getQuaternion(data);
      const inv = new THREE.Quaternion(-x, -y, -z, w).normalize();
      const rotX = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2);
      this.model.quaternion.copy(rotX).multiply(inv);
    }
    this.renderer.render(this.scene, this.camera);
  },
};

function renderAttitude() {
  const data = state.current ? state.current.data || {} : null;
  if (data) {
    const roll = formatValue(dataNumber(data, "AngleX", 0), 1);
    const pitch = formatValue(dataNumber(data, "AngleY", 0), 1);
    const yaw = formatValue(dataNumber(data, "AngleZ", 0), 1);
    dom.attitudeAngles.textContent = `${roll} / ${pitch} / ${yaw}`;
  } else {
    dom.attitudeAngles.textContent = "-- / -- / --";
  }
  attitude3d.render(data);
}

function currentPosition(data) {
  return {
    x: firstNumber(data, ["TrackX", "PositionX"]) || 0,
    y: firstNumber(data, ["TrackY", "PositionY"]) || 0,
    z: firstNumber(data, ["TrackZ", "PositionZ"]) || 0,
  };
}

function clonePosition(position) {
  return {
    x: toNumber(position && position.x) ?? 0,
    y: toNumber(position && position.y) ?? 0,
    z: toNumber(position && position.z) ?? 0,
  };
}

function trackOriginKey(deviceId) {
  return `${deviceId || "selected"}:${state.trackStartIds[deviceId] || "startup"}`;
}

function setTrackOrigin(deviceId, position) {
  state.trackOrigins[trackOriginKey(deviceId)] = clonePosition(position);
}

function getTrackOrigin(deviceId, fallbackPosition = null) {
  const key = trackOriginKey(deviceId);
  const stored = state.trackOrigins[key];
  if (stored) {
    return stored;
  }

  if (state.trackStartIds[deviceId] && fallbackPosition) {
    state.trackOrigins[key] = clonePosition(fallbackPosition);
    return state.trackOrigins[key];
  }

  return { x: 0, y: 0, z: 0 };
}

function clearTrackOriginsForDevice(deviceId) {
  Object.keys(state.trackOrigins).forEach((key) => {
    if (key.startsWith(`${deviceId}:`)) {
      delete state.trackOrigins[key];
    }
  });
}

function historyHasGps() {
  return state.history.some((point) => gpsPosition(point.data || {}));
}

function activeMapSource() {
  if (state.mapMode === "relative") {
    return "relative";
  }
  if (state.mapMode === "xyz") {
    return "xyz";
  }
  return historyHasGps() ? "gps" : "relative";
}

function gpsToMeters(position, origin) {
  const latScale = 110540;
  const lonScale = 111320 * Math.cos((origin.latitude * Math.PI) / 180);
  return {
    x: (position.longitude - origin.longitude) * lonScale,
    y: (position.latitude - origin.latitude) * latScale,
    z: 0,
    latitude: position.latitude,
    longitude: position.longitude,
  };
}

function buildMapPoints(source) {
  if (!state.trackOrigin) {
    state.trackOrigin = {};
  }
  const displayHistory = historyAfterTrackStart(state.selectedId, state.history);

  if (source === "gps") {
    const gpsHistory = displayHistory
      .map((point) => ({ point, gps: gpsPosition(point.data || {}) }))
      .filter((item) => item.gps);
    if (!gpsHistory.length) {
      return [];
    }
    const origin = (state.trackOrigin && state.trackOrigin.gps) || gpsHistory[0].gps;
    return gpsHistory.map((item, index) => {
      const meters = gpsToMeters(item.gps, origin);
      return {
        ...meters,
        recordId: historyPointId(item.point) || `gps-${index}`,
        time: item.point.time || item.point.received_at,
      };
    });
  }

  if (!displayHistory.length) {
    return [];
  }
  const origin = (state.trackOrigin && state.trackOrigin.relative)
    || getTrackOrigin(state.selectedId, currentPosition(displayHistory[0].data || {}));

  return displayHistory.map((point, index) => {
    const pos = currentPosition(point.data || {});
    return {
      x: pos.x - origin.x,
      y: pos.y - origin.y,
      z: pos.z - origin.z,
      recordId: historyPointId(point) || `relative-${index}`,
      time: point.time || point.received_at,
    };
  });
}

function niceDistance(value) {
  const safeValue = Math.max(0.001, value);
  const power = Math.pow(10, Math.floor(Math.log10(safeValue)));
  const normalized = safeValue / power;
  const step = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  return step * power;
}

function niceAxisStep(value) {
  const safeValue = Math.max(0.000001, Math.abs(value));
  const power = Math.pow(10, Math.floor(Math.log10(safeValue)));
  const normalized = safeValue / power;
  const step = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  return step * power;
}

function axisDigitsForStep(step) {
  if (!Number.isFinite(step) || step <= 0) {
    return 2;
  }
  if (step >= 10) {
    return 0;
  }
  if (step >= 1) {
    return 1;
  }
  return Math.min(6, Math.max(2, Math.ceil(-Math.log10(step)) + 1));
}

function formatAxisTick(value, step) {
  const digits = axisDigitsForStep(step);
  if (Math.abs(value) < step * 0.0005) {
    return "0m";
  }
  return `${formatSignedMetric(value, digits)}m`;
}

function spaceGridStepForBounds(visibleBounds) {
  const spanX = Math.max(SPACE_MIN_SPAN_M, visibleBounds.x.max - visibleBounds.x.min);
  const spanY = Math.max(SPACE_MIN_SPAN_M, visibleBounds.y.max - visibleBounds.y.min);
  const spanZ = Math.max(SPACE_MIN_SPAN_M, visibleBounds.z.max - visibleBounds.z.min);
  let step = niceAxisStep(Math.max(spanX, spanY, spanZ) / 12);
  while ((spanX / step > 26 || spanY / step > 26 || spanZ / step > 26) && step < Math.max(spanX, spanY, spanZ)) {
    step *= 2;
  }
  return step;
}

function pathLength(points) {
  let distance = 0;
  for (let index = 1; index < points.length; index++) {
    const previous = points[index - 1];
    const current = points[index];
    const dx = current.x - previous.x;
    const dy = current.y - previous.y;
    const dz = current.z - previous.z;
    distance += Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
  return distance;
}

function pointDistance(point) {
  if (!point) {
    return 0;
  }
  return Math.sqrt(point.x * point.x + point.y * point.y + point.z * point.z);
}

function formatSignedMetric(value, digits = 2) {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return "--";
  }
  const sign = number > 0 ? "+" : "";
  return `${sign}${formatValue(number, digits)}`;
}

function displacementDigits(value) {
  const magnitude = Math.abs(Number(value));
  if (!Number.isFinite(magnitude)) {
    return 2;
  }
  if (magnitude < 0.001) {
    return 5;
  }
  if (magnitude < 0.01) {
    return 4;
  }
  if (magnitude < 0.1) {
    return 3;
  }
  return 2;
}

function formatSignedDisplacement(value) {
  return formatSignedMetric(value, displacementDigits(value));
}

function latestDisplacementText(point) {
  if (!point) {
    return "X -- / Y -- / Z -- / 距离 --";
  }
  return [
    `X ${formatSignedDisplacement(point.x)} m`,
    `Y ${formatSignedDisplacement(point.y)} m`,
    `Z ${formatSignedDisplacement(point.z)} m`,
    `距离 ${formatValue(pointDistance(point), displacementDigits(pointDistance(point)))} m`,
  ].join(" / ");
}

function historyAfterTrackStart(deviceId, history) {
  const startId = state.trackStartIds[deviceId];
  if (!startId) {
    return history;
  }

  const startIndex = history.findIndex((point) => String(historyPointId(point)) === startId);
  if (startIndex >= 0) {
    return history.slice(startIndex);
  }
  return history.length ? history.slice(-1) : history;
}

function buildRelativeTrack(deviceId) {
  const history = historyAfterTrackStart(deviceId, state.deviceHistories[deviceId] || []);
  const points = history
    .map((historyPoint, index) => {
      const position = currentPosition(historyPoint.data || {});
      return {
        ...position,
        recordId: historyPointId(historyPoint) || `${deviceId}-${index}`,
        time: historyPoint.time || historyPoint.received_at,
      };
    })
    .filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y) && Number.isFinite(point.z));

  if (!points.length) {
    return [];
  }

  const origin = getTrackOrigin(deviceId, points[0]);
  return points.map((point) => ({
    x: point.x - origin.x,
    y: point.y - origin.y,
    z: point.z - origin.z,
    recordId: point.recordId,
    time: point.time,
  }));
}

function buildSpaceTracks() {
  const devices = historyDevicesForView();
  return devices.map((device, index) => ({
    device,
    color: deviceColor(device.device_id, index),
    points: buildRelativeTrack(device.device_id),
  })).filter((track) => track.points.length);
}

const space3d = {
  enabled: false,
  renderer: null,
  scene: null,
  camera: null,
  content: null,
  grid: null,
  pointer: null,
  viewYaw: 0.4,
  viewPitch: 0.45,
  viewDistance: 7.2,
  visibleTracks: [],
  lastVisibleBounds: null,
  _lastWidth: 0,
  _lastHeight: 0,

  init() {
    if (!window.THREE || this.renderer || !dom.spaceMount) {
      return;
    }

    this.enabled = true;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(cssVariable("--panel", "#111827"));
    this.camera = new THREE.PerspectiveCamera(42, 1, 0.1, 120);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio || 1);
    this.renderer.domElement.className = "space-webgl";
    dom.spaceCanvas.style.display = "none";
    dom.spaceMount.appendChild(this.renderer.domElement);

    this.content = new THREE.Group();
    this.scene.add(this.content);
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.78));
    const light = new THREE.DirectionalLight(0xffffff, 0.8);
    light.position.set(4, 7, 6);
    this.scene.add(light);

    this.applyTheme();
    this.bindPointerControls();
    this.updateCamera();
  },

  applyTheme() {
    if (!this.scene || !window.THREE) {
      return;
    }
    this.scene.background = new THREE.Color(cssVariable("--panel", "#111827"));
  },

  bindPointerControls() {
    const canvas = this.renderer.domElement;
    canvas.addEventListener("pointerdown", (event) => {
      this.pointer = {
        id: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        yaw: this.viewYaw,
        pitch: this.viewPitch,
      };
      canvas.setPointerCapture(event.pointerId);
    });

    canvas.addEventListener("pointermove", (event) => {
      if (!this.pointer || this.pointer.id !== event.pointerId) {
        return;
      }
      this.viewYaw = this.pointer.yaw + (event.clientX - this.pointer.x) * 0.008;
      this.viewPitch = Math.max(-0.35, Math.min(1.05, this.pointer.pitch + (event.clientY - this.pointer.y) * 0.006));
      this.updateCamera();
      this.renderer.render(this.scene, this.camera);
    });

    canvas.addEventListener("pointerup", (event) => {
      if (this.pointer && this.pointer.id === event.pointerId) {
        this.pointer = null;
      }
    });

    canvas.addEventListener("wheel", (event) => {
      event.preventDefault();
      this.viewDistance = Math.max(4, Math.min(16, this.viewDistance + Math.sign(event.deltaY) * 0.5));
      this.updateCamera();
      this.renderer.render(this.scene, this.camera);
    }, { passive: false });
  },

  resetView() {
    this.viewYaw = 0.4;
    this.viewPitch = 0.45;
    this.viewDistance = 7.2;
    this.updateCamera();
  },

  updateCamera() {
    if (!this.camera) {
      return;
    }
    const distance = this.viewDistance;
    const cosPitch = Math.cos(this.viewPitch);
    this.camera.position.set(
      Math.sin(this.viewYaw) * cosPitch * distance,
      1.2 + Math.sin(this.viewPitch) * distance,
      Math.cos(this.viewYaw) * cosPitch * distance
    );
    this.camera.lookAt(0, 0, 0);
  },

  resize() {
    resizeThreeRenderer(this, dom.spaceMount);
  },

  addLine(start, end, color, opacity = 0.9, dashed = false) {
    const material = dashed
      ? new THREE.LineDashedMaterial({ color, transparent: true, opacity, dashSize: 0.08, gapSize: 0.05 })
      : new THREE.LineBasicMaterial({ color, transparent: true, opacity });
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([start, end]), material);
    if (dashed) {
      line.computeLineDistances();
    }
    this.content.add(line);
    return line;
  },

  addLabel(text, color, position, options = {}) {
    const sprite = makeTextSprite(text, color, {
      fontSize: options.fontSize || 22,
      lineWidth: 2,
      scale: options.scale || 0.0028,
    });
    sprite.position.copy(position);
    if (options.offset) {
      sprite.position.add(options.offset);
    }
    this.content.add(sprite);
    return sprite;
  },

  addAxisArrow(origin, end, color, opacity = 0.86) {
    const direction = end.clone().sub(origin);
    const length = direction.length();
    if (length < 0.08) {
      return;
    }
    const arrow = new THREE.ArrowHelper(direction.normalize(), origin, length, color, 0.18, 0.1);
    arrow.line.material.transparent = true;
    arrow.line.material.opacity = opacity;
    arrow.cone.material.transparent = true;
    arrow.cone.material.opacity = opacity;
    this.content.add(arrow);
  },

  addDataGrid(visibleBounds, toWorld) {
    const minX = visibleBounds.x.min;
    const maxX = visibleBounds.x.max;
    const minY = visibleBounds.y.min;
    const maxY = visibleBounds.y.max;
    const spanX = Math.max(SPACE_MIN_SPAN_M, maxX - minX);
    const spanY = Math.max(SPACE_MIN_SPAN_M, maxY - minY);
    const gridStep = spaceGridStepForBounds(visibleBounds);

    const startX = Math.floor(minX / gridStep) * gridStep;
    const endX = Math.ceil(maxX / gridStep) * gridStep;
    const startY = Math.floor(minY / gridStep) * gridStep;
    const endY = Math.ceil(maxY / gridStep) * gridStep;
    const zeroEpsilon = gridStep * 0.001;

    for (let x = startX; x <= endX + zeroEpsilon; x += gridStep) {
      const opacity = Math.abs(x) <= zeroEpsilon ? 0.48 : 0.2;
      this.addLine(
        toWorld({ x, y: minY, z: 0 }),
        toWorld({ x, y: maxY, z: 0 }),
        Math.abs(x) <= zeroEpsilon ? COLORS.axis : COLORS.grid,
        opacity
      );
    }

    for (let y = startY; y <= endY + zeroEpsilon; y += gridStep) {
      const opacity = Math.abs(y) <= zeroEpsilon ? 0.48 : 0.2;
      this.addLine(
        toWorld({ x: minX, y, z: 0 }),
        toWorld({ x: maxX, y, z: 0 }),
        Math.abs(y) <= zeroEpsilon ? COLORS.axis : COLORS.grid,
        opacity
      );
    }

    const labelBase = toWorld({ x: maxX, y: minY, z: 0 });
    this.addLabel(`网格 ${formatAxisTick(gridStep, gridStep).replace("+", "")}`, COLORS.axis, labelBase, {
      fontSize: 18,
      scale: 0.0023,
      offset: new THREE.Vector3(0.08, 0.06, 0.08),
    });

    return gridStep;
  },

  addAxisTicks(visibleBounds, toWorld, step) {
    const originData = { x: 0, y: 0, z: 0 };
    const tickSize = 0.055;
    const epsilon = step * 0.0005;
    const axisSpecs = [
      {
        key: "x",
        name: "X",
        color: COLORS.red,
        point: (value) => ({ x: value, y: 0, z: 0 }),
        tick: new THREE.Vector3(0, 0, tickSize),
        labelOffset: new THREE.Vector3(0.05, 0.05, 0.11),
      },
      {
        key: "y",
        name: "Y",
        color: COLORS.green,
        point: (value) => ({ x: 0, y: value, z: 0 }),
        tick: new THREE.Vector3(tickSize, 0, 0),
        labelOffset: new THREE.Vector3(0.08, 0.05, 0.03),
      },
      {
        key: "z",
        name: "Z",
        color: COLORS.amber,
        point: (value) => ({ x: 0, y: 0, z: value }),
        tick: new THREE.Vector3(tickSize, 0, 0),
        labelOffset: new THREE.Vector3(0.08, 0.06, 0.03),
      },
    ];

    axisSpecs.forEach((axis) => {
      const min = visibleBounds[axis.key].min;
      const max = visibleBounds[axis.key].max;
      const start = Math.ceil(min / step) * step;
      const end = Math.floor(max / step) * step;
      const tickCount = Math.max(0, Math.round((end - start) / step) + 1);
      const labelEvery = Math.max(1, Math.ceil(tickCount / 9));
      let index = 0;

      for (let value = start; value <= end + epsilon; value += step) {
        if (Math.abs(value) <= epsilon) {
          index += 1;
          continue;
        }

        const center = toWorld(axis.point(value));
        const a = center.clone().sub(axis.tick);
        const b = center.clone().add(axis.tick);
        this.addLine(a, b, axis.color, 0.7);

        if (index % labelEvery === 0 || Math.abs(value - end) <= epsilon) {
          this.addLabel(`${axis.name} ${formatAxisTick(value, step)}`, axis.color, center, {
            fontSize: 18,
            scale: 0.0022,
            offset: axis.labelOffset,
          });
        }
        index += 1;
      }
    });

    this.addLabel("0m", COLORS.axis, toWorld(originData), {
      fontSize: 18,
      scale: 0.0022,
      offset: new THREE.Vector3(-0.12, -0.1, -0.1),
    });
  },

  addCoordinateGuides(visibleBounds, toWorld, selectedTrack, gridStep) {
    const originData = { x: 0, y: 0, z: 0 };
    const origin = toWorld(originData);
    const axisSpecs = [
      { key: "x", name: "X", color: COLORS.red, positive: { x: visibleBounds.x.max, y: 0, z: 0 }, negative: { x: visibleBounds.x.min, y: 0, z: 0 } },
      { key: "y", name: "Y", color: COLORS.green, positive: { x: 0, y: visibleBounds.y.max, z: 0 }, negative: { x: 0, y: visibleBounds.y.min, z: 0 } },
      { key: "z", name: "Z", color: COLORS.amber, positive: { x: 0, y: 0, z: visibleBounds.z.max }, negative: { x: 0, y: 0, z: visibleBounds.z.min } },
    ];

    this.addLabel("O 0m", COLORS.axis, origin, { fontSize: 20, scale: 0.0025, offset: new THREE.Vector3(0.08, 0.08, 0.08) });
    const originMarker = new THREE.Mesh(
      new THREE.SphereGeometry(0.06, 18, 12),
      new THREE.MeshStandardMaterial({ color: 0x4f9f6d, roughness: 0.42 })
    );
    originMarker.position.copy(origin);
    this.content.add(originMarker);
    this.addAxisTicks(visibleBounds, toWorld, gridStep);

    axisSpecs.forEach((axis) => {
      const negative = toWorld(axis.negative);
      const positive = toWorld(axis.positive);
      this.addLine(negative, origin, axis.color, 0.46);
      this.addLine(origin, positive, axis.color, 0.72);
      this.addAxisArrow(origin, positive, axis.color);

      const positiveValue = axis.positive[axis.key];
      const negativeValue = axis.negative[axis.key];
      this.addLabel(`${axis.name}+ ${formatValue(Math.max(0, positiveValue), 2)}m`, axis.color, positive, {
        fontSize: 20,
        scale: 0.0025,
        offset: new THREE.Vector3(0.08, 0.08, 0.08),
      });
      if (negativeValue < -0.01) {
        this.addAxisArrow(origin, negative, axis.color, 0.5);
        this.addLabel(`${axis.name}- ${formatValue(Math.abs(negativeValue), 2)}m`, axis.color, negative, {
          fontSize: 20,
          scale: 0.0025,
          offset: new THREE.Vector3(-0.08, 0.06, -0.08),
        });
      }
    });

    if (!selectedTrack || !selectedTrack.points.length) {
      return;
    }

    const latest = selectedTrack.points[selectedTrack.points.length - 1];
    const p0 = toWorld(originData);
    const p1 = toWorld({ x: latest.x, y: 0, z: 0 });
    const p2 = toWorld({ x: latest.x, y: latest.y, z: 0 });
    const p3 = toWorld(latest);

    this.addLine(p0, p1, COLORS.red, 0.95);
    this.addLine(p1, p2, COLORS.green, 0.95);
    this.addLine(p2, p3, COLORS.amber, 0.95);
    this.addLine(p0, p3, COLORS.violet, 0.42, true);

    this.addLabel(`ΔX ${formatSignedDisplacement(latest.x)}m`, COLORS.red, p1, { fontSize: 21, scale: 0.0026, offset: new THREE.Vector3(0.08, 0.08, 0) });
    this.addLabel(`ΔY ${formatSignedDisplacement(latest.y)}m`, COLORS.green, p2, { fontSize: 21, scale: 0.0026, offset: new THREE.Vector3(0.08, 0.08, 0) });
    this.addLabel(`ΔZ ${formatSignedDisplacement(latest.z)}m`, COLORS.amber, p3, { fontSize: 21, scale: 0.0026, offset: new THREE.Vector3(0.08, 0.28, 0) });
    this.addLabel(`距离 ${formatValue(pointDistance(latest), displacementDigits(pointDistance(latest)))}m`, COLORS.violet, p3, {
      fontSize: 22,
      scale: 0.0028,
      offset: new THREE.Vector3(0.08, 0.52, 0.08),
    });
  },

  smoothPathPoints(pathPoints) {
    if (pathPoints.length < 4) {
      return pathPoints;
    }
    const curve = new THREE.CatmullRomCurve3(pathPoints, false, "centripetal", 0.25);
    const sampleCount = Math.min(900, Math.max(pathPoints.length, pathPoints.length * 3));
    return curve.getPoints(sampleCount);
  },

  addTrajectoryLine(pathPoints, color) {
    if (pathPoints.length < 2) {
      return;
    }

    const smoothPoints = this.smoothPathPoints(pathPoints);
    const geometry = new THREE.BufferGeometry().setFromPoints(smoothPoints);
    const base = new THREE.Color(color);
    const start = new THREE.Color(COLORS.grid);
    const colors = [];
    smoothPoints.forEach((point, index) => {
      const ratio = smoothPoints.length <= 1 ? 1 : index / (smoothPoints.length - 1);
      const c = start.clone().lerp(base, 0.28 + ratio * 0.72);
      colors.push(c.r, c.g, c.b);
    });
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    const line = new THREE.Line(
      geometry,
      new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.95 })
    );
    this.content.add(line);
  },

  addCurrentMarker(pathPoints, color) {
    if (!pathPoints.length) {
      return;
    }

    const latest = pathPoints[pathPoints.length - 1];
    const previous = pathPoints.length > 1 ? pathPoints[pathPoints.length - 2] : null;
    const direction = previous ? latest.clone().sub(previous) : new THREE.Vector3(1, 0, 0);
    if (direction.length() < 0.001) {
      direction.set(1, 0, 0);
    }
    direction.normalize();

    const glow = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 24, 16),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.14, depthWrite: false })
    );
    glow.position.copy(latest);
    this.content.add(glow);

    const marker = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.SphereGeometry(0.07, 22, 14),
      new THREE.MeshStandardMaterial({ color, roughness: 0.42, metalness: 0.06 })
    );
    const nose = new THREE.Mesh(
      new THREE.ConeGeometry(0.06, 0.22, 24),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.32 })
    );
    nose.rotation.z = -Math.PI / 2;
    nose.position.x = 0.16;
    marker.add(body, nose);
    marker.position.copy(latest);
    marker.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), direction);
    this.content.add(marker);
  },

  render(tracks) {
    this.init();
    if (!this.enabled || !this.renderer) {
      renderSpaceCanvasFallback(tracks);
      return;
    }

    this.resize();
    this.applyTheme();
    disposeObject3D(this.content);

    if (!tracks.length) {
      this.visibleTracks = [];
      this.lastVisibleBounds = null;
      this.renderer.render(this.scene, this.camera);
      return;
    }

    const visibleTracks = tracks
      .map((track) => ({
        ...track,
        points: visiblePlaybackPoints("space", `space:${track.device.device_id}`, track.points),
      }))
      .filter((track) => track.points.length);
    this.visibleTracks = visibleTracks;

    if (!visibleTracks.length) {
      this.renderer.render(this.scene, this.camera);
      return;
    }

    const preparedTracks = visibleTracks.map((track) => ({
      ...track,
      renderPoints: downsamplePoints(track.points),
    }));
    const boundsKey = tracks
      .map((track) => `${track.device.device_id}:${displayPointId(track.points[0], 0)}`)
      .join("|");
    const trackBounds = updateExpandingBounds(
      state.spaceBoundsState,
      `space:${boundsKey}`,
      preparedTracks.flatMap((track) => track.points),
      ["x", "y", "z"]
    );
    const bounds = mergeBounds(trackBounds, pointsBounds([{ x: 0, y: 0, z: 0 }], ["x", "y", "z"]), ["x", "y", "z"]);
    const visibleBounds = paddedBounds(bounds, ["x", "y", "z"], SPACE_MIN_SPAN_M, 0.08);
    this.lastVisibleBounds = visibleBounds;

    const minX = visibleBounds.x.min;
    const maxX = visibleBounds.x.max;
    const minY = visibleBounds.y.min;
    const maxY = visibleBounds.y.max;
    const minZ = visibleBounds.z.min;
    const maxZ = visibleBounds.z.max;
    const center = {
      x: (minX + maxX) / 2,
      y: (minY + maxY) / 2,
      z: (minZ + maxZ) / 2,
    };
    const span = Math.max(SPACE_MIN_SPAN_M, maxX - minX, maxY - minY, (maxZ - minZ) * 1.4);
    const scale = SPACE_TARGET_SPAN / span;
    const toWorld = (point) => new THREE.Vector3(
      (point.x - center.x) * scale,
      (point.z - center.z) * scale,
      -(point.y - center.y) * scale
    );
    const selectedVisibleTrack = visibleTracks.find((track) => track.device.device_id === state.selectedId) || visibleTracks[0];
    const gridStep = this.addDataGrid(visibleBounds, toWorld);
    this.addCoordinateGuides(visibleBounds, toWorld, selectedVisibleTrack, gridStep);

    preparedTracks.forEach((track) => {
      const color = new THREE.Color(track.color);
      const pathPoints = track.renderPoints.map(toWorld);

      this.addTrajectoryLine(pathPoints, color);

      const dots = new THREE.Points(
        new THREE.BufferGeometry().setFromPoints(pathPoints),
        new THREE.PointsMaterial({ color, size: 0.05, sizeAttenuation: true, transparent: true, opacity: 0.66 })
      );
      this.content.add(dots);

      const latest = pathPoints[pathPoints.length - 1];
      const first = pathPoints[0];
      const floorPoint = latest.clone();
      floorPoint.y = 0;
      const dropLine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([floorPoint, latest]),
        new THREE.LineDashedMaterial({ color, transparent: true, opacity: 0.45, dashSize: 0.08, gapSize: 0.05 })
      );
      dropLine.computeLineDistances();
      this.content.add(dropLine);

      const startMarker = new THREE.Mesh(
        new THREE.SphereGeometry(0.07, 18, 12),
        new THREE.MeshStandardMaterial({ color: 0x4f9f6d, roughness: 0.42 })
      );
      startMarker.position.copy(first);
      this.content.add(startMarker);
      this.addCurrentMarker(pathPoints, color);
    });

    this.renderer.render(this.scene, this.camera);
  },
};

function renderSpaceCanvasFallback(tracks) {
  const canvas = dom.spaceCanvas;
  const rect = dom.spaceMount.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.max(1, Math.floor(rect.width * dpr));
  canvas.height = Math.max(1, Math.floor(rect.height * dpr));
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, rect.width, rect.height);
  if (!tracks.length) {
    resetSpaceBounds();
    drawCanvasNotice(ctx, rect.width, rect.height, "等待三维位移数据", "该视图会持续记录 TrackX / TrackY / TrackZ");
    return;
  }
  drawCanvasNotice(ctx, rect.width, rect.height, "浏览器未启用 Three.js", "三维空间诊断需要 WebGL");
}

function renderSpace() {
  const tracks = buildSpaceTracks();
  const totalPoints = tracks.reduce((sum, track) => sum + track.points.length, 0);
  dom.spaceModeText.textContent = "Gait Tracking ZUPT 实时位移轨迹";
  dom.spaceSummary.textContent = tracks.length ? `${tracks.length} 台 / ${totalPoints} 点` : "--";

  if (!tracks.length) {
    resetSpaceBounds();
    dom.spaceCoordinateText.textContent = "空间坐标 --";
    dom.spaceScaleText.textContent = "等待估计值";
  } else {
    const selectedTrack = tracks.find((track) => track.device.device_id === state.selectedId) || tracks[0];
    const selectedLatest = selectedTrack.points[selectedTrack.points.length - 1];
    const latestText = tracks.length > 1
      ? `${selectedTrack.device.device_id}: ${latestDisplacementText(selectedLatest)}；其余 ${tracks.length - 1} 条显示于图中`
      : `${selectedTrack.device.device_id}: ${latestDisplacementText(selectedLatest)}`;
    dom.spaceCoordinateText.textContent = latestText;
    const status = state.current && state.current.data ? state.current.data.TrackStatus : null;
    dom.spaceScaleText.textContent = status ? `单位 m / ${status}` : "单位 m";
  }

  space3d.render(tracks);
  if (tracks.length && space3d.visibleTracks.length) {
    const visibleTracks = space3d.visibleTracks;
    const selectedTrack = visibleTracks.find((track) => track.device.device_id === state.selectedId) || visibleTracks[0];
    const selectedLatest = selectedTrack.points[selectedTrack.points.length - 1];
    const latestText = visibleTracks.length > 1
      ? `${selectedTrack.device.device_id}: ${latestDisplacementText(selectedLatest)}；其余 ${visibleTracks.length - 1} 条显示于图中`
      : `${selectedTrack.device.device_id}: ${latestDisplacementText(selectedLatest)}`;
    dom.spaceCoordinateText.textContent = latestText;
    const visiblePointCount = visibleTracks.reduce((sum, track) => sum + track.points.length, 0);
    dom.spaceSummary.textContent = `${tracks.length} 台 / 已绘制 ${visiblePointCount} / 总 ${totalPoints} 点`;
  }
  if (tracks.length && space3d.lastVisibleBounds) {
    const bounds = space3d.lastVisibleBounds;
    const xSpan = bounds.x.max - bounds.x.min;
    const ySpan = bounds.y.max - bounds.y.min;
    const zSpan = bounds.z.max - bounds.z.min;
    const gridStep = spaceGridStepForBounds(bounds);
    const status = state.current && state.current.data ? state.current.data.TrackStatus : null;
    const rangeText = `范围 X ${formatAxisTick(xSpan, gridStep).replace("+", "")} / Y ${formatAxisTick(ySpan, gridStep).replace("+", "")} / Z ${formatAxisTick(zSpan, gridStep).replace("+", "")}`;
    dom.spaceScaleText.textContent = status ? `${rangeText} / ${status}` : rangeText;
  }
}

function activeMocapMode() {
  if (state.mocapMode !== "auto") {
    return state.mocapMode;
  }

  const count = lowerBodySimulationDevices().length;
  if (count === 0 || count >= 5) {
    return "lower";
  }
  if (count >= 3) {
    return "four";
  }
  return "two";
}

function mocapRolesForMode(mode) {
  return (MOCAP_ROLE_SETS[mode] || MOCAP_ROLE_SETS.two).slice();
}

function mocapSortedDevices() {
  return lowerBodySimulationDevices().sort((a, b) => String(a.device_id).localeCompare(String(b.device_id)));
}

function buildMocapAssignments() {
  const roles = mocapRolesForMode(activeMocapMode());
  const devices = mocapSortedDevices();
  return roles.map((role, index) => ({
    role,
    device: devices[index] || null,
    color: devices[index] ? deviceColor(devices[index].device_id, index) : DEVICE_COLORS[index % DEVICE_COLORS.length],
  }));
}

function renderMocapCanvasFallback(assignments) {
  const canvas = dom.mocapCanvas;
  const rect = dom.mocapMount.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.max(1, Math.floor(rect.width * dpr));
  canvas.height = Math.max(1, Math.floor(rect.height * dpr));
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, rect.width, rect.height);
  if (!assignments.length) {
    drawCanvasNotice(ctx, rect.width, rect.height, "等待 IMU 骨架数据", "可用模拟器启动 lower-body 模板");
    return;
  }
  drawCanvasNotice(ctx, rect.width, rect.height, "浏览器未启用 Three.js", "下肢模板需要 WebGL");
}

const mocap3d = {
  enabled: false,
  renderer: null,
  scene: null,
  camera: null,
  content: null,
  pointer: null,
  referenceQuaternions: new Map(),
  viewYaw: 0.2,
  viewPitch: 0.24,
  viewDistance: 5.2,
  _lastWidth: 0,
  _lastHeight: 0,

  init() {
    if (!window.THREE || this.renderer || !dom.mocapMount) {
      return;
    }

    this.enabled = true;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(cssVariable("--panel", "#111827"));
    this.camera = new THREE.PerspectiveCamera(38, 1, 0.1, 80);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio || 1);
    this.renderer.domElement.className = "mocap-webgl";
    dom.mocapCanvas.style.display = "none";
    dom.mocapMount.appendChild(this.renderer.domElement);

    this.content = new THREE.Group();
    this.scene.add(this.content);
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.74));
    const keyLight = new THREE.DirectionalLight(0xffffff, 0.82);
    keyLight.position.set(3, 5, 4);
    this.scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0xbfd7ff, 0.35);
    fillLight.position.set(-4, 3, -3);
    this.scene.add(fillLight);
    this.grid = new THREE.GridHelper(4.6, 10, 0xa9b5c4, 0xdbe2ec);
    this.grid.position.y = 0;
    this.scene.add(this.grid);
    this.applyTheme();
    this.bindPointerControls();
    this.updateCamera();
  },

  applyTheme() {
    if (!this.scene || !window.THREE) {
      return;
    }
    this.scene.background = new THREE.Color(cssVariable("--panel", "#111827"));
    if (this.grid) {
      const materials = Array.isArray(this.grid.material) ? this.grid.material : [this.grid.material];
      if (materials[0]) {
        materials[0].color.set(COLORS.axis);
        materials[0].needsUpdate = true;
      }
      if (materials[1]) {
        materials[1].color.set(COLORS.grid);
        materials[1].needsUpdate = true;
      }
    }
  },

  bindPointerControls() {
    const canvas = this.renderer.domElement;
    canvas.addEventListener("pointerdown", (event) => {
      this.pointer = {
        id: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        yaw: this.viewYaw,
        pitch: this.viewPitch,
      };
      canvas.setPointerCapture(event.pointerId);
    });

    canvas.addEventListener("pointermove", (event) => {
      if (!this.pointer || this.pointer.id !== event.pointerId) {
        return;
      }
      this.viewYaw = this.pointer.yaw + (event.clientX - this.pointer.x) * 0.008;
      this.viewPitch = Math.max(-0.25, Math.min(0.85, this.pointer.pitch + (event.clientY - this.pointer.y) * 0.006));
      this.updateCamera();
      this.renderer.render(this.scene, this.camera);
    });

    canvas.addEventListener("pointerup", (event) => {
      if (this.pointer && this.pointer.id === event.pointerId) {
        this.pointer = null;
      }
    });

    canvas.addEventListener("wheel", (event) => {
      event.preventDefault();
      this.viewDistance = Math.max(3.4, Math.min(9, this.viewDistance + Math.sign(event.deltaY) * 0.35));
      this.updateCamera();
      this.renderer.render(this.scene, this.camera);
    }, { passive: false });
  },

  resetView() {
    this.viewYaw = 0.2;
    this.viewPitch = 0.24;
    this.viewDistance = 5.2;
    this.referenceQuaternions.clear();
    this.updateCamera();
  },

  updateCamera() {
    if (!this.camera) {
      return;
    }
    const distance = this.viewDistance;
    const cosPitch = Math.cos(this.viewPitch);
    this.camera.position.set(
      Math.sin(this.viewYaw) * cosPitch * distance,
      1.25 + Math.sin(this.viewPitch) * distance,
      Math.cos(this.viewYaw) * cosPitch * distance
    );
    this.camera.lookAt(0, 1.05, 0);
  },

  resize() {
    resizeThreeRenderer(this, dom.mocapMount);
  },

  directionForRole(role, assignmentMap, defaultVector, demoVector) {
    const assignment = assignmentMap.get(role);
    if (!assignment || !assignment.device || !assignment.device.data) {
      return demoVector.clone().normalize();
    }

    const q = getThreeQuaternion(assignment.device.data);
    const referenceKey = `${role}:${assignment.device.device_id}`;
    if (!this.referenceQuaternions.has(referenceKey)) {
      this.referenceQuaternions.set(referenceKey, q.clone().invert());
    }

    const relative = q.clone().premultiply(this.referenceQuaternions.get(referenceKey));
    return defaultVector.clone().applyQuaternion(relative).normalize();
  },

  addSegment(start, end, radius, color) {
    const vector = end.clone().sub(start);
    const length = Math.max(0.001, vector.length());
    const geometry = new THREE.CylinderGeometry(radius, radius, length, 18);
    const material = new THREE.MeshStandardMaterial({ color, roughness: 0.52, metalness: 0.08 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(start).add(end).multiplyScalar(0.5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), vector.clone().normalize());
    this.content.add(mesh);
  },

  addJoint(position, radius, color) {
    const geometry = new THREE.SphereGeometry(radius, 18, 12);
    const material = new THREE.MeshStandardMaterial({ color, roughness: 0.45, metalness: 0.08 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(position);
    this.content.add(mesh);
  },

  addFoot(ankle, toe, color) {
    const vector = toe.clone().sub(ankle);
    const length = Math.max(0.18, vector.length());
    const geometry = new THREE.BoxGeometry(0.16, 0.08, length);
    const material = new THREE.MeshStandardMaterial({ color, roughness: 0.48, metalness: 0.08 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(ankle).add(toe).multiplyScalar(0.5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), vector.clone().normalize());
    this.content.add(mesh);
  },

  sagittalDirection(angle) {
    return new THREE.Vector3(0, -Math.cos(angle), Math.sin(angle)).normalize();
  },

  footDirection(angle) {
    return new THREE.Vector3(0, -Math.sin(angle) * 0.16, Math.cos(angle)).normalize();
  },

  renderLeg(side, assignmentMap, timeSeconds) {
    const sign = side === "left" ? -1 : 1;
    const sideName = side === "left" ? "left" : "right";
    const phase = timeSeconds * 2.2 + (side === "right" ? Math.PI : 0);
    const hipFlex = Math.sin(phase) * 0.42;
    const kneeFlex = Math.max(0, Math.sin(phase + 0.35)) * 0.72;
    const ankleFlex = Math.sin(phase - 0.2) * 0.28;

    const hip = new THREE.Vector3(sign * 0.24, 1.72, 0);
    const thighDefault = new THREE.Vector3(0, -1, 0);
    const shankDefault = new THREE.Vector3(0, -1, 0);
    const footDefault = new THREE.Vector3(0, 0, 1);
    const thighDir = this.directionForRole(`${sideName}_thigh`, assignmentMap, thighDefault, this.sagittalDirection(hipFlex));
    const shankDir = this.directionForRole(`${sideName}_shank`, assignmentMap, shankDefault, this.sagittalDirection(hipFlex - kneeFlex));
    const footDir = this.directionForRole(`${sideName}_foot`, assignmentMap, footDefault, this.footDirection(ankleFlex));
    const knee = hip.clone().add(thighDir.multiplyScalar(0.72));
    const ankle = knee.clone().add(shankDir.multiplyScalar(0.72));
    const toe = ankle.clone().add(footDir.multiplyScalar(0.36));
    const color = side === "left" ? 0x315fbd : 0x4f9f6d;

    this.addSegment(hip, knee, 0.055, color);
    this.addSegment(knee, ankle, 0.048, color);
    this.addFoot(ankle, toe, color);
    [hip, knee, ankle].forEach((point) => this.addJoint(point, 0.075, 0xffffff));
    this.addJoint(toe, 0.045, color);
  },

  render(assignments) {
    this.init();
    if (!this.enabled || !this.renderer) {
      renderMocapCanvasFallback(assignments);
      return;
    }

    this.resize();
    this.applyTheme();
    disposeObject3D(this.content);
    const assignmentMap = new Map(assignments.map((assignment) => [assignment.role, assignment]));
    const now = performance.now() / 1000;

    const pelvis = new THREE.Mesh(
      new THREE.BoxGeometry(0.72, 0.18, 0.26),
      new THREE.MeshStandardMaterial({ color: 0x17202b, roughness: 0.52, metalness: 0.08 })
    );
    pelvis.position.set(0, 1.72, 0);
    const pelvisAssignment = assignmentMap.get("pelvis");
    if (pelvisAssignment && pelvisAssignment.device && pelvisAssignment.device.data) {
      const q = getThreeQuaternion(pelvisAssignment.device.data);
      const key = `pelvis:${pelvisAssignment.device.device_id}`;
      if (!this.referenceQuaternions.has(key)) {
        this.referenceQuaternions.set(key, q.clone().invert());
      }
      pelvis.quaternion.copy(q.clone().premultiply(this.referenceQuaternions.get(key)));
    }
    this.content.add(pelvis);

    this.renderLeg("left", assignmentMap, now);
    this.renderLeg("right", assignmentMap, now);

    const spine = new THREE.Vector3(0, 2.2, -0.02);
    this.addSegment(new THREE.Vector3(0, 1.78, 0), spine, 0.06, 0x7860bd);
    this.addJoint(spine, 0.08, 0x7860bd);
    this.renderer.render(this.scene, this.camera);
  },
};

function renderMocap() {
  if (!dom.mocapMount) {
    return;
  }

  const mode = activeMocapMode();
  const assignments = buildMocapAssignments();
  const activeCount = assignments.filter((assignment) => assignment.device).length;
  const labels = { two: "2 IMU 模拟足部", four: "4 IMU 模拟小腿/足部", lower: "7 IMU 模拟下肢" };

  dom.mocapModeText.textContent = `${labels[mode]}${state.mocapMode === "auto" ? "（自动）" : ""}`;
  dom.mocapSummary.textContent = `${activeCount}/${assignments.length} IMU`;
  dom.mocapRoleText.textContent = assignments
    .map((assignment) => `${MOCAP_ROLE_LABELS[assignment.role]}:${assignment.device ? assignment.device.device_id : "模板"}`)
    .join("  |  ");
  dom.mocapSourceText.textContent = activeCount ? "模拟端姿态 + 模板补全" : "实时端不绑定 7 IMU";

  mocap3d.render(assignments);
}

function drawXyzTrackChart(ctx, width, height, points, valueRange = null) {
  const padding = { left: 58, right: 18, top: 20, bottom: 42 };
  const plotW = Math.max(1, width - padding.left - padding.right);
  const plotH = Math.max(1, height - padding.top - padding.bottom);
  const values = points.flatMap((point) => [point.x, point.y, point.z]);
  const range = valueRange || niceRange(values);
  const yToPx = (value) => {
    const ratio = (value - range.min) / (range.max - range.min || 1);
    return padding.top + plotH - ratio * plotH;
  };
  const xToPx = (index) => {
    if (points.length <= 1) {
      return padding.left + plotW;
    }
    return padding.left + (index / (points.length - 1)) * plotW;
  };

  ctx.strokeStyle = COLORS.grid;
  ctx.lineWidth = 1;
  ctx.fillStyle = COLORS.axis;
  ctx.font = "12px Microsoft YaHei, Segoe UI, Arial";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  range.ticks.forEach((tick) => {
    const y = yToPx(tick);
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
    ctx.fillText(formatValue(tick, 2), padding.left - 10, y);
  });

  const zeroY = yToPx(0);
  ctx.strokeStyle = COLORS.axis;
  ctx.beginPath();
  ctx.moveTo(padding.left, zeroY);
  ctx.lineTo(width - padding.right, zeroY);
  ctx.stroke();

  const series = [
    { key: "x", label: "X", color: COLORS.blue },
    { key: "y", label: "Y", color: COLORS.green },
    { key: "z", label: "Z", color: COLORS.amber },
  ];
  series.forEach((item) => {
    ctx.strokeStyle = item.color;
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    points.forEach((point, index) => {
      const x = xToPx(index);
      const y = yToPx(point[item.key]);
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    const latest = points[points.length - 1];
    const lx = xToPx(points.length - 1);
    const ly = yToPx(latest[item.key]);
    ctx.fillStyle = item.color;
    ctx.beginPath();
    ctx.arc(lx, ly, 4.5, 0, Math.PI * 2);
    ctx.fill();
  });

  const labelStep = Math.max(1, Math.ceil(points.length / 6));
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillStyle = COLORS.axis;
  points.forEach((point, index) => {
    if (index % labelStep !== 0 && index !== points.length - 1) {
      return;
    }
    ctx.fillText(formatClock(point.time), xToPx(index), padding.top + plotH + 12);
  });

  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  series.forEach((item, index) => {
    const x = padding.left + index * 54;
    const y = 12;
    ctx.fillStyle = item.color;
    ctx.fillRect(x, y - 4, 18, 4);
    ctx.fillText(item.label, x + 24, y);
  });

  return range;
}

function renderTrack() {
  if (!dom.trackCanvas) {
    return;
  }

  const canvas = dom.trackCanvas;
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.max(1, Math.floor(rect.width * dpr));
  canvas.height = Math.max(1, Math.floor(rect.height * dpr));

  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, rect.width, rect.height);

  const source = activeMapSource();
  const points = buildMapPoints(source);
  dom.mapSourceText.textContent = source === "xyz" ? "TrackX / TrackY / TrackZ 实时位移" : "Gait ZUPT 3D 轨迹 XY 投影";

  if (!state.history.length || !points.length) {
    resetMapBounds();
    dom.trackDistance.textContent = "-- m";
    dom.mapCoordinateText.textContent = "估计坐标 --";
    dom.mapScaleText.textContent = "比例尺 --";
    if (source === "gps") {
      dom.mapSourceText.textContent = "未收到 GPS 经纬度";
      drawCanvasNotice(ctx, rect.width, rect.height, "无 GPS 定位数据", "当前 54 字节数据帧不包含经纬度，不能生成真实地图轨迹");
    } else {
      drawCanvasNotice(ctx, rect.width, rect.height, "无运动诊断数据", "等待 TrackX / TrackY / TrackZ 估计值");
    }
    return;
  }

  const playbackKey = `map:${source}:${state.selectedId || ""}`;
  const boundsKey = `${playbackKey}:${displayPointId(points[0], 0)}`;
  const visiblePoints = visiblePlaybackPoints("map", playbackKey, points);
  if (!visiblePoints.length) {
    return;
  }

  if (source === "xyz") {
    const bounds = updateExpandingBounds(
      state.mapBoundsState,
      boundsKey,
      visiblePoints,
      ["x", "y", "z"]
    );
    const range = niceRange(boundsValues(bounds, ["x", "y", "z"]));
    drawXyzTrackChart(ctx, rect.width, rect.height, visiblePoints, range);
    const latest = visiblePoints[visiblePoints.length - 1];
    const distance = pathLength(visiblePoints);
    dom.trackDistance.textContent = `${formatValue(distance, 2)} m`;
    dom.mapCoordinateText.textContent = latestDisplacementText(latest);
    dom.mapScaleText.textContent = `Y 轴 ${formatValue(range.min, 2)} ~ ${formatValue(range.max, 2)} m`;
    return;
  }

  const bounds = updateExpandingBounds(
    state.mapBoundsState,
    boundsKey,
    visiblePoints,
    ["x", "y"]
  );
  const visibleBounds = paddedBounds(bounds, ["x", "y"], TRACK_MIN_SPAN_M, 0.12);
  const minX = visibleBounds.x.min;
  const maxX = visibleBounds.x.max;
  const minY = visibleBounds.y.min;
  const maxY = visibleBounds.y.max;
  const spanX = Math.max(TRACK_MIN_SPAN_M, maxX - minX);
  const spanY = Math.max(TRACK_MIN_SPAN_M, maxY - minY);
  const padding = 38;
  const plotW = Math.max(1, rect.width - padding * 2);
  const plotH = Math.max(1, rect.height - padding * 2);
  const scale = Math.min(plotW / spanX, plotH / spanY) * 0.82;
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  const toCanvas = (point) => ({
    x: rect.width / 2 + (point.x - centerX) * scale,
    y: rect.height / 2 - (point.y - centerY) * scale,
  });

  const maxRange = Math.max(spanX, spanY);
  const gridStep = niceDistance(maxRange / 4);
  ctx.strokeStyle = COLORS.grid;
  ctx.lineWidth = 1;
  ctx.font = "12px Microsoft YaHei, Segoe UI, Arial";
  ctx.fillStyle = COLORS.axis;

  const startGridX = Math.floor((centerX - rect.width / 2 / scale) / gridStep) * gridStep;
  const endGridX = Math.ceil((centerX + rect.width / 2 / scale) / gridStep) * gridStep;
  for (let x = startGridX; x <= endGridX; x += gridStep) {
    const px = toCanvas({ x, y: centerY }).x;
    ctx.beginPath();
    ctx.moveTo(px, padding);
    ctx.lineTo(px, rect.height - padding);
    ctx.stroke();
  }

  const startGridY = Math.floor((centerY - rect.height / 2 / scale) / gridStep) * gridStep;
  const endGridY = Math.ceil((centerY + rect.height / 2 / scale) / gridStep) * gridStep;
  for (let y = startGridY; y <= endGridY; y += gridStep) {
    const py = toCanvas({ x: centerX, y }).y;
    ctx.beginPath();
    ctx.moveTo(padding, py);
    ctx.lineTo(rect.width - padding, py);
    ctx.stroke();
  }

  const zero = toCanvas({ x: 0, y: 0 });
  ctx.strokeStyle = COLORS.axis;
  ctx.beginPath();
  ctx.moveTo(padding, zero.y);
  ctx.lineTo(rect.width - padding, zero.y);
  ctx.moveTo(zero.x, padding);
  ctx.lineTo(zero.x, rect.height - padding);
  ctx.stroke();

  ctx.fillStyle = COLORS.axis;
  ctx.fillText("E", rect.width - padding + 8, zero.y + 4);
  ctx.fillText("N", zero.x + 8, padding - 8);

  ctx.strokeStyle = COLORS.blue;
  ctx.lineWidth = 2.8;
  ctx.beginPath();
  visiblePoints.forEach((point, index) => {
    const p = toCanvas(point);
    if (index === 0) {
      ctx.moveTo(p.x, p.y);
    } else {
      ctx.lineTo(p.x, p.y);
    }
  });
  ctx.stroke();

  const first = toCanvas(visiblePoints[0]);
  const last = toCanvas(visiblePoints[visiblePoints.length - 1]);
  ctx.fillStyle = COLORS.green;
  ctx.beginPath();
  ctx.arc(first.x, first.y, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = COLORS.red;
  ctx.beginPath();
  ctx.arc(last.x, last.y, 6, 0, Math.PI * 2);
  ctx.fill();

  const latest = visiblePoints[visiblePoints.length - 1];
  const distance = pathLength(visiblePoints);
  dom.trackDistance.textContent = `${formatValue(distance, 2)} m`;
  if (source === "gps" && latest.latitude !== undefined) {
    dom.mapCoordinateText.textContent = `坐标 ${latest.latitude.toFixed(6)}, ${latest.longitude.toFixed(6)}`;
  } else {
    dom.mapCoordinateText.textContent = `估计 ${latestDisplacementText(latest)}`;
  }
  dom.mapScaleText.textContent = `比例尺 ${formatValue(gridStep, 2)} m`;
}

function renderAll() {
  renderDevices();
  renderStrip();
  renderCompare();
  renderMetrics();
  renderAttitude();
  renderSpace();
  renderMocap();
  renderTrack();
  renderCharts();
}

function renderRealtime(changes = {}) {
  renderStrip();
  renderMetrics();
  renderAttitude();
  renderSpace();
  renderTrack();

  if (changes.devicesChanged || changes.slowRender) {
    renderDevices();
    renderCompare();
  }
  if (changes.devicesChanged || changes.historyChanged || changes.slowRender) {
    renderMocap();
  }
  if (changes.historyChanged || changes.slowRender) {
    renderCharts();
  }
}

async function refreshNow(force = false) {
  if (state.paused && !force) {
    return;
  }
  if (state.refreshInFlight) {
    return;
  }

  state.refreshInFlight = true;
  const now = performance.now();
  const simulatedMode = lowerBodySimulationDevices().length > 0;
  const devicePollMs = simulatedMode ? HISTORY_POLL_MS : DEVICE_LIST_POLL_MS;
  const needDevices = force || !state.devices.length || now - state.lastDeviceListFetch >= devicePollMs;
  const needHistory = !state.historyInFlight && (force || !state.selectedId || now - state.lastHistoryFetch >= HISTORY_POLL_MS);
  const slowRender = force || now - state.lastSlowRender >= SLOW_RENDER_MS;
  let devicesChanged = false;

  try {
    if (needDevices) {
      const devicePayload = await fetchJson("/api/devices");
      state.devices = devicePayload.devices || [];
      chooseSelectedDevice();
      state.lastDeviceListFetch = now;
      devicesChanged = true;
    } else {
      chooseSelectedDevice();
    }

    if (!state.selectedId) {
      state.current = null;
      state.history = [];
      state.deviceHistories = {};
      state.trackStartIds = {};
      state.trackOrigins = {};
      resetTrackViewBounds();
      setConnection("warn", "等待设备");
      renderAll();
      return;
    }

    const currentPromise = fetchJson(`/api/devices/${encodeURIComponent(state.selectedId)}`);
    const devicesForHistory = needHistory ? historyDevicesForView() : [];
    const historyLimit = devicesForHistory.length > 1 ? 320 : HISTORY_LIMIT;
    const historyPromise = needHistory ? Promise.all(devicesForHistory.map((device) => (
      fetchJson(`/api/devices/${encodeURIComponent(device.device_id)}/history?limit=${historyLimit}`)
    ))).then(
      (payloads) => ({ payloads }),
      (error) => ({ error })
    ) : null;
    const current = await currentPromise;

    state.current = current;
    mergeCurrentIntoHistory(current);

    state.history = state.deviceHistories[state.selectedId] || [];
    setConnection(isOnline(current) ? "online" : "warn", isOnline(current) ? "在线" : "未更新");
    if (slowRender) {
      state.lastSlowRender = now;
    }
    renderRealtime({ devicesChanged, historyChanged: false, slowRender });

    if (historyPromise) {
      const historySelectedId = state.selectedId;
      state.historyInFlight = true;
      historyPromise
        .then((result) => {
          if (result.error) {
            if (!state.current) {
              setConnection("warn", "历史异常");
            }
            return;
          }
          const historyPayloads = result.payloads || [];
          historyPayloads.forEach((payload) => {
            mergeHistoryPoints(payload.device_id, payload.points || []);
          });
          mergeCurrentIntoHistory(current);
          state.lastHistoryFetch = performance.now();
          if (state.selectedId === historySelectedId) {
            state.history = state.deviceHistories[state.selectedId] || [];
          }
          renderRealtime({ historyChanged: true });
        })
        .finally(() => {
          state.historyInFlight = false;
        });
    }
  } catch (error) {
    setConnection("warn", "API 异常");
    if (!state.current) {
      state.history = [];
      state.deviceHistories = {};
      state.trackStartIds = {};
      state.trackOrigins = {};
      resetTrackViewBounds();
      renderAll();
    }
  } finally {
    state.refreshInFlight = false;
  }
}

async function clearSelectedHistory() {
  if (!state.selectedId) {
    return;
  }
  try {
    await fetchJson(`/api/devices/${encodeURIComponent(state.selectedId)}/history`, {
      method: "DELETE",
    });
    state.history = [];
    state.deviceHistories[state.selectedId] = [];
    state.trackOrigin = null;
    delete state.trackStartIds[state.selectedId];
    clearTrackOriginsForDevice(state.selectedId);
    if (state.current) {
      const data = state.current.data || {};
      state.trackOrigin = {
        relative: currentPosition(data),
        gps: gpsPosition(data),
      };
      setTrackOrigin(state.selectedId, state.trackOrigin.relative);
    }
    resetTrackViewBounds();
    renderAll();
  } catch (error) {
    setConnection("warn", "清空失败");
  }
}

function resetTrack() {
  if (state.current) {
    const data = state.current.data || {};
    const currentPoint = snapshotToHistoryPoint(state.current);
    state.trackStartIds[state.selectedId] = String(historyPointId(currentPoint));
    historyDevicesForView().forEach((device) => {
      const history = state.deviceHistories[device.device_id] || [];
      const latestPoint = history[history.length - 1];
      if (latestPoint) {
        state.trackStartIds[device.device_id] = String(historyPointId(latestPoint));
      }
    });
    state.trackOrigin = {
      relative: currentPosition(data),
      gps: gpsPosition(data),
    };
    setTrackOrigin(state.selectedId, state.trackOrigin.relative);
    historyDevicesForView().forEach((device) => {
      const history = state.deviceHistories[device.device_id] || [];
      const latestPoint = history[history.length - 1];
      if (latestPoint) {
        setTrackOrigin(device.device_id, currentPosition(latestPoint.data || {}));
      }
    });
  } else {
    state.trackOrigin = null;
  }
  resetTrackViewBounds();
  renderSpace();
  renderTrack();
}

function bindActions() {
  dom.reset3dView.addEventListener("click", () => {
    attitude3d.resetView();
    renderAttitude();
  });

  dom.resetSpaceView.addEventListener("click", () => {
    space3d.resetView();
    renderSpace();
  });

  if (dom.resetMocapView) {
    dom.resetMocapView.addEventListener("click", () => {
      mocap3d.resetView();
      renderMocap();
    });
  }

  dom.refreshToggle.addEventListener("click", () => {
    state.paused = !state.paused;
    dom.refreshToggle.textContent = state.paused ? "继续刷新" : "暂停刷新";
    if (!state.paused) {
      refreshNow();
    }
  });

  if (dom.themeToggle) {
    dom.themeToggle.addEventListener("click", () => {
      const currentTheme = document.documentElement.dataset.theme === "day" ? "day" : "night";
      applyTheme(currentTheme === "day" ? "night" : "day", { persist: true, render: true });
      initLegends();
    });
  }

  dom.clearHistory.addEventListener("click", clearSelectedHistory);
  dom.resetTrack.addEventListener("click", resetTrack);
  dom.mapModeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.mapMode = button.dataset.mapMode;
      dom.mapModeButtons.forEach((item) => item.classList.toggle("active", item === button));
      state.trackOrigin = null;
      resetMapBounds();
      renderTrack();
    });
  });
  dom.mocapModeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.mocapMode = button.dataset.mocapMode;
      dom.mocapModeButtons.forEach((item) => item.classList.toggle("active", item === button));
      mocap3d.referenceQuaternions.clear();
      renderMocap();
    });
  });

  let resizeTimer = null;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      renderAttitude();
      renderSpace();
      renderMocap();
      renderTrack();
      renderCharts();
    }, 120);
  });
}

applyTheme(storedTheme());
initLegends();
bindActions();
setConnection("idle", "初始化");
refreshNow();
setInterval(refreshNow, LIVE_POLL_MS);
