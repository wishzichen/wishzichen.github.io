# coding: UTF-8
import argparse
import math
import socket
import struct
import time
from datetime import datetime


FRAME_LEN = 54
DEVICE_ID_LEN = 12

ROLE_PROFILES = {
    "single": {"acc_x": 0.9, "acc_y": 0.7, "acc_z": 0.15, "gyro": 80, "roll": 35, "pitch": 25, "yaw": 42},
    "gait_single": {"acc_x": 1.2, "acc_y": 0.2, "acc_z": 0.58, "gyro": 120, "roll": 12, "pitch": 38, "yaw": 12},
    "pelvis": {"acc_x": 0.28, "acc_y": 0.18, "acc_z": 0.08, "gyro": 24, "roll": 6, "pitch": 8, "yaw": 10},
    "left_thigh": {"acc_x": 0.48, "acc_y": 0.22, "acc_z": 0.12, "gyro": 64, "roll": 12, "pitch": 28, "yaw": 14},
    "left_shank": {"acc_x": 0.62, "acc_y": 0.28, "acc_z": 0.18, "gyro": 92, "roll": 16, "pitch": 46, "yaw": 18},
    "left_foot": {"acc_x": 0.76, "acc_y": 0.32, "acc_z": 0.26, "gyro": 118, "roll": 10, "pitch": 34, "yaw": 16},
    "right_thigh": {"acc_x": 0.48, "acc_y": 0.22, "acc_z": 0.12, "gyro": 64, "roll": 12, "pitch": 28, "yaw": 14},
    "right_shank": {"acc_x": 0.62, "acc_y": 0.28, "acc_z": 0.18, "gyro": 92, "roll": 16, "pitch": 46, "yaw": 18},
    "right_foot": {"acc_x": 0.76, "acc_y": 0.32, "acc_z": 0.26, "gyro": 118, "roll": 10, "pitch": 34, "yaw": 16},
}

LOWER_BODY_FULL = [
    ("pelvis", 0.0),
    ("left_thigh", 0.12),
    ("left_shank", 0.34),
    ("left_foot", 0.56),
    ("right_thigh", math.pi + 0.12),
    ("right_shank", math.pi + 0.34),
    ("right_foot", math.pi + 0.56),
]

LOWER_BODY_4IMU = [
    ("left_shank", 0.34),
    ("left_foot", 0.56),
    ("right_shank", math.pi + 0.34),
    ("right_foot", math.pi + 0.56),
]

LOWER_BODY_2IMU = [
    ("left_foot", 0.56),
    ("right_foot", math.pi + 0.56),
]


def clamp_int16(value):
    return max(-32768, min(32767, int(round(value))))


def write_i16(frame, offset, value):
    struct.pack_into("<h", frame, offset, clamp_int16(value))


def make_frame(device_id, index, role="single", phase=0.0):
    now = datetime.now()
    t = index / 12.0
    profile = ROLE_PROFILES.get(role, ROLE_PROFILES["single"])
    side = -1 if role.startswith("right") else 1
    stride = math.sin(t * 2.2 + phase)
    lift = max(0.0, math.sin(t * 2.2 + phase)) ** 3
    heel_strike = max(0.0, math.sin(t * 4.4 + phase)) ** 6
    frame = bytearray(FRAME_LEN)
    frame[:DEVICE_ID_LEN] = device_id.encode("ascii")

    frame[12] = now.year % 100
    frame[13] = now.month
    frame[14] = now.day
    frame[15] = now.hour
    frame[16] = now.minute
    frame[17] = now.second
    millis = now.microsecond // 1000
    frame[18] = millis & 0xFF
    frame[19] = (millis >> 8) & 0xFF

    if role == "gait_single":
        cycle = (t * 0.78 + phase / math.tau) % 1.0
        stance = cycle < 0.58
        swing_ratio = 0.0 if stance else (cycle - 0.58) / 0.42
        swing = math.sin(math.pi * swing_ratio)
        heel = max(0.0, math.sin(math.pi * swing_ratio + math.pi * 0.82)) ** 8
        acc = (
            math.sin(t * 0.7) * 0.035 if stance else swing * profile["acc_x"] + heel * 0.38,
            math.cos(t * 0.9) * 0.035 if stance else math.sin(swing_ratio * math.tau) * profile["acc_y"],
            1.0 + (math.sin(t) * 0.018 if stance else swing * profile["acc_z"] + heel * 0.32),
        )
        gyro = (
            math.sin(t) * 4 if stance else math.sin(swing_ratio * math.pi) * profile["gyro"] * 0.45,
            math.cos(t * 0.8) * 5 if stance else math.cos(swing_ratio * math.tau) * profile["gyro"],
            math.sin(t * 0.5) * 3 if stance else math.sin(swing_ratio * math.pi) * profile["gyro"] * 0.24,
        )
    else:
        acc = (
            stride * profile["acc_x"],
            side * math.cos(t * 1.4 + phase) * profile["acc_y"],
            1.0 + lift * profile["acc_z"] + heel_strike * 0.22 - 0.04,
        )
        gyro = (
            side * math.sin(t * 2.4 + phase) * profile["gyro"] * 0.58,
            math.cos(t * 2.1 + phase) * profile["gyro"],
            side * math.sin(t * 1.2 + phase) * profile["gyro"] * 0.38,
        )
    mag = (
        35 + math.sin(t * 0.5 + phase) * 8,
        15 + math.cos(t * 0.4 + phase) * 6,
        -20 + math.sin(t * 0.3 + phase) * 5,
    )
    if role == "gait_single":
        cycle = (t * 0.78 + phase / math.tau) % 1.0
        stance = cycle < 0.58
        swing_ratio = 0.0 if stance else (cycle - 0.58) / 0.42
        swing = math.sin(math.pi * swing_ratio)
        angle = (
            math.sin(t * 0.7) * 3 if stance else swing * profile["roll"],
            math.sin(swing_ratio * math.pi) * profile["pitch"] if not stance else math.sin(t * 0.4) * 2,
            math.sin(t * 0.24) * profile["yaw"],
        )
    else:
        angle = (
            side * stride * profile["roll"],
            math.cos(t * 2.0 + phase) * profile["pitch"],
            math.sin(t * 0.55 + phase) * profile["yaw"],
        )

    for axis, value in enumerate(acc):
        write_i16(frame, 20 + axis * 2, value / 16 * 32768)
    for axis, value in enumerate(gyro):
        write_i16(frame, 26 + axis * 2, value / 2000 * 32768)
    for axis, value in enumerate(mag):
        write_i16(frame, 32 + axis * 2, value * 1024 / 100)
    for axis, value in enumerate(angle):
        write_i16(frame, 38 + axis * 2, value / 180 * 32768)

    write_i16(frame, 44, 2600 + math.sin(t * 0.2) * 80)
    write_i16(frame, 46, 390)
    write_i16(frame, 48, -45 + math.sin(t * 0.2) * 5)
    write_i16(frame, 50, 1)
    frame[52] = 0x0D
    frame[53] = 0x0A
    return bytes(frame)


def parse_args(argv=None):
    parser = argparse.ArgumentParser(description="Send fake wireless sensor frames for testing.")
    parser.add_argument("--host", default="127.0.0.1", help="Receiver host. Default: %(default)s")
    parser.add_argument("--port", type=int, default=1399, help="Receiver port. Default: %(default)s")
    parser.add_argument(
        "--protocol",
        default="UDP",
        choices=("UDP", "TCP"),
        help="Receiver protocol. Default: %(default)s",
    )
    parser.add_argument(
        "--device-id",
        default="BS5500000001",
        help="Exactly 12 ASCII characters and usually starting with BS55. Default: %(default)s",
    )
    parser.add_argument(
        "--template",
        default="single",
        choices=("single", "gait-single", "lower-body"),
        help="Simulation template. Default: %(default)s",
    )
    parser.add_argument(
        "--device-count",
        type=int,
        default=1,
        help="Number of simulated devices. lower-body supports 2, 4, or 7 best. Default: %(default)s",
    )
    parser.add_argument(
        "--count",
        type=int,
        default=200,
        help="Frame batches to send. Use 0 for continuous sending. Default: %(default)s",
    )
    parser.add_argument(
        "--delay",
        type=float,
        default=0.05,
        help="Seconds between frames. Default: %(default)s",
    )
    return parser.parse_args(argv)


def validate_device_id(device_id):
    try:
        device_id.encode("ascii")
    except UnicodeEncodeError as exc:
        raise SystemExit("--device-id must contain only ASCII characters.") from exc
    if len(device_id) != DEVICE_ID_LEN:
        raise SystemExit(f"--device-id must be exactly {DEVICE_ID_LEN} characters.")


def build_frame_specs(args):
    if args.template == "single":
        device_count = max(1, args.device_count)
        if device_count == 1:
            return [{"device_id": args.device_id, "role": "single", "phase": 0.0}]
        return [
            {
                "device_id": f"BS55{index + 1:08d}",
                "role": "single",
                "phase": index * math.tau / device_count,
            }
            for index in range(device_count)
        ]

    if args.template == "gait-single":
        return [{"device_id": args.device_id, "role": "gait_single", "phase": 0.0}]

    device_count = max(2, min(7, args.device_count))
    if device_count <= 2:
        role_phase_pairs = LOWER_BODY_2IMU
    elif device_count <= 4:
        role_phase_pairs = LOWER_BODY_4IMU
    else:
        role_phase_pairs = LOWER_BODY_FULL

    return [
        {
            "device_id": f"BS55LEG{index + 1:05d}",
            "role": role,
            "phase": phase,
        }
        for index, (role, phase) in enumerate(role_phase_pairs[:device_count])
    ]


def describe_specs(specs):
    return ", ".join(f"{item['device_id']}:{item['role']}" for item in specs)


def send_udp(args):
    specs = build_frame_specs(args)
    with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as sock:
        index = 0
        while args.count == 0 or index < args.count:
            for spec in specs:
                sock.sendto(
                    make_frame(spec["device_id"], index, spec["role"], spec["phase"]),
                    (args.host, args.port),
                )
            index += 1
            time.sleep(args.delay)


def send_tcp(args):
    specs = build_frame_specs(args)
    with socket.create_connection((args.host, args.port), timeout=5) as sock:
        index = 0
        while args.count == 0 or index < args.count:
            for spec in specs:
                sock.sendall(make_frame(spec["device_id"], index, spec["role"], spec["phase"]))
            index += 1
            time.sleep(args.delay)


def main(argv=None):
    args = parse_args(argv)
    specs = build_frame_specs(args)
    for spec in specs:
        validate_device_id(spec["device_id"])
    print(
        f"Sending {args.protocol} demo frames to {args.host}:{args.port} "
        f"as {describe_specs(specs)}. Press Ctrl+C to stop."
    )
    try:
        if args.protocol == "TCP":
            send_tcp(args)
        else:
            send_udp(args)
    except KeyboardInterrupt:
        print("\nStopped.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
