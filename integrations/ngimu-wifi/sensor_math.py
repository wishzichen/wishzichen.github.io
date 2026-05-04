# coding: UTF-8
import math


GRAVITY_MPS2 = 9.80665


def magnitude(*values):
    return math.sqrt(sum(float(value) * float(value) for value in values))


def quaternion_from_euler(roll_deg, pitch_deg, yaw_deg):
    """Match the NGIMU C# ZYX Euler-to-quaternion conversion."""
    psi = math.radians(float(yaw_deg))
    theta = math.radians(float(pitch_deg))
    phi = math.radians(float(roll_deg))

    cos_psi = math.cos(psi * 0.5)
    sin_psi = math.sin(psi * 0.5)
    cos_theta = math.cos(theta * 0.5)
    sin_theta = math.sin(theta * 0.5)
    cos_phi = math.cos(phi * 0.5)
    sin_phi = math.sin(phi * 0.5)

    return normalise_quaternion(
        (
            cos_psi * cos_theta * cos_phi + sin_psi * sin_theta * sin_phi,
            -(cos_psi * cos_theta * sin_phi - sin_psi * sin_theta * cos_phi),
            -(cos_psi * sin_theta * cos_phi + sin_psi * cos_theta * sin_phi),
            -(sin_psi * cos_theta * cos_phi - cos_psi * sin_theta * sin_phi),
        )
    )


def normalise_quaternion(quaternion):
    w, x, y, z = (float(item) for item in quaternion)
    norm = math.sqrt(w * w + x * x + y * y + z * z)
    if norm <= 0:
        return (1.0, 0.0, 0.0, 0.0)
    return (w / norm, x / norm, y / norm, z / norm)


def rotation_matrix_from_quaternion(quaternion):
    w, x, y, z = normalise_quaternion(quaternion)

    qwqw = w * w
    qwqx = w * x
    qwqy = w * y
    qwqz = w * z
    qxqy = x * y
    qxqz = x * z
    qyqz = y * z

    return (
        2.0 * (qwqw - 0.5 + x * x),
        2.0 * (qxqy + qwqz),
        2.0 * (qxqz - qwqy),
        2.0 * (qxqy - qwqz),
        2.0 * (qwqw - 0.5 + y * y),
        2.0 * (qyqz + qwqx),
        2.0 * (qxqz + qwqy),
        2.0 * (qyqz - qwqx),
        2.0 * (qwqw - 0.5 + z * z),
    )


def rotate_vector(matrix, vector):
    x, y, z = (float(item) for item in vector)
    return (
        matrix[0] * x + matrix[1] * y + matrix[2] * z,
        matrix[3] * x + matrix[4] * y + matrix[5] * z,
        matrix[6] * x + matrix[7] * y + matrix[8] * z,
    )


def inverse_rotate_vector(matrix, vector):
    x, y, z = (float(item) for item in vector)
    return (
        matrix[0] * x + matrix[3] * y + matrix[6] * z,
        matrix[1] * x + matrix[4] * y + matrix[7] * z,
        matrix[2] * x + matrix[5] * y + matrix[8] * z,
    )


def clamp(value, low, high):
    return max(low, min(high, value))
