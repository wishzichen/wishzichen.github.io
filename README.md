# 智守银龄 · 风险未然

<p align="center">
  <strong>基于风险状态演化建模的社区老年跌倒风险动态预警与干预系统</strong>
</p>

<p align="center">
  <img alt="Competition" src="https://img.shields.io/badge/Competition-China%20Collegiate%20Computing%20Contest-2563eb">
  <img alt="Deploy" src="https://img.shields.io/badge/Deploy-GitHub%20Pages-0ea5e9">
  <img alt="Frontend" src="https://img.shields.io/badge/Frontend-Static%20Web-10b981">
  <img alt="IMU Bridge" src="https://img.shields.io/badge/IMU-NGIMU%20Bridge-8b5cf6">
</p>

<p align="center">
  <a href="#项目简介">项目简介</a> ·
  <a href="#快速体验">快速体验</a> ·
  <a href="#核心功能">核心功能</a> ·
  <a href="#本地运行">本地运行</a> ·
  <a href="#硬件接入">硬件接入</a> ·
  <a href="#项目结构">项目结构</a> ·
  <a href="#参赛信息">参赛信息</a>
</p>

---

## 项目简介

**智守银龄**面向社区老年健康管理场景，围绕“跌倒风险早发现、早预警、早干预”的目标，构建了一个可静态部署、可闭环演示、可本地接入 IMU 传感设备的智能化应用原型。

系统以社区老年人、基层健康管理人员、社区医生、护理人员和家属为主要使用者，通过步态数据采集、风险状态演化建模、可视化解释、告警处置和干预回访，形成完整的业务链路：

```text
监测 -> 评估 -> 预警 -> 干预 -> 回访
```

### 解决的问题

| 场景痛点 | 现状问题 | 项目方案 |
|---|---|---|
| 风险发现滞后 | 传统体检和量表评估多为阶段性记录，难以及时捕捉步态异常 | 通过 IMU 步态监测、指标趋势和风险分层，实现连续化风险观察 |
| 数据链路割裂 | 采集、分析、预警、处置常分散在不同工具中 | 将系统端、模型预测、实时监测和硬件接入统一到一个应用入口 |
| 基层部署受限 | 社区场景通常缺少专业服务器和复杂运维条件 | 主体系统支持 GitHub Pages 静态部署，本地硬件接入通过轻量 Python 桥接完成 |
| 干预闭环不足 | 告警后缺少任务追踪、回访记录和处置状态 | 提供风险看板、用户管理、设备数据、告警处置、干预任务和报表展示 |

### 作品亮点

- **风险状态演化视角**：将跌倒风险从一次性评分扩展为连续状态观察，强调趋势、阶段和干预反馈。
- **可解释步态指标**：围绕步频、步幅、步速、对称性、稳定性、双支撑占比等指标组织模型输出。
- **静态演示与硬件联调并存**：无硬件时可完整演示，有设备时可接入本地 IMU 数据流。
- **业务闭环完整**：覆盖人群管理、风险预警、告警处置、干预任务和回访追踪。
- **工程整合能力**：整合 NGIMU GUI、WiFi IMU 接收、Gait-Tracking 风格轨迹诊断和下肢模型展示。

---

## 快速体验

当前仓库是静态构建产物，可直接部署到 GitHub Pages。若保留根目录 `CNAME`，线上入口通常为：

```text
https://cian.fun/
```

### 页面入口

| 页面 | 说明 | 入口 |
|---|---|---|
| 项目首页 | 项目介绍、模块总览、统一演示入口 | [index.html](./index.html) |
| 系统端 | 管理端/用户端一体化工作台，包含风险评估、用户管理、设备数据、告警处置和报表展示 | [system/](./system/) |
| 步态预测 | 下肢步态序列生成、Rajagopal 骨骼可视化、足底压力和步态指标联动 | [records/](./records/) |
| 实时监测 | 步行/跑步状态控制、实时指标轮询、状态日志与腿部状态显示 | [records/realtime.html](./records/realtime.html) |
| 硬件接入 | 接入本地 NGIMU/WiFi IMU 桥接 API，查看设备列表、实时样本和轨迹趋势 | [records/ngimu.html](./records/ngimu.html) |
| 长者版 | 面向长者与家属的大字、高对比度、简洁交互页面 | [elder/](./elder/) |

### 演示账号

系统端内置演示账号：

```text
用户名：admin
密码：admin123
```

### 页面预览

| 实时监测 | 记录看板 | 系统端 |
|---|---|---|
| ![实时监测预览](./assets/preview-realtime-LjZR5Gif.png) | ![记录模块预览](./assets/preview-records-BXjTKWS3.png) | ![系统端预览](./assets/preview-system-CYafq0HX.png) |

---

## 核心功能

### 1. 社区健康管理工作台

- 管理端支持重点人群、风险等级、告警处置、干预任务和统计报表展示。
- 用户端支持个人健康指标、预警记录、干预建议和跟踪状态查看。
- 内置模拟数据，适合比赛现场、答辩演示和线上静态访问。
- 统一导航贯穿首页、系统端、步态预测、实时监测、硬件接入和长者版页面。

### 2. 步态预测与 3D 可视化

- 支持步行/跑步模式切换，以及速度、时长等参数调节。
- 使用 Rajagopal/OpenSim 下肢骨骼数据进行可视化表达。
- 展示步频、步幅、步速、对称性、稳定性、双支撑占比等关键指标。
- 联动显示左右腿髋/膝/踝角度、足底俯仰、摆动速度、离地高度和足底压力分布。

### 3. 实时监测与控制面板

- 提供开始步行、开始跑步、暂停、重置等实时控制动作。
- 通过 `/api/realtime/*` 抽象状态服务；静态部署时由前端 mock 层接管。
- 显示步数、距离、时长、步频、步幅、速度、对称性、稳定性、心率等指标。
- 记录最近系统事件，便于展示数据轮询、状态变化和控制反馈。

### 4. NGIMU/WiFi 硬件接入

- 支持本机桥接 API：`http://127.0.0.1:18000/api`。
- 显示设备列表、最新设备、历史容量、最近更新时间。
- 展示姿态角、加速度、角速度、轨迹速度、运动状态、轨迹修正状态和运动置信度。
- 使用 Canvas 绘制 TrackX/TrackZ 轨迹投影与 AccMagnitude 加速度趋势。
- 提供规则型 AI 实时交互卡片，将 IMU 数据解释为低风险、需关注、高风险三类现场判断。

---

## 本地运行

### 方式一：一键预览

在 Windows 环境下双击：

```text
启动预览.bat
```

脚本会启动本地静态服务并打开浏览器：

```text
http://127.0.0.1:8080/
```

### 方式二：Python 静态服务

```powershell
python -m http.server 8080
```

然后访问：

```text
http://127.0.0.1:8080/
```

### 方式三：Node.js 静态服务

```powershell
npm install -g serve
serve -p 8080
```

然后访问：

```text
http://127.0.0.1:8080/
```

---

## 硬件接入

项目已将 NGIMU GUI 和轻量 Python 硬件接入层整合到仓库中，适合在比赛现场展示“真实设备数据 -> 本地桥接 -> Web 页面解释”的链路。

### 推荐启动方式

比赛或演示现场优先双击：

```text
本地一键启动.bat
```

英文备用入口：

```text
start-local-lab.bat
```

启动器会自动完成：

- 查找 `python` 或 `py -3`。
- 检测当前电脑可用于 BS-WF91 转发的 IPv4 地址。
- 打印并复制设备侧推荐配置：`UDP`、`Server IP`、`Server Port=1399`。
- 检查 `1399`、`8000`、`18000`、`8080` 等关键端口。
- 启动 NGIMU GUI、本地静态网页和 Python 桥接器。
- 打开当前应用入口，硬件页面为 `records/ngimu.html`。

### 默认数据链路

```text
BS-WF91 / WiFi IMU
  -> UDP 本机IPv4:1399
  -> Python 统一桥接器 integrations/ngimu-wifi/run_ngimu_web_bridge.py
      -> UDP 127.0.0.1:8000       -> NGIMU GUI
      -> HTTP 127.0.0.1:18000/api -> records/ngimu.html
```

> 注意：BS-IMU 配置软件如果正在运行，可能会占用 `1399` 端口。桥接器收不到数据时，请先关闭 BS-IMU 配置软件，再重新启动桥接器。

### 手动启动桥接器

```powershell
cd integrations\ngimu-wifi
python run_ngimu_web_bridge.py --protocol UDP --device-port 1399 --gui-port 8000 --api-port 18000
```

此时：

```text
网页入口：http://127.0.0.1:8080/records/ngimu.html
API 地址：http://127.0.0.1:18000/api
NGIMU GUI 接收端口：8000
设备转发端口：1399
```

### 无硬件模拟

先启动桥接器，再另开一个 PowerShell：

```powershell
cd integrations\ngimu-wifi
python simulate_device.py --protocol UDP --host 127.0.0.1 --port 1399
```

多设备下肢模板演示：

```powershell
python simulate_device.py --protocol UDP --host 127.0.0.1 --port 1399 --template lower-body --device-count 4
```

单 IMU 轨迹诊断演示：

```powershell
python simulate_device.py --protocol UDP --host 127.0.0.1 --port 1399 --template gait-single
```

### 常用硬件 API

| 接口 | 方法 | 说明 |
|---|---|---|
| `/api/health` | GET | 服务状态、设备数量、最新设备、历史容量 |
| `/api/devices` | GET | 设备列表 |
| `/api/latest` | GET | 最新接收的设备快照 |
| `/api/devices/{device_id}` | GET | 指定设备最新快照 |
| `/api/devices/{device_id}/data` | GET | 指定设备最新数据字段 |
| `/api/devices/{device_id}/history?limit=300` | GET | 指定设备历史样本 |
| `/api/devices/{device_id}/history` | DELETE | 清空指定设备历史样本 |

更完整的硬件接入说明见 [integrations/ngimu-wifi/README.md](./integrations/ngimu-wifi/README.md)。

---

## 技术架构

### 技术栈

| 技术 | 用途 |
|---|---|
| HTML / CSS / JavaScript | 静态部署入口、记录模块、实时监测和硬件接入页 |
| React 19 | 首页与系统端构建产物 |
| TypeScript | 系统端源项目的类型基础 |
| Vite 6 | 前端构建工具 |
| Tailwind CSS 4 | 系统端样式体系 |
| Motion | 动画与交互过渡 |
| Three.js | 3D 下肢可视化、骨骼模型渲染 |
| Canvas 2D | 实时曲线、轨迹投影、趋势图 |
| Python 3 | 本地 WiFi IMU/NGIMU 接收、桥接和模拟 |

### 架构链路

```text
静态应用层
  index.html
  system/
  records/
  elder/

本地桥接层
  tools/start-local-lab.ps1
  integrations/ngimu-wifi/
  integrations/ngimu-gui/

设备配置层
  integrations/bs-imu-config/
```

详细架构、端口约定和演示流程见 [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)。

---

## 项目结构

```text
.
├─ index.html                         # 项目首页
├─ system/                            # 系统端静态构建产物
├─ records/                           # 步态预测、实时监测、硬件接入模块
│  ├─ index.html                      # 步态预测页
│  ├─ realtime.html                   # 实时监测页
│  ├─ ngimu.html                      # NGIMU/WiFi 硬件接入页
│  └─ static/                         # 记录模块样式、脚本和数据
├─ elder/                             # 长者版网页端模块
├─ integrations/
│  ├─ bs-imu-config/                  # BS-IMU 配置软件路径与说明
│  ├─ ngimu-gui/                      # 已整合的 NGIMU GUI 运行文件
│  └─ ngimu-wifi/                     # Python 硬件接入、桥接、模拟与看板
├─ docs/
│  └─ ARCHITECTURE.md                 # 系统架构和演示链路
├─ tools/
│  └─ start-local-lab.ps1             # 本地联调统一启动器
├─ shared/
│  └─ site-shell.js                   # 全局浮动导航
├─ assets/                            # 首页构建产物与预览图
├─ .github/workflows/deploy.yml       # GitHub Pages 自动部署
├─ 启动预览.bat
├─ 本地一键启动.bat
├─ start-local-lab.bat
├─ 启动NGIMU_GUI.bat
├─ 启动硬件桥接.bat
└─ 打开BS_IMU配置软件.bat
```

---

## 部署说明

仓库已包含 GitHub Pages 工作流：[.github/workflows/deploy.yml](./.github/workflows/deploy.yml)。

推荐设置：

1. 打开 GitHub 仓库 `Settings -> Pages`。
2. Source 选择 `GitHub Actions`。
3. 推送代码到 `main` 或 `master` 分支。
4. 等待 Actions 中 `Deploy to GitHub Pages` 完成。
5. 如需自定义域名，保留根目录 `CNAME` 并在 DNS 侧完成解析。

---

## 验证方式

### 静态页面检查

```powershell
python -m http.server 8080
```

建议检查：

- 首页、系统端、步态预测页、实时监测页、硬件接入页、长者版是否都能打开。
- 浮动导航是否能在各页面之间跳转。
- `records/` 是否能生成步态序列并显示 3D 场景。
- `records/realtime.html` 是否能显示静态 mock 的实时状态。
- `records/ngimu.html` 在未启动本地 API 时是否显示离线状态。

### 硬件接入检查

```powershell
cd integrations\ngimu-wifi
python diagnose_bridge.py --device-port 1399 --gui-port 8000 --api-port 18000
```

无设备时可用模拟器验证：

```powershell
python run_ngimu_web_bridge.py --protocol UDP --device-port 1399 --gui-port 8000 --api-port 18000
python simulate_device.py --protocol UDP --host 127.0.0.1 --port 1399 --template lower-body --device-count 4
```

预期结果：

- `/api/health` 返回服务状态正常。
- 设备列表出现模拟设备。
- 姿态、加速度、电量、RSSI、轨迹趋势持续刷新。
- 轨迹投影和加速度趋势 Canvas 不为空。

---

## 参赛信息

| 项目 | 内容 |
|---|---|
| 作品名称 | 智守银龄 · 风险未然 |
| 完整题名 | 基于风险状态演化建模的社区老年跌倒风险动态预警与干预系统 |
| 参赛赛事 | 中国大学生计算机设计大赛 |
| 所属单位 | 天津中医药大学 · 公共卫生与健康科学学院 |
| 应用场景 | 社区老年健康管理、跌倒风险评估、步态监测、预警干预 |
| 部署形态 | GitHub Pages 静态演示 + 本地 Python 硬件桥接 |

### 推荐演示顺序

1. 从首页介绍项目背景、痛点和总体架构。
2. 进入系统端展示管理端/用户端工作流。
3. 进入步态预测页展示下肢步态生成、骨骼可视化和指标联动。
4. 进入实时监测页展示状态控制、实时指标和日志反馈。
5. 现场允许时启动 `本地一键启动.bat`，进入硬件接入页展示设备数据流。
6. 回到 README 或架构文档说明部署方式、技术链路和团队分工。

---

## 项目团队

### 项目负责人

**陈奕睿**

- 学院：公共卫生与健康科学学院
- 专业：2024 级应用统计学
- 职责：项目统筹、数据建模、系统整合

### 指导教师

| 姓名 | 职称 | 职责 |
|---|---|---|
| 王梦阳 | 讲师 | 研究框架设计、老年健康风险评估方法指导 |
| 赵铁牛 | 教授 | 交叉学科方向把关、项目组织协调 |

### 团队成员

| 姓名 | 学院 | 职责 |
|---|---|---|
| 桂宏馨 | 公共卫生与健康科学学院 | 数据处理 |
| 严梓艺 | 管理学院 | 调研设计 |
| 田中好 | 公共卫生与健康科学学院 | 数据分析 |
| 刘明远 | 公共卫生与健康科学学院 | 实验辅助 |
| 张子怡 | 公共卫生与健康科学学院 | 文献整理 |
| 李泓宇 | 公共卫生与健康科学学院 | 模型实验 |
| 刘子欢 | 公共卫生与健康科学学院 | 实验记录 |
| 宋宣慧 | 公共卫生与健康科学学院 | 数据收集 |
| 武紫涵 | 公共卫生与健康科学学院 | 案例整理 |
| 李敖巍 | 公共卫生与健康科学学院 | 系统测试 |
| 马凯 | 文化与健康传播学院 | 成果传播 |

---

## 许可与声明

- 本项目用于课程学习、科研训练、创新实践与中国大学生计算机设计大赛作品展示。
- 未经授权不得将本项目用于商业用途。
- 健康风险结果仅作为辅助评估与演示说明，不能替代专业医疗诊断。
- `integrations/ngimu-wifi` 来源于本地 NGIMU/WiFi 设备接入工程的轻量整合；Gait-Tracking、IMU-Mocap、NGIMU GUI 等外部项目的完整版权与许可归原作者所有。

---

<p align="center">
  <strong>智守银龄 · 风险未然</strong><br>
  <sub>守护银龄健康，预防跌倒风险</sub>
</p>
