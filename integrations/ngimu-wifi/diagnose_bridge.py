# coding: UTF-8
import argparse
import socket
import subprocess
from dataclasses import dataclass


DEFAULT_DEVICE_PORT = 1399
DEFAULT_GUI_PORT = 8000
DEFAULT_API_PORT = 18000
COMMON_PORTS = [1399, 8000, 18000, 9250]


@dataclass
class Endpoint:
    protocol: str
    local_address: str
    local_port: int
    pid: str
    process_name: str = ""


def parse_args(argv=None):
    parser = argparse.ArgumentParser(
        description="Diagnose BS-WF91/NGIMU bridge ports and show the recommended wiring."
    )
    parser.add_argument("--device-port", type=int, default=DEFAULT_DEVICE_PORT)
    parser.add_argument("--gui-port", type=int, default=DEFAULT_GUI_PORT)
    parser.add_argument("--api-port", type=int, default=DEFAULT_API_PORT)
    parser.add_argument(
        "--extra-port",
        type=int,
        action="append",
        default=[],
        help="Additional port to inspect. Can be provided more than once.",
    )
    return parser.parse_args(argv)


def run_command(command):
    try:
        return subprocess.run(
            command,
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            check=False,
        ).stdout
    except OSError:
        return ""


def process_name(pid):
    if not pid or pid == "0":
        return ""
    output = run_command(
        [
            "powershell",
            "-NoProfile",
            "-Command",
            f"(Get-Process -Id {pid} -ErrorAction SilentlyContinue).ProcessName",
        ]
    ).strip()
    return output


def udp_endpoints():
    output = run_command(["netstat", "-ano", "-p", "udp"])
    endpoints = []
    for line in output.splitlines():
        parts = line.split()
        if len(parts) < 4 or parts[0].upper() != "UDP":
            continue
        local = parts[1]
        pid = parts[-1]
        address, port = split_address_port(local)
        if port is not None:
            endpoints.append(Endpoint("UDP", address, port, pid))
    return endpoints


def tcp_endpoints():
    output = run_command(["netstat", "-ano", "-p", "tcp"])
    endpoints = []
    for line in output.splitlines():
        parts = line.split()
        if len(parts) < 5 or parts[0].upper() != "TCP":
            continue
        state = parts[3].upper()
        if state != "LISTENING":
            continue
        local = parts[1]
        pid = parts[-1]
        address, port = split_address_port(local)
        if port is not None:
            endpoints.append(Endpoint("TCP", address, port, pid))
    return endpoints


def split_address_port(value):
    value = value.strip()
    if value.startswith("["):
        end = value.rfind("]:")
        if end == -1:
            return value, None
        address = value[1:end]
        port_text = value[end + 2 :]
    else:
        address, _, port_text = value.rpartition(":")
    try:
        return address, int(port_text)
    except ValueError:
        return address, None


def local_ipv4_addresses():
    addresses = []
    output = run_command(
        [
            "powershell",
            "-NoProfile",
            "-Command",
            "Get-NetIPAddress -AddressFamily IPv4 | "
            "Where-Object { $_.IPAddress -notlike '127.*' -and $_.IPAddress -notlike '169.254.*' } | "
            "Sort-Object -Property PrefixOrigin,InterfaceMetric,IPAddress | "
            "Select-Object -ExpandProperty IPAddress",
        ]
    )
    for line in output.splitlines():
        address = line.strip()
        if address and address not in addresses:
            addresses.append(address)

    hostname = socket.gethostname()
    try:
        for item in socket.getaddrinfo(hostname, None, socket.AF_INET):
            address = item[4][0]
            if address not in addresses and not address.startswith("127."):
                addresses.append(address)
    except socket.gaierror:
        pass
    return addresses


def print_endpoints(port, endpoints):
    matched = [endpoint for endpoint in endpoints if endpoint.local_port == port]
    if not matched:
        print(f"  {port}: free")
        return
    for endpoint in matched:
        endpoint.process_name = process_name(endpoint.pid)
        owner = f"{endpoint.process_name} (PID {endpoint.pid})" if endpoint.process_name else f"PID {endpoint.pid}"
        print(f"  {port}: used by {owner} via {endpoint.protocol} {endpoint.local_address}:{endpoint.local_port}")


def main(argv=None):
    args = parse_args(argv)
    ports = sorted(set(COMMON_PORTS + [args.device_port, args.gui_port, args.api_port] + args.extra_port))
    endpoints = udp_endpoints() + tcp_endpoints()
    local_ips = local_ipv4_addresses()

    print("=== BS-WF91 / NGIMU bridge diagnosis ===")
    print()
    print("Local IPv4 candidates for BS-IMU configuration:")
    if local_ips:
        for address in local_ips:
            print(f"  {address}")
    else:
        print("  no non-loopback IPv4 address detected")
    print()
    print("Port usage:")
    for port in ports:
        print_endpoints(port, endpoints)

    print()
    print("Recommended wiring:")
    print(f"  BS-IMU config software -> set device forwarding to UDP <your IPv4>:{args.device_port}")
    print(f"  Python bridge -> listens for BS frames on UDP {args.device_port}")
    print(f"  NGIMU GUI -> open UDP connection with receive port {args.gui_port}")
    print(f"  Web dashboard -> http://127.0.0.1:{args.api_port}/")
    print()

    device_port_users = [endpoint for endpoint in endpoints if endpoint.local_port == args.device_port]
    if device_port_users:
        print(f"WARNING: device port {args.device_port} is already used. Choose another port or close the owning program.")

    default_conflict = [
        endpoint
        for endpoint in endpoints
        if endpoint.local_port == 1399 and endpoint.process_name.lower().startswith("bs-imu")
    ]
    if default_conflict:
        print("NOTE: bs-imu.exe is using 1399. The bridge also listens on 1399 by default.")
        print("      If BS-IMU is open, close it before starting the bridge, or change the bridge port.")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
