from __future__ import annotations

import tkinter as tk
from tkinter import ttk
from http.server import HTTPServer, BaseHTTPRequestHandler
import urllib.parse
import threading
from app.state import AppState
from app.title_bar import TitleBar
from app.db_equipment_panel import DbEquipmentPanel
from app.process_grid_panel import ProcessGridPanel

class SignalHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        # Silence default request logging to keep console clean
        pass

    def do_GET(self):
        self._handle_request()

    def do_POST(self):
        self._handle_request()

    def _handle_request(self):
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path
        query = urllib.parse.parse_qs(parsed_url.query)
        
        app_state = self.server.app_state
        target_id = query.get("id", [None])[0]
        
        if path == "/start":
            if target_id:
                # Start specific step
                app_state.update_step_value(target_id, "is_running", True)
            else:
                # Start all steps
                for eq in app_state.created_equipments:
                    app_state.update_step_value(eq["equipment_id"], "is_running", True)
            app_state.notify_signal_received(path, target_id)
            self._send_response(200, f"Started step: {target_id if target_id else 'All'}")
        elif path == "/stop":
            if target_id:
                # Stop specific step
                app_state.update_step_value(target_id, "is_running", False)
            else:
                # Stop all steps
                for eq in app_state.created_equipments:
                    app_state.update_step_value(eq["equipment_id"], "is_running", False)
            app_state.notify_signal_received(path, target_id)
            self._send_response(200, f"Stopped step: {target_id if target_id else 'All'}")
        else:
            self._send_response(404, "Not Found")

    def _send_response(self, code: int, message: str):
        self.send_response(code)
        self.send_header("Content-Type", "text/plain; charset=utf-8")
        self.end_headers()
        self.wfile.write(message.encode("utf-8"))

class MESTestToolApp:
    def __init__(self, root: tk.Tk) -> None:
        self.root = root
        self.root.title("MES TestTool")
        self.root.geometry("1000x650")
        
        # State
        self.state = AppState()

        self._init_styles()
        self._create_layout()
        
        # Initial data fetch
        self.state.fetch_api_equipments()

        # Start background HTTP Signal Server
        self._start_signal_server()
        self.root.protocol("WM_DELETE_WINDOW", self._on_close)

    def _start_signal_server(self) -> None:
        try:
            self.signal_server = HTTPServer(("localhost", 9090), SignalHandler)
            self.signal_server.app_state = self.state
            
            # Start daemon thread
            self.server_thread = threading.Thread(target=self.signal_server.serve_forever, daemon=True)
            self.server_thread.start()
            print("[TestTool] HTTP Signal Server listening on http://localhost:9090")
        except Exception as e:
            print(f"[TestTool] Failed to start HTTP Signal Server: {e}")

    def _on_close(self) -> None:
        if hasattr(self, "signal_server"):
            print("[TestTool] Stopping HTTP Signal Server...")
            self.signal_server.shutdown()
            self.signal_server.server_close()
        self.root.destroy()

    def _init_styles(self) -> None:
        style = ttk.Style()
        style.theme_use("clam")
        
        # Configure Colors
        style.configure(".", font=("Malgun Gothic", 10))
        style.configure("Header.TLabel", font=("Malgun Gothic", 16, "bold"))
        style.configure("Subheader.TLabel", font=("Malgun Gothic", 12, "bold"))
        style.configure("Caption.TLabel", font=("Malgun Gothic", 9), foreground="gray")
        
        # Buttons
        style.configure("Accent.TButton", font=("Malgun Gothic", 10, "bold"))
        
        # Treeview styling
        style.configure("Treeview", font=("Malgun Gothic", 9), rowheight=25)
        style.configure("Treeview.Heading", font=("Malgun Gothic", 10, "bold"))

    def _create_layout(self) -> None:
        # 1. Top Title Bar
        self.title_bar = TitleBar(self.root, self.state)
        
        # 2. Main Body Frame (Contains Left & Right Panels)
        body_frame = ttk.Frame(self.root, padding=10)
        body_frame.pack(fill=tk.BOTH, expand=True)
        
        # 2-1. Left Panel (DB Equipment)
        self.db_panel = DbEquipmentPanel(body_frame, self.state)
        
        # 2-2. Right Panel (Process Grid)
        self.grid_panel = ProcessGridPanel(body_frame, self.state)



def main() -> None:
    root = tk.Tk()
    app = MESTestToolApp(root)
    root.mainloop()


if __name__ == "__main__":
    main()
