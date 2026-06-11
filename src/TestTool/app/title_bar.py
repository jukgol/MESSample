from __future__ import annotations

import tkinter as tk
from tkinter import ttk
from app.state import AppState

class TitleBar(ttk.Frame):
    def __init__(self, parent: tk.Widget, state: AppState) -> None:
        super().__init__(parent, padding=10)
        self.state = state
        
        self.pack(fill=tk.X)
        self._create_widgets()
        
        # Subscribe to connection status changes and signal received events
        self.state.subscribe_connection_status_changed(self._update_status_bulb)
        self.state.subscribe_signal_received(self._on_signal_received)

    def _create_widgets(self) -> None:
        # Left side (Title & Description)
        text_frame = ttk.Frame(self)
        text_frame.pack(side=tk.LEFT, fill=tk.X, expand=True)

        title_label = ttk.Label(text_frame, text="MES TestTool", style="Header.TLabel")
        title_label.pack(anchor=tk.W)
        
        caption_label = ttk.Label(
            text_frame, 
            text="DB 공정 목록에서 선택한 공정을 테스트 공정 스텝에 추가합니다.", 
            style="Caption.TLabel"
        )
        caption_label.pack(anchor=tk.W)

        # Right side (Server Connection & Reconnect)
        conn_frame = ttk.Frame(self)
        conn_frame.pack(side=tk.RIGHT, padx=5)

        ttk.Label(conn_frame, text="서버 연결: ").pack(side=tk.LEFT, padx=(0, 2))
        
        # Connection status light
        self.canvas_status = tk.Canvas(conn_frame, width=16, height=16, highlightthickness=0)
        self.canvas_status.pack(side=tk.LEFT, padx=(0, 10))
        self.status_bulb = self.canvas_status.create_oval(2, 2, 14, 14, fill="red")

        self.btn_reconnect = ttk.Button(conn_frame, text="재연결", command=self._reconnect_api, width=8)
        self.btn_reconnect.pack(side=tk.LEFT)

        # Middle-right side (Signal server status & Last received API)
        signal_frame = ttk.Frame(self)
        signal_frame.pack(side=tk.RIGHT, padx=20)

        self.lbl_server_info = ttk.Label(
            signal_frame, 
            text="로컬 신호 포트: 9090 (대기 중)", 
            font=("Malgun Gothic", 9, "bold"), 
            foreground="darkgreen"
        )
        self.lbl_server_info.pack(anchor=tk.E)

        self.lbl_last_signal = ttk.Label(
            signal_frame, 
            text="최근 수신 신호: 없음", 
            style="Caption.TLabel"
        )
        self.lbl_last_signal.pack(anchor=tk.E)

    def _update_status_bulb(self, is_connected: bool) -> None:
        color = "green2" if is_connected else "red"
        self.canvas_status.itemconfig(self.status_bulb, fill=color)

    def _on_signal_received(self, path: str, target_id: str | None, time_str: str) -> None:
        target = f" ({target_id})" if target_id else " (전체)"
        text = f"최근 수신 신호: {path}{target} [{time_str}]"
        self.after(0, lambda: self.lbl_last_signal.config(text=text, foreground="blue2"))

    def _reconnect_api(self) -> None:
        from tkinter import messagebox
        self.btn_reconnect.state(["disabled"])
        success = self.state.fetch_api_equipments()
        self.btn_reconnect.state(["!disabled"])
        
        if success:
            messagebox.showinfo("알림", "서버 연결에 성공하여 장비 목록을 갱신하였습니다.")
        else:
            messagebox.showwarning("경고", "서버 연결에 실패하였습니다. 백엔드(WAS) 서버 상태를 확인해 주세요.")
