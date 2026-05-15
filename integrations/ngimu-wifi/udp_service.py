# coding: UTF-8
import socket
import threading

from common import dispatch_frame, parse_frame_buffer


class UdpService:
    """Receive sensor frames over UDP and dispatch parsed device updates."""

    def __init__(self, port, callback_method):
        self.port = port
        self.callback_method = callback_method
        self.socket = None
        self.isOpen = False
        self.deviceList = {}
        self._buffers = {}
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
        self._thread = threading.Thread(target=self._receive_loop, name="UdpService", daemon=True)
        self._thread.start()

    def _receive_loop(self):
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
        buf = self._buffers.setdefault(address_key, bytearray())
        buf.extend(data)

        def dispatch(frame):
            dispatch_frame(frame, self.deviceList, self.callback_method, address_key)

        parse_frame_buffer(buf, dispatch)

        if buf:
            self._buffers[address_key] = buf
        else:
            self._buffers.pop(address_key, None)

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
