# coding: UTF-8
import copy
import json
import mimetypes
import threading
import time
from collections import deque
from datetime import datetime
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, unquote, urlparse


class DeviceDataStore:
    """Thread-safe latest-data and history store for every device."""

    def __init__(self, history_limit=600):
        self.history_limit = history_limit
        self._lock = threading.RLock()
        self._devices = {}
        self._history = {}
        self._latest_device_id = None
        self._record_index = 0

    def update(self, device_model):
        device_id = device_model.deviceName

        with self._lock:
            existing = self._devices.get(device_id, {})
            address = getattr(device_model, "lastAddress", None) or existing.get("address")
            now_ts = time.time()
            now_text = datetime.now().isoformat(timespec="milliseconds")
            data = dict(device_model.deviceData)
            self._record_index += 1
            record_index = self._record_index
            snapshot = {
                "device_id": device_id,
                "address": address,
                "record_index": record_index,
                "last_seen": now_text,
                "last_seen_ts": now_ts,
                "data": data,
            }
            point = {
                "device_id": device_id,
                "address": address,
                "record_index": record_index,
                "time": data.get("Time"),
                "received_at": now_text,
                "ts": now_ts,
                "data": data,
            }

            if device_id not in self._history:
                self._history[device_id] = deque(maxlen=self.history_limit)
            self._history[device_id].append(point)
            self._apply_motion_corrections(device_id, device_model)
            self._devices[device_id] = snapshot
            self._latest_device_id = device_id
            return copy.deepcopy(snapshot)

    def _apply_motion_corrections(self, device_id, device_model):
        consume = getattr(device_model, "consume_motion_corrections", None)
        if not consume:
            return

        corrections = consume()
        if not corrections:
            return

        corrections_by_index = {
            correction.get("MotionSampleIndex"): correction
            for correction in corrections
            if correction.get("MotionSampleIndex") is not None
        }
        if not corrections_by_index:
            return

        for point in self._history.get(device_id, []):
            sample_index = point.get("data", {}).get("MotionSampleIndex")
            correction = corrections_by_index.get(sample_index)
            if correction:
                point["data"].update(correction)

    def list_devices(self):
        with self._lock:
            devices = sorted(self._devices.values(), key=lambda item: item["device_id"])
            return copy.deepcopy(devices)

    def get_device(self, device_id):
        with self._lock:
            snapshot = self._devices.get(device_id)
            return copy.deepcopy(snapshot) if snapshot else None

    def get_latest(self):
        with self._lock:
            if not self._latest_device_id:
                return None
            snapshot = self._devices.get(self._latest_device_id)
            return copy.deepcopy(snapshot) if snapshot else None

    def get_history(self, device_id, limit=None):
        with self._lock:
            points = list(self._history.get(device_id, []))
            if limit is not None and limit > 0:
                points = points[-limit:]
            return copy.deepcopy(points)

    def clear_history(self, device_id=None):
        with self._lock:
            if device_id:
                self._history.pop(device_id, None)
                return
            self._history.clear()


class DeviceApiRequestHandler(BaseHTTPRequestHandler):
    server_version = "DeviceApi/2.0"

    def do_OPTIONS(self):
        self.send_response(204)
        self._send_cors_headers()
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        parts = [unquote(part) for part in parsed.path.strip("/").split("/") if part]

        if not parts:
            return self._send_static("dashboard.html")

        if parts[0] == "static":
            return self._send_static("/".join(parts[1:]))

        if len(parts) >= 2 and parts[0] == "assets":
            return self._send_asset(parts[1], "/".join(parts[2:]))

        api_parts = parts[1:] if parts and parts[0] == "api" else parts
        return self._handle_api_get(api_parts, parse_qs(parsed.query))

    def do_DELETE(self):
        parsed = urlparse(self.path)
        parts = [unquote(part) for part in parsed.path.strip("/").split("/") if part]
        api_parts = parts[1:] if parts and parts[0] == "api" else parts

        if api_parts == ["history"]:
            self.server.store.clear_history()
            return self._send_json({"status": "ok"})

        if len(api_parts) == 3 and api_parts[0] == "devices" and api_parts[2] == "history":
            self.server.store.clear_history(api_parts[1])
            return self._send_json({"status": "ok", "device_id": api_parts[1]})

        self._send_json({"error": "not found"}, 404)

    def _handle_api_get(self, parts, query):
        store = self.server.store

        if not parts:
            return self._send_json(
                {
                    "status": "ok",
                    "endpoints": {
                        "dashboard": "/",
                        "health": "/api/health",
                        "latest": "/api/latest",
                        "devices": "/api/devices",
                        "device": "/api/devices/{device_id}",
                        "device_data": "/api/devices/{device_id}/data",
                        "device_history": "/api/devices/{device_id}/history?limit=300",
                    },
                }
            )

        if parts == ["health"]:
            return self._send_json(
                {
                    "status": "ok",
                    "device_count": len(store.list_devices()),
                    "latest": store.get_latest(),
                    "history_limit": store.history_limit,
                }
            )

        if parts == ["latest"]:
            latest = store.get_latest()
            if latest is None:
                return self._send_json({"error": "no device data received yet"}, 404)
            return self._send_json(latest)

        if parts == ["devices"]:
            return self._send_json({"devices": store.list_devices()})

        if len(parts) in (2, 3) and parts[0] == "devices":
            device_id = parts[1]
            device = store.get_device(device_id)
            if device is None:
                return self._send_json({"error": "device not found", "device_id": device_id}, 404)

            if len(parts) == 2:
                return self._send_json(device)

            if parts[2] == "data":
                return self._send_json(device["data"])

            if parts[2] == "history":
                limit = self._get_int_query(query, "limit", 300)
                return self._send_json(
                    {
                        "device_id": device_id,
                        "limit": limit,
                        "points": store.get_history(device_id, limit),
                    }
                )

        self._send_json({"error": "not found"}, 404)

    @staticmethod
    def _get_int_query(query, key, default):
        try:
            return int(query.get(key, [default])[0])
        except (TypeError, ValueError):
            return default

    def _send_static(self, relative_path):
        if not relative_path:
            relative_path = "dashboard.html"

        static_root = self.server.static_root.resolve()
        target = (static_root / relative_path).resolve()

        if static_root not in target.parents and target != static_root:
            return self._send_json({"error": "not found"}, 404)

        if not target.is_file():
            return self._send_json({"error": "not found"}, 404)

        content_type = self._content_type(target)
        body = target.read_bytes()
        self.send_response(200)
        self._send_cors_headers()
        self.send_header("Content-Type", content_type)
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _send_asset(self, group, relative_path):
        if not relative_path:
            return self._send_json({"error": "not found"}, 404)

        asset_root = self.server.asset_roots.get(group)
        if asset_root is None:
            return self._send_json({"error": "not found"}, 404)

        asset_root = asset_root.resolve()
        target = (asset_root / relative_path).resolve()

        if asset_root not in target.parents and target != asset_root:
            return self._send_json({"error": "not found"}, 404)

        if not target.is_file():
            return self._send_json({"error": "not found"}, 404)

        content_type = self._content_type(target, default="text/plain")
        body = target.read_bytes()
        self.send_response(200)
        self._send_cors_headers()
        self.send_header("Content-Type", content_type)
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _send_json(self, payload, status=200):
        body = json.dumps(payload, ensure_ascii=False, indent=2).encode("utf-8")
        self.send_response(status)
        self._send_cors_headers()
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    @staticmethod
    def _content_type(path, default="application/octet-stream"):
        content_type = mimetypes.guess_type(str(path))[0] or default
        text_suffixes = {".css", ".csv", ".html", ".js", ".json", ".md", ".svg", ".txt", ".xml"}
        if path.suffix.lower() in text_suffixes or content_type.startswith("text/"):
            return f"{content_type}; charset=utf-8"
        return content_type

    def log_message(self, format, *args):
        return


class DeviceApiServer:
    """Local HTTP API and dashboard server for sensor data."""

    def __init__(self, store, host="0.0.0.0", port=8000, static_root=None):
        self.store = store
        self.host = host
        self.port = port
        self.static_root = Path(static_root) if static_root else Path(__file__).parent / "web"
        project_root = Path(__file__).resolve().parent.parent
        self.asset_roots = {
            "3d": project_root / "NgimuGui" / "3DView",
        }
        self._httpd = None
        self._thread = None

    @property
    def local_url(self):
        port = self._httpd.server_address[1] if self._httpd else self.port
        host = "127.0.0.1" if self.host in ("", "0.0.0.0") else self.host
        return f"http://{host}:{port}"

    def start(self):
        if self._httpd:
            return

        self._httpd = ThreadingHTTPServer((self.host, self.port), DeviceApiRequestHandler)
        self._httpd.store = self.store
        self._httpd.static_root = self.static_root
        self._httpd.asset_roots = self.asset_roots
        self._thread = threading.Thread(
            target=self._httpd.serve_forever,
            name="DeviceApiServer",
            daemon=True,
        )
        self._thread.start()
        print(f"HTTP API and dashboard listening on {self.local_url}")

    def stop(self):
        if not self._httpd:
            return

        self._httpd.shutdown()
        self._httpd.server_close()
        self._httpd = None

        if self._thread and self._thread.is_alive():
            self._thread.join(timeout=2)
