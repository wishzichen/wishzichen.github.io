# coding: UTF-8
"""Shared utilities for BS sensor bridge scripts."""

import os

from device_model import DeviceModel

FRAME_LEN = 54
DEVICE_ID_LEN = 12
FRAME_HEADER = b"BS55"
FRAME_TAIL = b"\r\n"


def env_int(name, default):
    """Read an environment variable as an integer, falling back to *default*."""
    value = os.getenv(name)
    if value in (None, ""):
        return default
    try:
        return int(value)
    except ValueError as exc:
        raise SystemExit(f"Environment variable {name} must be an integer, got {value!r}") from exc


def build_receiver(protocol, port, callback):
    """Create a UDP or TCP receiver based on *protocol* string."""
    from tcp_service import TcpService
    from udp_service import UdpService

    if protocol == "TCP":
        return TcpService(port, callback)
    if protocol == "UDP":
        return UdpService(port, callback)
    raise SystemExit(f"Unsupported protocol {protocol!r}; use UDP or TCP.")


def parse_frame_buffer(buffer, dispatch_fn):
    """Scan *buffer* for BS55 frames, dispatch each complete frame, return remaining bytes."""
    while True:
        header_index = buffer.find(FRAME_HEADER)
        if header_index < 0:
            if len(buffer) > len(FRAME_HEADER) - 1:
                del buffer[: -(len(FRAME_HEADER) - 1)]
            break

        if header_index > 0:
            del buffer[:header_index]

        if len(buffer) < FRAME_LEN:
            break

        if bytes(buffer[FRAME_LEN - 2 : FRAME_LEN]) != FRAME_TAIL:
            del buffer[0]
            continue

        frame = bytes(buffer[:FRAME_LEN])
        del buffer[:FRAME_LEN]
        dispatch_fn(frame)


def dispatch_frame(frame, device_list, callback, remote_key):
    """Parse a single BS55 frame, update the matching DeviceModel, invoke callback."""
    try:
        device_id = frame[:DEVICE_ID_LEN].decode("ascii")
    except UnicodeDecodeError:
        return

    if device_id not in device_list:
        device_list[device_id] = DeviceModel(device_id, callback)

    device = device_list.get(device_id)
    if device:
        device.lastAddress = remote_key
        device.onDataReceived(frame)
