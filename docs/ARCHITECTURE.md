# 智守银龄系统架构说明

本文档面向中国大学生计算机设计大赛答辩、项目交接和本地硬件联调，说明当前仓库的模块边界、数据链路和启动方式。

## 1. 总体定位

智守银龄采用“静态应用 + 本地硬件桥接”的架构：

- 线上展示层可通过 GitHub Pages 静态部署，覆盖项目首页、系统工作台、模型预测页、实时监测页和硬件接入页。
- 本地硬件层只在有 BS-WF91/NGIMU/WiFi IMU 设备时启动，用 Python 接收传感器数据，并同时转发给 NGIMU GUI 与当前应用。
- AI 交互层位于 `records/ngimu.html`，根据桥接 API 的最新样本生成风险解释、处置建议和证据标签，适合比赛现场演示“传感器数据 -> AI 判断 -> 社区干预”的闭环。

## 2. 模块分层

```text
用户/评委
  ↓
静态展示层
  ├─ index.html                 项目总入口
  ├─ system/                    社区健康管理工作台
  └─ records/
      ├─ index.html             步态预测与下肢骨骼演示
      ├─ realtime.html          实时监测模拟
      └─ ngimu.html             NGIMU/WiFi IMU + AI 实时交互

本地桥接层
  ├─ tools/start-local-lab.ps1   本地联调统一启动器
  ├─ integrations/ngimu-wifi/    BS 数据接收、解析、API、OSC 转发
  └─ integrations/ngimu-gui/     原 NGIMU GUI 运行环境

设备配置层
  └─ integrations/bs-imu-config/ BS-IMU 配置软件路径和调试说明
```

## 3. 比赛默认数据链路

默认不打开 BS-IMU 配置软件。比赛现场推荐双击根目录：

```text
本地一键启动.bat
```

默认链路如下：

```text
BS-WF91 设备
  ↓ UDP 本机IPv4:1399
Python 统一桥接器 integrations/ngimu-wifi/run_ngimu_web_bridge.py
  ├─ UDP 127.0.0.1:8000  -> NGIMU GUI
  └─ HTTP 127.0.0.1:18000/api -> records/ngimu.html
                                      └─ AI 实时交互卡片
```

BS-IMU 配置软件仅在需要修改设备转发目标时使用：

```text
打开BS_IMU配置软件.bat
```

## 4. 端口约定

| 端口 | 协议 | 使用者 | 说明 |
|---|---|---|---|
| `1399` | UDP | Python 桥接器接收端 | BS-WF91 默认发送端口，桥接器直接监听 |
| `8000` | UDP | NGIMU GUI 接收端 | 桥接器向 NGIMU GUI 发送 OSC 数据 |
| `18000` | HTTP | 当前应用硬件 API | `records/ngimu.html` 默认读取的本地 API |
| `8080` | HTTP | 静态网页预览 | 当前应用本地预览端口，若被占用会自动顺延 |

## 5. 启动器职责

`tools/start-local-lab.ps1` 是所有根目录 bat 的统一实现：

- 自动寻找 `python` 或 `py -3`。
- 自动检测本机 IPv4，并允许通过 `-DeviceIP` 覆盖。
- 运行端口诊断，提示 `1399/8000/18000` 占用情况。
- 比赛模式默认启动 NGIMU GUI、Python 桥接器和当前应用页面。
- 默认不启动 BS-IMU 配置软件，避免调试工具干扰演示链路。

常用命令：

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\tools\start-local-lab.ps1 -Mode Full
powershell -NoProfile -ExecutionPolicy Bypass -File .\tools\start-local-lab.ps1 -Mode BridgeOnly
powershell -NoProfile -ExecutionPolicy Bypass -File .\tools\start-local-lab.ps1 -Mode DiagnoseOnly
powershell -NoProfile -ExecutionPolicy Bypass -File .\tools\start-local-lab.ps1 -Mode Full -DeviceIP 172.17.8.101
```

需要把 BS-IMU 配置软件也纳入同一次启动时，可显式加：

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\tools\start-local-lab.ps1 -Mode Full -OpenBsConfig
```

## 6. AI 实时交互层

`records/ngimu.html` 的 AI 卡片不依赖外部云服务，采用可解释规则把实时数据转换为评审能理解的现场判断：

- 输入：`AccMagnitude`、`GyroMagnitude`、`MotionState`、`MotionConfidence`、`ElectricPercentage`、`Rssi`。
- 输出：`低风险`、`需关注`、`高风险` 三类状态。
- 解释：展示加速度、角速度、电量等证据标签。
- 建议：给出继续观察、复核稳定性、检查设备、人工干预等动作建议。

这部分是比赛演示层的 AI 交互表达，定位是“实时风险解释与辅助决策”，不是替代医生诊断。

## 7. NGIMU GUI 连接说明

NGIMU GUI 默认作为 OSC 可视化端：

1. 启动 `本地一键启动.bat`。
2. 在 NGIMU GUI 中使用 UDP 接收端口 `8000`。
3. 保持 Python 桥接器窗口运行。
4. 打开 `records/ngimu.html` 查看 Web/API 与 AI 交互状态。

如果 NGIMU GUI 底部 `Total Received` 一直为 `0`：

- 先看 Python 桥接器窗口是否收到 BS 设备帧。
- 确认 BS-WF91 转发目标是启动器打印的本机 IPv4 和 `1399`。
- 确认 NGIMU GUI 使用 UDP 接收端口 `8000`。
- 确认没有另一个程序抢占 `1399`（如 BS-IMU 配置软件）。

## 8. 参赛演示顺序

推荐答辩演示顺序：

1. 打开首页，说明项目定位与业务闭环。
2. 进入系统端，展示社区人群、风险看板、告警和干预流程。
3. 进入模型预测页，展示步态参数、骨骼可视化和指标解释。
4. 双击 `本地一键启动.bat`，打开 NGIMU GUI、桥接器和硬件接入页。
5. 若有真实设备，展示设备数据进入 AI 实时交互卡片；若无设备，使用 `simulate_device.py` 做模拟。
6. 回到 README 或架构图，说明 GitHub Pages 部署和本地硬件桥接的工程取舍。
