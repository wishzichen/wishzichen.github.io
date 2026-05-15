# coding: UTF-8
import argparse
import os
import time
import webbrowser

from common import build_receiver, env_int
from device_api import DeviceApiServer, DeviceDataStore
from ngimu_osc import FORWARDED_ADDRESSES, NgimuOscForwarder


def parse_args(argv=None):
    parser = argparse.ArgumentParser(
        description="Receive BS sensor frames, expose the web dashboard, and forward NGIMU OSC."
    )
    parser.add_argument(
        "--protocol",
        default=os.getenv("DEVICE_PROTOCOL", "UDP").upper(),
        choices=("UDP", "TCP"),
        help="Protocol used by the device. Default: %(default)s",
    )
    parser.add_argument(
        "--device-port",
        type=int,
        default=env_int("DEVICE_PORT", 1399),
        help="Port receiving raw BS device frames. Default: %(default)s",
    )
    parser.add_argument(
        "--gui-host",
        default=os.getenv("NGIMU_GUI_HOST", "127.0.0.1"),
        help="Host running NGIMU GUI. Default: %(default)s",
    )
    parser.add_argument(
        "--gui-port",
        type=int,
        default=env_int("NGIMU_GUI_PORT", 8000),
        help="NGIMU GUI UDP receive port. Default: %(default)s",
    )
    parser.add_argument(
        "--gui-forward-mode",
        default=os.getenv("NGIMU_GUI_FORWARD_MODE", "first").lower(),
        choices=("first", "all", "off"),
        help=(
            "Which devices to forward to the single NGIMU GUI OSC stream. "
            "Use first to avoid mixing multiple devices in one GUI. Default: %(default)s"
        ),
    )
    parser.add_argument(
        "--gui-device-filter",
        default=os.getenv("NGIMU_GUI_DEVICE_FILTER", ""),
        help="Optional 12-character device ID to forward to NGIMU GUI while Web still shows all devices.",
    )
    parser.add_argument(
        "--api-host",
        default=os.getenv("API_HOST", "0.0.0.0"),
        help="Dashboard/API bind address. Default: %(default)s",
    )
    parser.add_argument(
        "--api-port",
        type=int,
        default=env_int("API_PORT", 18000),
        help="Dashboard/API HTTP port. Default: %(default)s",
    )
    parser.add_argument(
        "--history-limit",
        type=int,
        default=env_int("HISTORY_LIMIT", 900),
        help="History points kept per device. Default: %(default)s",
    )
    parser.add_argument(
        "--device-filter",
        default=os.getenv("DEVICE_FILTER", ""),
        help="Optional 12-character device ID to forward and publish.",
    )
    parser.add_argument(
        "--open-browser",
        action="store_true",
        help="Open the web dashboard in the default browser.",
    )
    parser.add_argument(
        "--quiet",
        action="store_true",
        help="Do not print every forwarded sample.",
    )
    return parser.parse_args(argv)


def main(argv=None):
    args = parse_args(argv)
    store = DeviceDataStore(history_limit=args.history_limit)
    server = DeviceApiServer(store, host=args.api_host, port=args.api_port)
    forwarder = NgimuOscForwarder(args.gui_host, args.gui_port)
    gui_device_id = None
    frame_count = 0
    no_data_warning_printed = False

    def should_forward_to_gui(device_id):
        nonlocal gui_device_id

        if args.gui_forward_mode == "off":
            return False

        if args.gui_device_filter:
            return device_id == args.gui_device_filter

        if args.gui_forward_mode == "all":
            return True

        if gui_device_id is None:
            gui_device_id = device_id
            print(f"NGIMU GUI follows first device: {gui_device_id}")

        return device_id == gui_device_id

    def handle_frame(device_model):
        nonlocal frame_count
        if args.device_filter and device_model.deviceName != args.device_filter:
            return

        frame_count += 1
        snapshot = store.update(device_model)
        if should_forward_to_gui(device_model.deviceName):
            forwarder.send_device_model(device_model)

        if args.quiet:
            return

        data = snapshot["data"]
        print(
            "device={device} from={address} Acc=({acc_x},{acc_y},{acc_z}) "
            "Euler=({roll},{pitch},{yaw}) Linear=({lin_x},{lin_y},{lin_z})".format(
                device=snapshot["device_id"],
                address=snapshot.get("address") or "--",
                acc_x=data.get("AccX"),
                acc_y=data.get("AccY"),
                acc_z=data.get("AccZ"),
                roll=data.get("AngleX"),
                pitch=data.get("AngleY"),
                yaw=data.get("AngleZ"),
                lin_x=data.get("LinearAccX"),
                lin_y=data.get("LinearAccY"),
                lin_z=data.get("LinearAccZ"),
            )
        )

    receiver = build_receiver(args.protocol, args.device_port, handle_frame)

    try:
        receiver.start()
        server.start()
    except OSError as exc:
        print(f"Startup failed: {exc}")
        print(
            f"Tip: check the device port with "
            f"`netstat -ano -p {args.protocol.lower()} | findstr :{args.device_port}`."
        )
        forwarder.close()
        server.stop()
        return 1

    if args.open_browser:
        webbrowser.open(server.local_url)

    print(f"BS receiver: {args.protocol} 0.0.0.0:{args.device_port}")
    if args.gui_forward_mode == "off":
        print("Forwarding OSC to NGIMU GUI: disabled")
    elif args.gui_device_filter:
        print(f"Forwarding OSC to NGIMU GUI: udp://{args.gui_host}:{args.gui_port} for {args.gui_device_filter}")
    else:
        print(f"Forwarding OSC to NGIMU GUI: udp://{args.gui_host}:{args.gui_port} mode={args.gui_forward_mode}")
    print("Forwarded OSC addresses: " + ", ".join(FORWARDED_ADDRESSES))
    print(f"Web dashboard: {server.local_url}")
    print("Web monitors every received device. The original NGIMU GUI should receive one device unless --gui-forward-mode all is used.")
    print("In NGIMU GUI, open the default UDP connection with Receive Port 8000.")
    print(
        f"If BS-IMU is open, configure BS-WF91 data forwarding to UDP <this PC IPv4>:{args.device_port}. "
        "Do not let BS-IMU and this bridge listen on the same device port."
    )
    print("Press Ctrl+C to stop this bridge.")

    try:
        started_at = time.time()
        while True:
            time.sleep(1)
            if (
                not no_data_warning_printed
                and frame_count == 0
                and time.time() - started_at >= 8
            ):
                no_data_warning_printed = True
                print(
                    f"No BS55 frames received on {args.protocol} port {args.device_port} yet. "
                    "Check BS-IMU forwarding IP/port, Windows firewall, and whether another program owns the port. "
                    "Run `python diagnose_bridge.py` for a quick check."
                )
    except KeyboardInterrupt:
        print("\nStopping...")
    finally:
        receiver.stop()
        server.stop()
        forwarder.close()

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
