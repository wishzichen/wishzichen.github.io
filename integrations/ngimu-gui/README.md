# NGIMU GUI Runtime

这个目录包含已经编译好的 `NGIMU GUI.exe` 运行文件和必要依赖，用于接收 `integrations/ngimu-wifi` 桥接器转发出来的 NGIMU OSC 消息。

## 使用方式

1. 双击项目根目录的 `启动NGIMU_GUI.bat`，或直接运行本目录的 `NGIMU GUI.exe`。
2. 在 NGIMU GUI 中选择：

```text
Connection -> UDP -> 255.255.255.255:9000, 0.0.0.0:8000, All Adapters
```

3. 启动桥接器，把 BS-WF91 的 `BS55...` 数据帧转为 NGIMU GUI 可识别的 OSC 消息。

推荐桥接命令：

```powershell
cd integrations\ngimu-wifi
python run_ngimu_web_bridge.py --protocol UDP --device-port 1399 --gui-port 8000 --api-port 18000 --open-browser
```

## 端口说明

- `8000`：NGIMU GUI 的 UDP 接收端口。
- `1399`：BS-WF91 默认发送端口，桥接器直接监听。
- `18000`：桥接器提供给当前网页应用的 HTTP API/看板端口。

如果 BS-IMU 配置软件正在运行，它会占用 `1399` 端口。请先关闭 BS-IMU 配置软件，再启动桥接器。
