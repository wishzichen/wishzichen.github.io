# coding: UTF-8
import socket
import struct
import time


NTP_UNIX_EPOCH_OFFSET = 2208988800

FORWARDED_ADDRESSES = (
    "/sensors",
    "/magnitudes",
    "/quaternion",
    "/matrix",
    "/euler",
    "/linear",
    "/earth",
    "/altitude",
    "/temperature",
    "/battery",
    "/rssi",
)


def _pad4(data):
    padding = (-len(data)) % 4
    if padding:
        data += b"\0" * padding
    return data


def _osc_string(value):
    return _pad4(value.encode("utf-8") + b"\0")


def _osc_timetag(timestamp=None):
    if timestamp is None:
        timestamp = time.time()
    seconds = int(timestamp)
    fraction = int((timestamp - seconds) * (2**32)) & 0xFFFFFFFF
    return struct.pack(">II", seconds + NTP_UNIX_EPOCH_OFFSET, fraction)


def osc_message(address, *args):
    tags = ","
    body = bytearray()

    for value in args:
        if isinstance(value, str):
            tags += "s"
            body.extend(_osc_string(value))
        elif isinstance(value, int):
            tags += "i"
            body.extend(struct.pack(">i", value))
        else:
            tags += "f"
            body.extend(struct.pack(">f", float(value)))

    return _osc_string(address) + _osc_string(tags) + bytes(body)


def osc_bundle(messages, timestamp=None):
    body = bytearray(_osc_string("#bundle"))
    body.extend(_osc_timetag(timestamp))
    for message in messages:
        body.extend(struct.pack(">i", len(message)))
        body.extend(message)
    return bytes(body)


class NgimuOscForwarder:
    """Forward parsed BS sensor frames as OSC messages understood by NGIMU GUI."""

    def __init__(self, host="127.0.0.1", port=8000):
        self.host = host
        self.port = port
        self.socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

    def close(self):
        self.socket.close()

    def send_device_model(self, device_model):
        data = device_model.deviceData
        self.socket.sendto(osc_bundle(build_device_messages(data)), (self.host, self.port))


def build_device_messages(data):
    return [
            osc_message(
                "/sensors",
                _float_value(data, "AsX"),
                _float_value(data, "AsY"),
                _float_value(data, "AsZ"),
                _float_value(data, "AccX"),
                _float_value(data, "AccY"),
                _float_value(data, "AccZ"),
                _float_value(data, "GX"),
                _float_value(data, "GY"),
                _float_value(data, "GZ"),
                0.0,
            ),
            osc_message(
                "/magnitudes",
                _float_value(data, "GyroMagnitude"),
                _float_value(data, "AccMagnitude"),
                _float_value(data, "MagMagnitude"),
            ),
            osc_message(
                "/quaternion",
                _float_value(data, "QuaternionW", 1.0),
                _float_value(data, "QuaternionX"),
                _float_value(data, "QuaternionY"),
                _float_value(data, "QuaternionZ"),
            ),
            osc_message(
                "/matrix",
                _float_value(data, "MatrixXX", 1.0),
                _float_value(data, "MatrixXY"),
                _float_value(data, "MatrixXZ"),
                _float_value(data, "MatrixYX"),
                _float_value(data, "MatrixYY", 1.0),
                _float_value(data, "MatrixYZ"),
                _float_value(data, "MatrixZX"),
                _float_value(data, "MatrixZY"),
                _float_value(data, "MatrixZZ", 1.0),
            ),
            osc_message(
                "/euler",
                _float_value(data, "AngleX"),
                _float_value(data, "AngleY"),
                _float_value(data, "AngleZ"),
            ),
            osc_message(
                "/linear",
                _float_value(data, "LinearAccX"),
                _float_value(data, "LinearAccY"),
                _float_value(data, "LinearAccZ"),
            ),
            osc_message(
                "/earth",
                _float_value(data, "EarthAccX"),
                _float_value(data, "EarthAccY"),
                _float_value(data, "EarthAccZ"),
            ),
            osc_message(
                "/altitude",
                _float_value(data, "EstimatedAltitude"),
            ),
            osc_message(
                "/temperature",
                _float_value(data, "Temp"),
                _float_value(data, "Temp"),
            ),
            osc_message(
                "/battery",
                _float_value(data, "ElectricPercentage"),
                0.0,
                _float_value(data, "BatteryVoltage"),
                0.0,
                "Unknown",
            ),
            osc_message(
                "/rssi",
                _float_value(data, "Rssi"),
                _rssi_to_percentage(data.get("Rssi", -100.0)),
            ),
        ]


def _float_value(data, key, default=0.0):
    try:
        return float(data.get(key, default))
    except (TypeError, ValueError):
        return float(default)


def _rssi_to_percentage(rssi):
    try:
        rssi = float(rssi)
    except (TypeError, ValueError):
        return 0.0
    return max(0.0, min(100.0, (rssi + 100.0) * 2.0))
