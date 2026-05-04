# coding: UTF-8
import time

try:
    import imufusion
except ImportError:
    imufusion = None

try:
    import numpy
except ImportError:
    numpy = None

from sensor_math import (
    GRAVITY_MPS2,
    clamp,
    inverse_rotate_vector,
    magnitude,
    quaternion_from_euler,
    rotate_vector,
    rotation_matrix_from_quaternion,
)


MOTION_THRESHOLD_MPS2 = 3.0
STATIONARY_THRESHOLD_MPS2 = 0.85
GYRO_MOTION_THRESHOLD_DPS = 8.0
MOTION_MARGIN_SECONDS = 0.10
DEFAULT_SAMPLE_PERIOD = 0.05
MAX_MOTION_SEGMENT_POINTS = 1200
MAX_MARGIN_SAMPLES = 80
STATIONARY_BIAS_ALPHA = 0.025
MAX_TRACK_SPEED_MPS = 5.0
MAX_TRACK_ACCELERATION_MPS2 = 45.0


class DeviceModel:
    """Parsed state for one wireless sensor device."""

    def __init__(self, deviceName, callback_method=None):
        print(f"Initialize device model: {deviceName}")
        self.deviceName = deviceName
        self.callback_method = callback_method
        self.deviceData = {}
        self.isOpen = False
        self.lastAddress = None
        self._motion_last_ts = None
        self._velocity = [0.0, 0.0, 0.0]
        self._position = [0.0, 0.0, 0.0]
        self._earth_acceleration_bias = [0.0, 0.0, 0.0]
        self._is_moving = False
        self._stationary_samples = 0
        self._motion_segment = []
        self._leading_margin_buffer = []
        self._segment_start_position = [0.0, 0.0, 0.0]
        self._motion_segment_count = 0
        self._motion_state = "Stationary"
        self._motion_confidence = 0.0
        self._motion_acceleration_mag = 0.0
        self._motion_sample_index = 0
        self._sample_period = DEFAULT_SAMPLE_PERIOD
        self._track_status = "Stationary"
        self._last_motion_corrections = []
        self._fusion_offset = None
        self._fusion_ahrs = None

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
        earth_with_gravity = rotate_vector(matrix, acc)
        earth = (
            earth_with_gravity[0],
            earth_with_gravity[1],
            earth_with_gravity[2] - 1.0,
        )

        self._set_vector("LinearAcc", ("X", "Y", "Z"), linear, 4)
        earth = self._update_relative_motion(received_ts, earth, acc, gyro)
        self._set_vector("EarthAcc", ("X", "Y", "Z"), earth, 4)

    def _update_relative_motion(self, received_ts, earth_acc_g, acc_g, gyro_dps):
        self._motion_sample_index += 1
        self._last_motion_corrections = []

        if self._motion_last_ts is None:
            self._motion_last_ts = received_ts
            self.set("EarthAccSource", "device Euler")
            raw_acceleration = [float(value) * GRAVITY_MPS2 for value in earth_acc_g]
            self._update_acceleration_bias(raw_acceleration, alpha=1.0)
            acceleration = self._motion_acceleration(raw_acceleration)
            self._update_motion_intensity(acceleration)
            self._set_motion_data()
            return earth_acc_g

        dt = received_ts - self._motion_last_ts
        self._motion_last_ts = received_ts
        if dt <= 0 or dt > 1.0:
            self._velocity = [0.0, 0.0, 0.0]
            self._is_moving = False
            self._stationary_samples = 0
            self._motion_segment.clear()
            self._leading_margin_buffer.clear()
            self._motion_state = "Stationary"
            self._track_status = "Reset"
            self._earth_acceleration_bias = [0.0, 0.0, 0.0]
            self.set("EarthAccSource", "device Euler")
            raw_acceleration = [float(value) * GRAVITY_MPS2 for value in earth_acc_g]
            self._update_acceleration_bias(raw_acceleration, alpha=1.0)
            acceleration = self._motion_acceleration(raw_acceleration)
            self._update_motion_intensity(acceleration)
            self._set_motion_data()
            return earth_acc_g

        dt = clamp(dt, 0.001, 0.2)
        self._sample_period = self._sample_period * 0.85 + dt * 0.15
        earth_acc_g = self._estimate_earth_acceleration(acc_g, gyro_dps, dt, earth_acc_g)
        raw_acceleration = [float(value) * GRAVITY_MPS2 for value in earth_acc_g]
        acceleration = self._motion_acceleration(raw_acceleration)
        acceleration_mag = self._update_motion_intensity(acceleration)
        gyro_mag = magnitude(*gyro_dps)
        moving_sample = acceleration_mag >= MOTION_THRESHOLD_MPS2 and (
            gyro_mag >= GYRO_MOTION_THRESHOLD_DPS
            or acceleration_mag >= MOTION_THRESHOLD_MPS2 * 1.45
        )
        sample = {
            "sample_index": self._motion_sample_index,
            "dt": dt,
            "acceleration": acceleration,
        }

        if moving_sample:
            if not self._is_moving:
                self._begin_motion_segment_with_margin()
            self._stationary_samples = 0
            self._integrate_motion_sample(sample)
            self._motion_state = "Moving"
            self._track_status = "Preliminary"
        elif self._is_moving:
            self._stationary_samples += 1
            self._integrate_motion_sample(sample)
            self._motion_state = "Moving"
            self._track_status = "Preliminary"
            if self._stationary_samples >= self._motion_margin_samples():
                self._apply_zupt_correction()
                self._is_moving = False
                self._stationary_samples = 0
                self._motion_state = "Stationary"
                self._track_status = "Corrected"
        else:
            self._velocity = [0.0, 0.0, 0.0]
            self._update_acceleration_bias(raw_acceleration)
            sample["acceleration"] = self._motion_acceleration(raw_acceleration)
            self._update_motion_intensity(sample["acceleration"])
            self._motion_state = "Stationary"
            self._track_status = "Stationary"
            self._append_leading_margin_sample(sample)

        self._set_motion_data()
        return earth_acc_g

    def _update_motion_intensity(self, acceleration):
        acceleration_mag = magnitude(*acceleration)
        self._motion_acceleration_mag = acceleration_mag
        self._motion_confidence = clamp(
            (acceleration_mag - STATIONARY_THRESHOLD_MPS2)
            / (MOTION_THRESHOLD_MPS2 - STATIONARY_THRESHOLD_MPS2),
            0.0,
            1.0,
        )
        return acceleration_mag

    def _update_acceleration_bias(self, acceleration, alpha=STATIONARY_BIAS_ALPHA):
        alpha = clamp(alpha, 0.0, 1.0)
        for index in range(3):
            self._earth_acceleration_bias[index] = (
                self._earth_acceleration_bias[index] * (1.0 - alpha)
                + float(acceleration[index]) * alpha
            )

    def _motion_acceleration(self, raw_acceleration):
        corrected = [
            float(raw_acceleration[index]) - self._earth_acceleration_bias[index]
            for index in range(3)
        ]
        return self._limit_vector(corrected, MAX_TRACK_ACCELERATION_MPS2)

    @staticmethod
    def _limit_vector(vector, limit):
        vector = [float(value) for value in vector]
        vector_magnitude = magnitude(*vector)
        if vector_magnitude <= limit or vector_magnitude <= 0:
            return vector
        scale = limit / vector_magnitude
        return [value * scale for value in vector]

    def _estimate_earth_acceleration(self, acc_g, gyro_dps, dt, fallback_earth_acc_g):
        if imufusion is None or numpy is None:
            self.set("EarthAccSource", "device Euler")
            return fallback_earth_acc_g

        try:
            if self._fusion_ahrs is None:
                sample_rate = int(round(1.0 / max(dt, 0.001)))
                sample_rate = max(10, min(500, sample_rate))
                self._fusion_offset = imufusion.Offset(sample_rate)
                self._fusion_ahrs = imufusion.Ahrs()
                self._fusion_ahrs.settings = imufusion.Settings(
                    imufusion.CONVENTION_NWU,
                    0.5,
                    2000,
                    10,
                    0,
                    5 * sample_rate,
                )

            gyro = self._fusion_offset.update(numpy.array(gyro_dps, dtype=float))
            self._fusion_ahrs.update_no_magnetometer(gyro, numpy.array(acc_g, dtype=float), dt)
            euler = self._fusion_ahrs.quaternion.to_euler()
            self._set_vector("FusionAngle", ("X", "Y", "Z"), euler, 2)
            self.set("EarthAccSource", "imufusion AHRS")
            return tuple(float(value) for value in self._fusion_ahrs.earth_acceleration)
        except Exception as exc:
            self.set("EarthAccSource", f"device Euler fallback: {exc.__class__.__name__}")
            return fallback_earth_acc_g

    def _motion_margin_samples(self):
        if self._sample_period <= 0:
            return 3
        return max(2, min(MAX_MARGIN_SAMPLES, int(round(MOTION_MARGIN_SECONDS / self._sample_period))))

    def _append_leading_margin_sample(self, sample):
        self._leading_margin_buffer.append(sample)
        limit = self._motion_margin_samples()
        if len(self._leading_margin_buffer) > limit:
            self._leading_margin_buffer = self._leading_margin_buffer[-limit:]

    def _begin_motion_segment_with_margin(self):
        self._is_moving = True
        self._motion_segment = []
        self._segment_start_position = self._position[:]
        for sample in self._leading_margin_buffer:
            self._integrate_motion_sample(sample)
        self._leading_margin_buffer = []

    def _integrate_motion_sample(self, sample):
        acceleration = sample["acceleration"]
        dt = sample["dt"]
        previous_velocity = self._velocity[:]
        for index in range(3):
            self._velocity[index] += acceleration[index] * dt
        self._velocity = self._limit_vector(self._velocity, MAX_TRACK_SPEED_MPS)
        for index in range(3):
            self._position[index] += (previous_velocity[index] + self._velocity[index]) * 0.5 * dt

        self._append_motion_segment_point(sample, previous_velocity)

    def _append_motion_segment_point(self, sample, previous_velocity):
        self._motion_segment.append(
            {
                "sample_index": sample["sample_index"],
                "dt": sample["dt"],
                "raw_velocity": self._velocity[:],
                "previous_velocity": previous_velocity,
            }
        )
        if len(self._motion_segment) > MAX_MOTION_SEGMENT_POINTS:
            self._segment_start_position = self._position[:]
            self._motion_segment = self._motion_segment[-MAX_MOTION_SEGMENT_POINTS // 2 :]

    def _apply_zupt_correction(self):
        if not self._motion_segment:
            self._velocity = [0.0, 0.0, 0.0]
            return

        start_velocity = self._motion_segment[0]["raw_velocity"]
        end_velocity = self._motion_segment[-1]["raw_velocity"]
        corrected_position = self._segment_start_position[:]
        point_count = len(self._motion_segment)
        corrections = []
        previous_corrected_velocity = [0.0, 0.0, 0.0]

        for point_index, point in enumerate(self._motion_segment):
            ratio = 0.0 if point_count <= 1 else point_index / (point_count - 1)
            corrected_velocity = [0.0, 0.0, 0.0]
            for axis in range(3):
                drift_velocity = start_velocity[axis] + (end_velocity[axis] - start_velocity[axis]) * ratio
                corrected_velocity[axis] = point["raw_velocity"][axis] - drift_velocity
                corrected_position[axis] += (
                    previous_corrected_velocity[axis] + corrected_velocity[axis]
                ) * 0.5 * point["dt"]

            corrections.append(self._make_motion_correction(point["sample_index"], corrected_position, corrected_velocity))
            previous_corrected_velocity = corrected_velocity

        self._position = corrected_position
        self._velocity = [0.0, 0.0, 0.0]
        self._motion_segment = []
        self._leading_margin_buffer.clear()
        self._last_motion_corrections = corrections
        self._motion_segment_count += 1

    def _make_motion_correction(self, sample_index, position, velocity):
        speed = magnitude(*velocity)
        return {
            "MotionSampleIndex": sample_index,
            "PositionX": round(position[0], 4),
            "PositionY": round(position[1], 4),
            "PositionZ": round(position[2], 4),
            "TrackX": round(position[0], 4),
            "TrackY": round(position[1], 4),
            "TrackZ": round(position[2], 4),
            "VelocityX": round(velocity[0], 4),
            "VelocityY": round(velocity[1], 4),
            "VelocityZ": round(velocity[2], 4),
            "TrackVelocityX": round(velocity[0], 4),
            "TrackVelocityY": round(velocity[1], 4),
            "TrackVelocityZ": round(velocity[2], 4),
            "Speed": round(speed, 4),
            "TrackSpeed": round(speed, 4),
            "EstimatedAltitude": round(position[2], 4),
            "TrackStatus": "Corrected",
        }

    def consume_motion_corrections(self):
        corrections = self._last_motion_corrections
        self._last_motion_corrections = []
        return corrections

    def _set_motion_data(self):
        self.set("VelocityX", round(self._velocity[0], 4))
        self.set("VelocityY", round(self._velocity[1], 4))
        self.set("VelocityZ", round(self._velocity[2], 4))
        self.set("PositionX", round(self._position[0], 4))
        self.set("PositionY", round(self._position[1], 4))
        self.set("PositionZ", round(self._position[2], 4))
        self.set("Speed", round(magnitude(*self._velocity), 4))
        self.set("EstimatedAltitude", round(self._position[2], 4))
        self.set("TrackX", round(self._position[0], 4))
        self.set("TrackY", round(self._position[1], 4))
        self.set("TrackZ", round(self._position[2], 4))
        self.set("TrackVelocityX", round(self._velocity[0], 4))
        self.set("TrackVelocityY", round(self._velocity[1], 4))
        self.set("TrackVelocityZ", round(self._velocity[2], 4))
        self.set("TrackSpeed", round(magnitude(*self._velocity), 4))
        self.set("TrackStatus", self._track_status)
        self.set("MotionSampleIndex", self._motion_sample_index)
        self.set("MotionState", self._motion_state)
        self.set("MotionConfidence", round(self._motion_confidence, 3))
        self.set("MotionAccelerationMagnitude", round(self._motion_acceleration_mag, 4))
        self.set("MotionSegmentCount", self._motion_segment_count)
        self._set_vector("MotionBias", ("X", "Y", "Z"), self._earth_acceleration_bias, 4)
        self.set("TrackSpeedLimit", MAX_TRACK_SPEED_MPS)
        self.set("TrackerMode", "Gait ZUPT 3D")
        self.set("PositionSource", "IMU_ZUPT_DIAGNOSTIC")

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
