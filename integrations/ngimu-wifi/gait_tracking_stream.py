# coding: UTF-8
"""Realtime adaptation of the Gait-Tracking ``gait_tracking.py`` algorithm.

The original script processes a CSV in two passes:
1. estimate earth-frame acceleration with imufusion AHRS,
2. detect moving periods from acceleration magnitude,
3. integrate velocity/position and remove velocity drift at each ZUPT segment.

This module keeps the same math, but makes the moving-period expansion and
drift removal work incrementally for the wireless dashboard stream.
"""

from dataclasses import dataclass

try:
    import imufusion
except ImportError:
    imufusion = None

try:
    import numpy
except ImportError:
    numpy = None

from sensor_math import GRAVITY_MPS2, clamp, magnitude


GAIT_MOVING_THRESHOLD_MPS2 = 3.0
GAIT_STATIONARY_THRESHOLD_MPS2 = 0.85
GAIT_STATIONARY_MARGIN_SECONDS = 0.10
GAIT_AHRS_GAIN = 0.5
DEFAULT_SAMPLE_PERIOD = 0.05
MAX_SAMPLE_PERIOD = 0.2
MAX_TRACK_SPEED_MPS = 6.0
MAX_TRACK_ACCELERATION_MPS2 = 55.0
MAX_MOTION_SEGMENT_POINTS = 2400
MAX_MARGIN_SAMPLES = 120


@dataclass
class GaitTrackingResult:
    earth_acceleration_g: tuple
    acceleration_mps2: tuple
    velocity_mps: tuple
    position_m: tuple
    is_moving: bool
    motion_state: str
    motion_confidence: float
    acceleration_magnitude: float
    speed_mps: float
    track_status: str
    sample_index: int
    segment_count: int
    corrections: list
    source: str
    fusion_euler: tuple
    sample_rate_hz: float


class RealtimeGaitTracker:
    """Streaming Gait ZUPT tracker compatible with the dashboard history API."""

    def __init__(
        self,
        moving_threshold=GAIT_MOVING_THRESHOLD_MPS2,
        stationary_margin_seconds=GAIT_STATIONARY_MARGIN_SECONDS,
        ahrs_gain=GAIT_AHRS_GAIN,
    ):
        self.moving_threshold = float(moving_threshold)
        self.stationary_margin_seconds = float(stationary_margin_seconds)
        self.ahrs_gain = float(ahrs_gain)
        self._sample_index = 0
        self._segment_count = 0
        self._last_ts = None
        self._sample_period = DEFAULT_SAMPLE_PERIOD
        self._velocity = [0.0, 0.0, 0.0]
        self._position = [0.0, 0.0, 0.0]
        self._is_moving = False
        self._stationary_samples = 0
        self._segment_start_position = [0.0, 0.0, 0.0]
        self._motion_segment = []
        self._leading_margin = []
        self._fusion_offset = None
        self._fusion_ahrs = None
        self._fusion_sample_rate = 0
        self._last_source = "device Euler bootstrap"
        self._last_fusion_euler = None

    def update(self, received_ts, accelerometer_g, gyroscope_dps, fallback_earth_acceleration_g):
        self._sample_index += 1
        corrections = []

        if self._last_ts is None:
            self._last_ts = received_ts
            earth_acc_g = tuple(float(value) for value in fallback_earth_acceleration_g)
            acceleration = self._limit_vector(
                [value * GRAVITY_MPS2 for value in earth_acc_g],
                MAX_TRACK_ACCELERATION_MPS2,
            )
            return self._result(earth_acc_g, acceleration, "Stationary", "Stationary", corrections)

        dt = received_ts - self._last_ts
        self._last_ts = received_ts
        if dt <= 0 or dt > 1.0:
            self._reset_dynamic_state()
            earth_acc_g = tuple(float(value) for value in fallback_earth_acceleration_g)
            acceleration = self._limit_vector(
                [value * GRAVITY_MPS2 for value in earth_acc_g],
                MAX_TRACK_ACCELERATION_MPS2,
            )
            return self._result(earth_acc_g, acceleration, "Stationary", "Reset", corrections)

        dt = clamp(dt, 0.001, MAX_SAMPLE_PERIOD)
        self._sample_period = self._sample_period * 0.85 + dt * 0.15
        earth_acc_g = self._estimate_earth_acceleration(
            accelerometer_g,
            gyroscope_dps,
            dt,
            fallback_earth_acceleration_g,
        )
        acceleration = self._limit_vector(
            [float(value) * GRAVITY_MPS2 for value in earth_acc_g],
            MAX_TRACK_ACCELERATION_MPS2,
        )
        acceleration_mag = magnitude(*acceleration)
        moving_sample = acceleration_mag > self.moving_threshold
        sample = {
            "sample_index": self._sample_index,
            "dt": dt,
            "acceleration": acceleration,
            "elapsed": self._sample_index * self._sample_period,
        }

        if moving_sample:
            if not self._is_moving:
                self._begin_motion_segment_with_margin()
            self._stationary_samples = 0
            self._integrate_motion_sample(sample)
            motion_state = "Moving"
            track_status = "Preliminary"
        elif self._is_moving:
            self._stationary_samples += 1
            self._integrate_motion_sample(sample)
            motion_state = "Moving"
            track_status = "Preliminary"
            if self._stationary_samples >= self._motion_margin_samples():
                corrections = self._apply_zupt_correction()
                self._is_moving = False
                self._stationary_samples = 0
                motion_state = "Stationary"
                track_status = "Corrected"
        else:
            self._velocity = [0.0, 0.0, 0.0]
            self._append_leading_margin_sample(sample)
            motion_state = "Stationary"
            track_status = "Stationary"

        return self._result(earth_acc_g, acceleration, motion_state, track_status, corrections)

    def _reset_dynamic_state(self):
        self._velocity = [0.0, 0.0, 0.0]
        self._is_moving = False
        self._stationary_samples = 0
        self._motion_segment = []
        self._leading_margin = []
        self._fusion_offset = None
        self._fusion_ahrs = None
        self._fusion_sample_rate = 0
        self._last_source = "device Euler reset"
        self._last_fusion_euler = None

    def _estimate_earth_acceleration(self, accelerometer_g, gyroscope_dps, dt, fallback_earth_acceleration_g):
        fallback = tuple(float(value) for value in fallback_earth_acceleration_g)
        if imufusion is None or numpy is None:
            self._last_source = "device Euler fallback: imufusion unavailable"
            self._last_fusion_euler = None
            return fallback

        try:
            if self._fusion_ahrs is None:
                sample_rate = int(round(1.0 / max(dt, 0.001)))
                sample_rate = max(10, min(500, sample_rate))
                self._fusion_sample_rate = sample_rate
                self._fusion_offset = imufusion.Offset(sample_rate)
                self._fusion_ahrs = imufusion.Ahrs()
                self._fusion_ahrs.settings = imufusion.Settings(
                    imufusion.CONVENTION_NWU,
                    self.ahrs_gain,
                    2000,
                    10,
                    0,
                    5 * sample_rate,
                )

            gyro = self._fusion_offset.update(numpy.array(gyroscope_dps, dtype=float))
            self._fusion_ahrs.update_no_magnetometer(
                gyro,
                numpy.array(accelerometer_g, dtype=float),
                dt,
            )
            self._last_fusion_euler = tuple(float(value) for value in self._fusion_ahrs.quaternion.to_euler())
            self._last_source = "imufusion AHRS"
            return tuple(float(value) for value in self._fusion_ahrs.earth_acceleration)
        except Exception as exc:
            self._last_source = f"device Euler fallback: {exc.__class__.__name__}"
            self._last_fusion_euler = None
            return fallback

    def _motion_margin_samples(self):
        if self._sample_period <= 0:
            return 2
        return max(2, min(MAX_MARGIN_SAMPLES, int(round(self.stationary_margin_seconds / self._sample_period))))

    def _append_leading_margin_sample(self, sample):
        self._leading_margin.append(sample)
        limit = self._motion_margin_samples()
        if len(self._leading_margin) > limit:
            self._leading_margin = self._leading_margin[-limit:]

    def _begin_motion_segment_with_margin(self):
        self._is_moving = True
        self._motion_segment = []
        self._segment_start_position = self._position[:]
        for sample in self._leading_margin:
            self._integrate_motion_sample(sample)
        self._leading_margin = []

    def _integrate_motion_sample(self, sample):
        acceleration = sample["acceleration"]
        dt = sample["dt"]
        for axis in range(3):
            self._velocity[axis] += acceleration[axis] * dt
        self._velocity = self._limit_vector(self._velocity, MAX_TRACK_SPEED_MPS)
        for axis in range(3):
            self._position[axis] += self._velocity[axis] * dt

        point = {
            "sample_index": sample["sample_index"],
            "dt": dt,
            "elapsed": sample["elapsed"],
            "raw_velocity": self._velocity[:],
        }
        self._motion_segment.append(point)
        if len(self._motion_segment) > MAX_MOTION_SEGMENT_POINTS:
            self._segment_start_position = self._position[:]
            self._motion_segment = self._motion_segment[-MAX_MOTION_SEGMENT_POINTS // 2 :]

    def _apply_zupt_correction(self):
        if not self._motion_segment:
            self._velocity = [0.0, 0.0, 0.0]
            return []

        start_velocity = self._motion_segment[0]["raw_velocity"]
        end_velocity = self._motion_segment[-1]["raw_velocity"]
        start_elapsed = self._motion_segment[0]["elapsed"]
        end_elapsed = self._motion_segment[-1]["elapsed"]
        duration = max(1e-9, end_elapsed - start_elapsed)
        corrected_position = self._segment_start_position[:]
        corrections = []

        for point in self._motion_segment:
            ratio = clamp((point["elapsed"] - start_elapsed) / duration, 0.0, 1.0)
            corrected_velocity = [0.0, 0.0, 0.0]
            for axis in range(3):
                drift_velocity = start_velocity[axis] + (end_velocity[axis] - start_velocity[axis]) * ratio
                corrected_velocity[axis] = point["raw_velocity"][axis] - drift_velocity
                corrected_position[axis] += corrected_velocity[axis] * point["dt"]

            corrections.append(self._make_motion_correction(point["sample_index"], corrected_position, corrected_velocity))

        self._position = corrected_position
        self._velocity = [0.0, 0.0, 0.0]
        self._motion_segment = []
        self._leading_margin = []
        self._segment_count += 1
        return corrections

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

    def _result(self, earth_acc_g, acceleration, motion_state, track_status, corrections):
        acceleration_mag = magnitude(*acceleration)
        confidence = clamp(
            (acceleration_mag - GAIT_STATIONARY_THRESHOLD_MPS2)
            / (self.moving_threshold - GAIT_STATIONARY_THRESHOLD_MPS2),
            0.0,
            1.0,
        )
        speed = magnitude(*self._velocity)
        return GaitTrackingResult(
            earth_acceleration_g=tuple(float(value) for value in earth_acc_g),
            acceleration_mps2=tuple(float(value) for value in acceleration),
            velocity_mps=tuple(float(value) for value in self._velocity),
            position_m=tuple(float(value) for value in self._position),
            is_moving=self._is_moving,
            motion_state=motion_state,
            motion_confidence=confidence,
            acceleration_magnitude=acceleration_mag,
            speed_mps=speed,
            track_status=track_status,
            sample_index=self._sample_index,
            segment_count=self._segment_count,
            corrections=corrections,
            source=self._last_source,
            fusion_euler=self._last_fusion_euler,
            sample_rate_hz=(1.0 / self._sample_period) if self._sample_period > 0 else 0.0,
        )

    @staticmethod
    def _limit_vector(vector, limit):
        vector = [float(value) for value in vector]
        vector_magnitude = magnitude(*vector)
        if vector_magnitude <= limit or vector_magnitude <= 0:
            return vector
        scale = limit / vector_magnitude
        return [value * scale for value in vector]
