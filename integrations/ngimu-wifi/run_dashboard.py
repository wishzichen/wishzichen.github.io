# coding: UTF-8
import argparse
import os
import time
import webbrowser

from common import build_receiver, env_int
from device_api import DeviceApiServer, DeviceDataStore


DEFAULT_DEVICE_PORT = 1399
DEFAULT_API_PORT = 18000
DEFAULT_HISTORY_LIMIT = 60000
SUPPORTED_PROTOCOLS = {"UDP", "TCP"}


def parse_args(argv=None):
    parser = argparse.ArgumentParser(
        description="Receive wireless sensor data and expose a local dashboard/API."
    )
    parser.add_argument(
        "--protocol",
        default=os.getenv("DEVICE_PROTOCOL", "UDP").upper(),
        help="Device forwarding protocol: UDP or TCP. Default: %(default)s",
    )
    parser.add_argument(
        "--device-port",
        type=int,
        default=env_int("DEVICE_PORT", DEFAULT_DEVICE_PORT),
        help="Port used by the device to send data. Default: %(default)s",
    )
    parser.add_argument(
        "--api-host",
        default=os.getenv("API_HOST", "0.0.0.0"),
        help="Dashboard/API bind address. Default: %(default)s",
    )
    parser.add_argument(
        "--api-port",
        type=int,
        default=env_int("API_PORT", DEFAULT_API_PORT),
        help="Dashboard/API port. Default: %(default)s",
    )
    parser.add_argument(
        "--history-limit",
        type=int,
        default=env_int("HISTORY_LIMIT", DEFAULT_HISTORY_LIMIT),
        help="Maximum stored samples per device. Default: %(default)s",
    )
    parser.add_argument(
        "--static-root",
        default=os.getenv("STATIC_ROOT"),
        help="Optional dashboard static file directory.",
    )
    parser.add_argument(
        "--open-browser",
        action="store_true",
        help="Open the dashboard in the default browser after startup.",
    )
    parser.add_argument(
        "--quiet",
        action="store_true",
        help="Do not print every received sensor sample.",
    )
    return parser.parse_args(argv)


def make_update_callback(data_store, quiet=False):
    def update_data(device_model):
        snapshot = data_store.update(device_model)
        if quiet:
            return

        data = snapshot["data"]
        print(
            "update {device_id} time={time} Acc=({acc_x},{acc_y},{acc_z}) "
            "Angle=({angle_x},{angle_y},{angle_z})".format(
                device_id=snapshot["device_id"],
                time=data.get("Time"),
                acc_x=data.get("AccX"),
                acc_y=data.get("AccY"),
                acc_z=data.get("AccZ"),
                angle_x=data.get("AngleX"),
                angle_y=data.get("AngleY"),
                angle_z=data.get("AngleZ"),
            )
        )

    return update_data


def main(argv=None):
    args = parse_args(argv)
    protocol = args.protocol.upper()
    if protocol not in SUPPORTED_PROTOCOLS:
        raise SystemExit(f"Unsupported protocol {protocol!r}; use UDP or TCP.")
    if args.history_limit <= 0:
        raise SystemExit("--history-limit must be greater than 0.")

    data_store = DeviceDataStore(history_limit=args.history_limit)
    receiver = build_receiver(
        protocol,
        args.device_port,
        make_update_callback(data_store, quiet=args.quiet),
    )
    api = DeviceApiServer(
        data_store,
        host=args.api_host,
        port=args.api_port,
        static_root=args.static_root,
    )

    try:
        receiver.start()
        api.start()
    except OSError as exc:
        receiver.stop()
        api.stop()
        print(f"Startup failed: {exc}")
        print(
            "Tip: check who is using the device/API ports with "
            f"`netstat -ano -p {protocol.lower()} | findstr :{args.device_port}`, "
            f"`netstat -ano -p tcp | findstr :{args.api_port}`, "
            "then close that program or choose another port."
        )
        return 1

    print(f"Receiver: {protocol} 0.0.0.0:{args.device_port}")
    print(f"Dashboard: {api.local_url}/")
    print(f"Health API: {api.local_url}/api/health")
    print(f"Latest data API: {api.local_url}/api/latest")
    print(f"Device list API: {api.local_url}/api/devices")
    print("Press Ctrl+C to stop.")

    if args.open_browser:
        webbrowser.open(f"{api.local_url}/")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nStopping...")
    finally:
        receiver.stop()
        api.stop()

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
