# coding: UTF-8
import time

from gait_tracking_stream import MAX_TRACK_SPEED_MPS, RealtimeGaitTracker
from sensor_math import (
    inverse_rotate_vector,
    magnitude,
    quaternion_from_euler,
    rotate_vector,
    rotation_matrix_from_quaternion,
)


class DeviceModel:
    """Parsed state for one wireless sensor device."""

    def __init__(self, deviceName, callback_method=None):
        print(f"Initialize device model: {deviceName}")
        self.deviceName = deviceName
        self.callback_method = callback_method
        self.deviceData = {}
        self.isOpen = False
        self.lastAddress = None
        self._gait_tracker = RealtimeGaitTracker()
        self._last_motion_corrections = []

    def set(self, key, value):
        self.deviceData[key] = value

    def get(self, key, default=None):
        return self.deviceData.get(key, default)

    def remove(self, key):
        self.deviceData.pop(key, None)

    def onDataReceived(self, data):
        data = bytes(data)
        if len(data) < 54:
            return

        device_id = data[:12].decode("ascii", errors="ignore")
        if self.deviceName != device_id:
            return

        self.set(
            "Time",
            "20{:02d}-{:02d}-{:02d} {:02d}:{:02d}:{:02d}.{:03d}".format(
                data[12],
                data[13],
                data[14],
                data[15],
                data[16],
                data[17],
                data[19] << 8 | data[18],
            ),
        )

        acc_x = self.getSignInt16(data[21] << 8 | data[20]) / 32768 * 16
        acc_y = self.getSignInt16(data[23] << 8 | data[22]) / 32768 * 16
        acc_z = self.getSignInt16(data[25] << 8 | data[24]) / 32768 * 16
        self.set("AccX", round(acc_x, 3))
        self.set("AccY", round(acc_y, 3))
        self.set("AccZ", round(acc_z, 3))

        as_x = self.getSignInt16(data[27] << 8 | data[26]) / 32768 * 2000
        as_y = self.getSignInt16(data[29] << 8 | data[28]) / 32768 * 2000
        as_z = self.getSignInt16(data[31] << 8 | data[30]) / 32768 * 2000
        self.set("AsX", round(as_x, 3))
        self.set("AsY", round(as_y, 3))
        self.set("AsZ", round(as_z, 3))

        gx = self.getSignInt16(data[33] << 8 | data[32]) * 100 / 1024
        gy = self.getSignInt16(data[35] << 8 | data[34]) * 100 / 1024
        gz = self.getSignInt16(data[37] << 8 | data[36]) * 100 / 1024
        self.set("GX", round(gx, 3))
        self.set("GY", round(gy, 3))
        self.set("GZ", round(gz, 3))

        angle_x = self.getSignInt16(data[39] << 8 | data[38]) / 32768 * 180
        angle_y = self.getSignInt16(data[41] << 8 | data[40]) / 32768 * 180
        angle_z = self.getSignInt16(data[43] << 8 | data[42]) / 32768 * 180
        self.set("AngleX", round(angle_x, 2))
        self.set("AngleY", round(angle_y, 2))
        self.set("AngleZ", round(angle_z, 2))

        temp = self.getSignInt16(data[45] << 8 | data[44]) / 100
        self.set("Temp", round(temp, 2))

        quantity = data[47] << 8 | data[46]
        self.set("BatteryRaw", quantity)
        self.set("BatteryVoltage", round(quantity / 100, 3))
        self.set("ElectricPercentage", self._battery_percentage(quantity))

        rssi = self.getSignInt16(data[49] << 8 | data[48])
        self.set("Rssi", rssi)

        version = self.getSignInt16(data[51] << 8 | data[50])
        self.set("Version", version)

        self._update_derived_data(time.time())

        if self.callback_method:
            try:
                self.callback_method(self)
            except Exception as exc:
                print(f"Device callback error: {exc}")

    def _update_derived_data(self, received_ts):
        acc = (
            float(self.get("AccX", 0.0)),
            float(self.get("AccY", 0.0)),
            float(self.get("AccZ", 0.0)),
        )
        gyro = (
            float(self.get("AsX", 0.0)),
            float(self.get("AsY", 0.0)),
            float(self.get("AsZ", 0.0)),
        )
        mag = (
            float(self.get("GX", 0.0)),
            float(self.get("GY", 0.0)),
            float(self.get("GZ", 0.0)),
        )
        euler = (
            float(self.get("AngleX", 0.0)),
            float(self.get("AngleY", 0.0)),
            float(self.get("AngleZ", 0.0)),
        )

        quaternion = quaternion_from_euler(*euler)
        matrix = rotation_matrix_from_quaternion(quaternion)

        self._set_vector("Quaternion", ("W", "X", "Y", "Z"), quaternion, 6)
        self._set_vector(
            "Matrix",
            ("XX", "XY", "XZ", "YX", "YY", "YZ", "ZX", "ZY", "ZZ"),
            matrix,
            6,
        )

        self.set("GyroMagnitude", round(magnitude(*gyro), 3))
        self.set("AccMagnitude", round(magnitude(*acc), 3))
        self.set("MagMagnitude", round(magnitude(*mag), 3))

        gravity_body = inverse_rotate_vector(matrix, (0.0, 0.0, 1.0))
        linear = tuple(acc[index] - gravity_body[index] for index in range(3))
        device_earth_with_gravity = rotate_vector(matrix, acc)
        fallback_earth_acc = (
            device_earth_with_gravity[0],
            device_earth_with_gravity[1],
            device_earth_with_gravity[2] - 1.0,
        )

        self._set_vector("LinearAcc", ("X", "Y", "Z"), linear, 4)
        tracking = self._gait_tracker.update(received_ts, acc, gyro, fallback_earth_acc)
        self._last_motion_corrections = tracking.corrections
        self.set("EarthAccSource", tracking.source)
        if tracking.fusion_euler:
            self._set_vector("FusionAngle", ("X", "Y", "Z"), tracking.fusion_euler, 2)
        self._set_vector("EarthAcc", ("X", "Y", "Z"), tracking.earth_acceleration_g, 4)
        self._set_motion_data(tracking)

    def consume_motion_corrections(self):
        corrections = self._last_motion_corrections
        self._last_motion_corrections = []
        return corrections

    def _set_motion_data(self, tracking):
        velocity = tracking.velocity_mps
        position = tracking.position_m

        self.set("VelocityX", round(velocity[0], 4))
        self.set("VelocityY", round(velocity[1], 4))
        self.set("VelocityZ", round(velocity[2], 4))
        self.set("PositionX", round(position[0], 4))
        self.set("PositionY", round(position[1], 4))
        self.set("PositionZ", round(position[2], 4))
        self.set("Speed", round(tracking.speed_mps, 4))
        self.set("EstimatedAltitude", round(position[2], 4))
        self.set("TrackX", round(position[0], 4))
        self.set("TrackY", round(position[1], 4))
        self.set("TrackZ", round(position[2], 4))
        self.set("TrackVelocityX", round(velocity[0], 4))
        self.set("TrackVelocityY", round(velocity[1], 4))
        self.set("TrackVelocityZ", round(velocity[2], 4))
        self.set("TrackSpeed", round(tracking.speed_mps, 4))
        self.set("TrackStatus", tracking.track_status)
        self.set("MotionSampleIndex", tracking.sample_index)
        self.set("MotionState", tracking.motion_state)
        self.set("MotionConfidence", round(tracking.motion_confidence, 3))
        self.set("MotionAccelerationMagnitude", round(tracking.acceleration_magnitude, 4))
        self.set("MotionSegmentCount", tracking.segment_count)
        self.set("GaitSampleRateHz", round(tracking.sample_rate_hz, 1))
        self.set("TrackSpeedLimit", MAX_TRACK_SPEED_MPS)
        self.set("TrackerMode", "Gait Tracking ZUPT 3D")
        self.set("PositionSource", "gait_tracking.py streaming")

    def _set_vector(self, prefix, names, values, digits):
        for name, value in zip(names, values):
            self.set(prefix + name, round(float(value), digits))

    @staticmethod
    def _battery_percentage(quantity):
        if quantity > 396:
            return 100
        if 393 < quantity <= 396:
            return 90
        if 387 < quantity <= 393:
            return 75
        if 382 < quantity <= 387:
            return 60
        if 379 < quantity <= 382:
            return 50
        if 377 < quantity <= 379:
            return 40
        if 373 < quantity <= 377:
            return 30
        if 370 < quantity <= 373:
            return 20
        if 368 < quantity <= 370:
            return 15
        if 350 < quantity <= 368:
            return 10
        if 340 < quantity <= 350:
            return 5
        return 0

    @staticmethod
    def getSignInt16(num):
        if num >= 2**15:
            num -= 2**16
        return num
