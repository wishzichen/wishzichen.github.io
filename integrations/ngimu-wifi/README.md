# WIFI Python SDK 使用说明

这部分是给当前 WiFi 传感设备用的轻量 Python 接收端，也包含一个把 BS 数据同时转发到原 C# NGIMU GUI 和 Web 看板的桥接器。

## 接入 NGIMU GUI

在项目根目录双击：

```text
RUN_NGIMU_GUI_WITH_DEVICE.bat
```

或者手动启动 GUI + Web 统一桥接器：

```powershell
cd integrations\ngimu-wifi
python run_ngimu_web_bridge.py --protocol UDP --device-port 1399 --gui-port 8000 --api-port 18000 --open-browser
```

然后在 NGIMU GUI 里连接默认 UDP：接收端口 `8000`。Web 看板地址是 `http://127.0.0.1:18000/`。设备侧发送到电脑 IPv4，协议 `UDP`，端口 `1399`。

桥接器会补充发送 `/magnitudes`、`/quaternion`、`/matrix`、`/linear`、`/earth`、`/altitude` 等 NGIMU GUI 需要的数据。由于当前 54 字节设备帧没有 GPS 经纬度，Web 端默认不生成真实地图轨迹；“3D 坐标轨迹”使用参考 Gait-Tracking 的 `imufusion` AHRS、移动段检测和 ZUPT 速度漂移修正，适合观察单 IMU 步态三维轨迹、漂移和空间变化，但不是真实地理定位。

启动桥接器后命令行会打印 `Forwarded OSC addresses`。如果 NGIMU GUI 的 Terminal 里没有 `/linear`、`/earth`、`/altitude`，请先关掉旧桥接窗口，再重新运行根目录的 `RUN_NGIMU_GUI_WITH_DEVICE.bat`。

Web 看板已包含 3D 姿态、三维空间诊断、定位轨迹和下肢模板。3D 姿态会加载项目自带的 NGIMU 真实外壳 OBJ 模型；定位轨迹只在收到 `Latitude`/`Longitude` 时显示 GPS 轨迹。没有 GPS 时页面会明确提示无定位数据，`PositionX/Y/Z` 只在手动切换到“运动诊断”时显示，不能当作真实地图定位。

单 IMU 的 3D 轨迹字段是 `TrackX`、`TrackY`、`TrackZ`。运动中会先显示 preliminary 轨迹；当检测到脚步/设备重新静止时，会像 Gait-Tracking 示例那样回填修正这一整段历史点，页面中的 3D 点线会自动变成 corrected 轨迹。

两台或多台设备同时发送时，Web 看板会显示设备对比卡、“三维空间诊断”和“下肢模板”。下肢模板借鉴 IMU-Mocap 的 lower-body link/joint 思路，把 2/4/7 台 IMU 映射到足部、小腿/足部或完整下肢骨架；没有足够设备时会用模板动作补全缺失段。

原 NGIMU GUI 不带设备 ID 维度，不能在一个 GUI 窗口里可靠区分两台设备。`run_ngimu_web_bridge.py` 默认 `--gui-forward-mode first`，只把第一台收到的设备转发给 GUI，Web 端仍显示全部设备。需要指定 GUI 跟随某台设备时可加：

```powershell
python run_ngimu_web_bridge.py --gui-device-filter BSDEMO000001 --open-browser
```

## 快速打开

1. 进入目录：

```powershell
cd integrations\ngimu-wifi
```

2. 单独启动看板：

```powershell
python run_dashboard.py --protocol UDP --device-port 1399 --api-port 8000 --open-browser
```

也可以直接双击 `run_dashboard.bat`。

如果要和 NGIMU GUI 同时开，请用 `run_ngimu_web_bridge.py` 或根目录 `RUN_NGIMU_GUI_WITH_DEVICE.bat`，不要同时再开 `run_dashboard.py`，避免两个进程争用设备端口 `1399`。

3. 浏览器打开：

```text
http://127.0.0.1:8000/
```

## 设备侧需要配置

把设备的数据转发目标设置为当前电脑的 IPv4 地址，协议和端口要和程序一致：

- 默认协议：`UDP`
- 默认设备转发端口：`1399`
- 默认网页/API 端口：`8000`

查看电脑 IPv4：

```powershell
ipconfig
```

如果设备必须用 TCP：

```powershell
python run_dashboard.py --protocol TCP --device-port 1399 --api-port 8000 --open-browser
```

## 没有设备时测试页面

先开接收端：

```powershell
python run_dashboard.py --open-browser
```

另开一个 PowerShell，发送模拟数据：

```powershell
python simulate_device.py --protocol UDP --host 127.0.0.1 --port 1399
```

页面应能看到设备 `BSDEMO000001` 和实时曲线。

测试单 IMU Gait-Tracking 风格的 3D 坐标轨迹：

```powershell
python simulate_device.py --protocol UDP --host 127.0.0.1 --port 1399 --template gait-single
```

测试多设备下肢模板：

```powershell
python simulate_device.py --protocol UDP --host 127.0.0.1 --port 1399 --template lower-body --device-count 4
```

`--device-count` 可设为 `2`、`4` 或 `7`，用于预览两只足部、小腿+足部或完整下肢模板。

也可以直接跑自动验证脚本。它会把 `C:\Program Files\Google\Chrome\Application` 加到用户 PATH，启动 Web 看板和 7 台模拟 IMU，并用系统 Chrome 截桌面/手机两张图检查 3D 视图是否正常渲染：

```powershell
powershell -ExecutionPolicy Bypass -File verify_dashboard_chrome.ps1
```

## 常用 API

```text
GET http://127.0.0.1:8000/api/health
GET http://127.0.0.1:8000/api/devices
GET http://127.0.0.1:8000/api/latest
GET http://127.0.0.1:8000/api/devices/{device_id}/history?limit=300
DELETE http://127.0.0.1:8000/api/devices/{device_id}/history
```

统一桥接器默认 Web/API 端口是 `18000`，接口路径相同。

## 端口被占用

检查占用：

```powershell
netstat -ano -p udp | findstr :1399
netstat -ano -p tcp | findstr :8000
```

换端口启动：

```powershell
python run_dashboard.py --device-port 1400 --api-port 8010 --open-browser
```

这时设备侧也要把转发端口改成 `1400`。
