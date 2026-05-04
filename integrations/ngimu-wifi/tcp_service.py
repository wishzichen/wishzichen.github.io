# coding: UTF-8
import socket
import threading

from device_model import DeviceModel


class TcpService:
    """Receive sensor frames over TCP and dispatch parsed device updates."""

    FRAME_LEN = 54
    DEVICE_ID_LEN = 12

    def __init__(self, port, callback_method):
        self.port = port
        self.callback_method = callback_method
        self.socket = None
        self.isOpen = False
        self.deviceList = {}
        self._thread = None
        self._client_threads = []

    def start(self):
        if self.isOpen:
            return

        self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        try:
            self.socket.bind(("0.0.0.0", self.port))
        except PermissionError as exc:
            self.socket.close()
            self.socket = None
            raise PermissionError(
                f"TCP port {self.port} cannot be opened. It is usually already used by "
                "another program, or blocked by Windows. Close the program using this "
                "port, or change the device forwarding port and DEVICE_PORT together."
            ) from exc
        except OSError as exc:
            self.socket.close()
            self.socket = None
            raise OSError(f"TCP port {self.port} bind failed: {exc}") from exc
        self.socket.listen()
        self.isOpen = True

        print(f"TCP server listening on 0.0.0.0:{self.port}")
        self._thread = threading.Thread(target=self.onReceive, name="TcpService", daemon=True)
        self._thread.start()

    def onReceive(self):
        while self.isOpen:
            try:
                client_socket, client_address = self.socket.accept()
            except OSError as exc:
                if self.isOpen:
                    print(f"TCP socket error: {exc}")
                break

            print(f"Accepted TCP connection from {client_address[0]}:{client_address[1]}")
            thread = threading.Thread(
                target=self._handle_client,
                args=(client_socket, client_address),
                name=f"TcpClient-{client_address[0]}:{client_address[1]}",
                daemon=True,
            )
            self._client_threads.append(thread)
            thread.start()

    def _handle_client(self, client_socket, client_address):
        temp_buffer = []
        current_device_id = ""
        remote = f"{client_address[0]}:{client_address[1]}"

        try:
            with client_socket:
                while self.isOpen:
                    data = client_socket.recv(4096)
                    if not data:
                        break
                    current_device_id = self._feed_bytes(
                        data, temp_buffer, current_device_id, remote
                    )
        except OSError as exc:
            if self.isOpen:
                print(f"TCP client error from {remote}: {exc}")
        except Exception as exc:
            print(f"TCP receive error from {remote}: {exc}")

    def _feed_bytes(self, data, temp_buffer, current_device_id, remote):
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
                    device.lastAddress = remote
                    device.onDataReceived(temp_buffer)
                temp_buffer.clear()
                current_device_id = ""

        return current_device_id

    def stop(self):
        self.isOpen = False

        if self.socket:
            try:
                self.socket.close()
            except OSError as exc:
                print(f"TCP socket close error: {exc}")
            finally:
                self.socket = None

        if self._thread and self._thread.is_alive() and threading.current_thread() != self._thread:
            self._thread.join(timeout=2)
