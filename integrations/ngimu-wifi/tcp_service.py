# coding: UTF-8
import socket
import threading

from common import dispatch_frame, parse_frame_buffer


class TcpService:
    """Receive sensor frames over TCP and dispatch parsed device updates."""

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
        self._thread = threading.Thread(target=self._accept_loop, name="TcpService", daemon=True)
        self._thread.start()

    def _accept_loop(self):
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
        buf = bytearray()
        remote = f"{client_address[0]}:{client_address[1]}"

        try:
            with client_socket:
                while self.isOpen:
                    data = client_socket.recv(4096)
                    if not data:
                        break

                    def dispatch(frame, _r=remote):
                        dispatch_frame(frame, self.deviceList, self.callback_method, _r)

                    buf.extend(data)
                    parse_frame_buffer(buf, dispatch)
        except OSError as exc:
            if self.isOpen:
                print(f"TCP client error from {remote}: {exc}")
        except Exception as exc:
            print(f"TCP receive error from {remote}: {exc}")

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
