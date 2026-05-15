# BS-IMU 配置软件接入说明

BS-IMU 配置软件用于连接和配置 BS-WF91 / BS55 系列 WiFi IMU 传感器。当前本地软件路径为：

```text
E:\TJUTCM\Activities\中国大学生计算机设计大赛\bs-imu-260402\bs-imu-260402\bs-imu.exe
```

项目根目录提供了启动入口：

```text
打开BS_IMU配置软件.bat
```

## 为什么不直接提交 bs-imu.exe

`bs-imu.exe` 单文件约 186MB，完整 Electron 应用体积更大，不适合直接放入 GitHub 普通仓库，也容易超过单文件限制。当前仓库保留启动入口、配置流程和协议说明，比赛现场仍可从本机路径启动配置软件。

## 和桥接器的关系

截图中 BS 软件已经连上设备，说明设备和电脑之间的 WiFi 通道是通的。桥接器没有成功时，最常见原因是端口冲突：

- BS-WF91 设备默认通过 UDP `1399` 端口发送数据。
- Python 桥接器默认监听 `1399` 端口。
- 如果 BS-IMU 配置软件正在运行，它会占用 `1399` 端口，导致桥接器无法接收数据。
- 请先关闭 BS-IMU 配置软件，再启动桥接器。

推荐链路：

```text
BS-WF91 设备
  -> UDP 本机IPv4:1399
  -> integrations/ngimu-wifi/run_ngimu_web_bridge.py
  -> UDP 127.0.0.1:8000
  -> integrations/ngimu-gui/NGIMU GUI.exe
```

## BS 软件中需要设置的内容

1. 打开 `打开BS_IMU配置软件.bat`。
2. 选择 `BS-WF91` 设备，确认设备在线。
3. 进入 `编辑` 或设备配置页。
4. 数据转发设置为：

```text
协议：UDP
服务器 IP：本机 IPv4，例如 172.17.8.101
服务器端口：1399
```

5. 保存配置。
6. 启动 `启动硬件桥接.bat`。
7. 在 NGIMU GUI 中打开 UDP 接收端口 `8000`。

## 已确认的数据帧格式

BS 软件内置的 `wt901wifi-resolver` 扩展解析的是 `BS55` 开头的 54 字节帧：

```text
0-11   设备 ID，例如 BS5500000103
12-19  时间
20-25  加速度 X/Y/Z
26-31  角速度 X/Y/Z
32-37  磁场 X/Y/Z
38-43  欧拉角 X/Y/Z
44-45  温度
46-47  电量/电压
48-49  RSSI
50-51  版本号
52-53  0D 0A
```

`integrations/ngimu-wifi/device_model.py` 已按同样格式解析，并在此基础上补充四元数、旋转矩阵、线性加速度、地球坐标加速度和 TrackX/TrackY/TrackZ 轨迹诊断字段。

## 快速诊断

```powershell
cd integrations\ngimu-wifi
python diagnose_bridge.py --device-port 1399 --gui-port 8000 --api-port 18000
```

如果看到 `1399` 被 `bs-imu.exe` 占用，请先关闭 BS 软件，再启动桥接器。
