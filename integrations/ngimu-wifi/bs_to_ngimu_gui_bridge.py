# coding: UTF-8
import argparse
import os
import time

from common import build_receiver, env_int
from ngimu_osc import FORWARDED_ADDRESSES, NgimuOscForwarder


def parse_args(argv=None):
    parser = argparse.ArgumentParser(
        description="Bridge BS wireless sensor frames into OSC messages for NGIMU GUI."
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
        "--device-filter",
        default=os.getenv("DEVICE_FILTER", ""),
        help="Optional 12-character device ID to forward.",
    )
    parser.add_argument(
        "--gui-forward-mode",
        default=os.getenv("NGIMU_GUI_FORWARD_MODE", "first").lower(),
        choices=("first", "all", "off"),
        help="Which devices to forward to the single NGIMU GUI OSC stream. Default: %(default)s",
    )
    parser.add_argument(
        "--quiet",
        action="store_true",
        help="Do not print every forwarded sample.",
    )
    return parser.parse_args(argv)


def main(argv=None):
    args = parse_args(argv)
    forwarder = NgimuOscForwarder(args.gui_host, args.gui_port)
    gui_device_id = None

    def should_forward_to_gui(device_id):
        nonlocal gui_device_id

        if args.gui_forward_mode == "off":
            return False

        if args.gui_forward_mode == "all":
            return True

        if gui_device_id is None:
            gui_device_id = device_id
            print(f"NGIMU GUI follows first device: {gui_device_id}")

        return device_id == gui_device_id

    def forward(device_model):
        if args.device_filter and device_model.deviceName != args.device_filter:
            return

        if should_forward_to_gui(device_model.deviceName):
            forwarder.send_device_model(device_model)
        if args.quiet:
            return

        data = device_model.deviceData
        print(
            "forward {device} -> {host}:{port} time={time_text} "
            "Acc=({acc_x},{acc_y},{acc_z}) Euler=({roll},{pitch},{yaw})".format(
                device=device_model.deviceName,
                host=args.gui_host,
                port=args.gui_port,
                time_text=data.get("Time"),
                acc_x=data.get("AccX"),
                acc_y=data.get("AccY"),
                acc_z=data.get("AccZ"),
                roll=data.get("AngleX"),
                pitch=data.get("AngleY"),
                yaw=data.get("AngleZ"),
            )
        )

    receiver = build_receiver(args.protocol, args.device_port, forward)

    try:
        receiver.start()
    except OSError as exc:
        print(f"Bridge startup failed: {exc}")
        print(
            f"Tip: check the device port with "
            f"`netstat -ano -p {args.protocol.lower()} | findstr :{args.device_port}`."
        )
        forwarder.close()
        return 1

    print(f"BS receiver: {args.protocol} 0.0.0.0:{args.device_port}")
    if args.gui_forward_mode == "off":
        print("Forwarding OSC to NGIMU GUI: disabled")
    else:
        print(f"Forwarding OSC to NGIMU GUI: udp://{args.gui_host}:{args.gui_port} mode={args.gui_forward_mode}")
    print("Forwarded OSC addresses: " + ", ".join(FORWARDED_ADDRESSES))
    print("In NGIMU GUI, open the default UDP connection with Receive Port 8000.")
    print("Press Ctrl+C to stop this bridge.")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nStopping bridge...")
    finally:
        receiver.stop()
        forwarder.close()

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
