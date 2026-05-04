# coding: UTF-8
import socket
import threading

from device_model import DeviceModel


class UdpService:
    """Receive sensor frames over UDP and dispatch parsed device updates."""

    FRAME_LEN = 54
    DEVICE_ID_LEN = 12

    def __init__(self, port, callback_method):
        self.port = port
        self.callback_method = callback_method
        self.socket = None
        self.isOpen = False
        self.deviceList = {}
        self._buffers = {}
        self._currentDeviceIds = {}
        self.tempBuffer = []
        self.currentDeviceId = ""
        self._thread = None

    def start(self):
        if self.isOpen:
            return

        self.socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        try:
            self.socket.bind(("0.0.0.0", self.port))
        except PermissionError as exc:
            self.socket.close()
            self.socket = None
            raise PermissionError(
                f"UDP port {self.port} cannot be opened. It is usually already used by "
                "another program, or blocked by Windows. Close the program using this "
                "port, or change the device forwarding port and DEVICE_PORT together."
            ) from exc
        except OSError as exc:
            self.socket.close()
            self.socket = None
            raise OSError(f"UDP port {self.port} bind failed: {exc}") from exc
        self.isOpen = True

        print(f"UDP server listening on 0.0.0.0:{self.port}")
        self._thread = threading.Thread(target=self.onReceive, name="UdpService", daemon=True)
        self._thread.start()

    def onReceive(self):
        while self.isOpen:
            try:
                data, address = self.socket.recvfrom(4096)
                if data:
                    self._feed_bytes(data, address)
            except OSError as exc:
                if self.isOpen:
                    print(f"UDP socket error: {exc}")
                break
            except Exception as exc:
                print(f"UDP receive error: {exc}")

    def _feed_bytes(self, data, address):
        address_key = f"{address[0]}:{address[1]}"
        temp_buffer = self._buffers.setdefault(address_key, [])
        current_device_id = self._currentDeviceIds.get(address_key, "")

        for value in data:
            temp_buffer.append(value)

            if len(temp_buffer) == 2 and (
                temp_buffer[0] != 0x42 or temp_buffer[1] != 0x53
            ):
                del temp_buffer[0]
                continue

            if len(temp_buffer) == self.DEVICE_ID_LEN:
                try:
                    current_device_id = bytes(temp_buffer).decode("ascii")
                except UnicodeDecodeError:
                    del temp_buffer[0]
                    current_device_id = ""
                    continue

                if current_device_id not in self.deviceList:
                    self.deviceList[current_device_id] = DeviceModel(
                        current_device_id, self.callback_method
                    )

            if len(temp_buffer) == self.FRAME_LEN:
                device = self.deviceList.get(current_device_id)
                if device:
                    device.lastAddress = address_key
                    device.onDataReceived(temp_buffer)
                temp_buffer.clear()
                current_device_id = ""

        self.tempBuffer = temp_buffer
        self.currentDeviceId = current_device_id
        if temp_buffer:
            self._currentDeviceIds[address_key] = current_device_id
        else:
            self._buffers.pop(address_key, None)
            self._currentDeviceIds.pop(address_key, None)

    def stop(self):
        self.isOpen = False

        if self.socket:
            try:
                self.socket.close()
            except OSError as exc:
                print(f"UDP socket close error: {exc}")
            finally:
                self.socket = None

        if self._thread and self._thread.is_alive() and threading.current_thread() != self._thread:
            self._thread.join(timeout=2)
