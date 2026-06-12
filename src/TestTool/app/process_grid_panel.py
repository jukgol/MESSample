from __future__ import annotations

import tkinter as tk
from tkinter import ttk
import random
from app.state import AppState

class ProcessGridPanel(ttk.LabelFrame):
    def __init__(self, parent: tk.Widget, state: AppState) -> None:
        super().__init__(parent, text=" 생성된 공정 스텝 ", padding=10)
        self.state = state
        self.cards = {}  # eq_id -> {lbl_recv, lbl_cons, var_interval, lbl_timer, btn_toggle}
        self.timers = {}  # eq_id -> after_id
        self.elapsed_times = {}  # eq_id -> current elapsed seconds (int)
        self.current_cols = 2
        
        self.pack(fill=tk.BOTH, expand=True)
        self._create_widgets()
        
        # Subscribe
        self.state.subscribe_created_equipments_changed(self._refresh_grid)

    def _create_widgets(self) -> None:
        # Create a Canvas and Vertical Scrollbar
        self.canvas = tk.Canvas(self, borderwidth=0, highlightthickness=0)
        self.scrollbar = ttk.Scrollbar(self, orient="vertical", command=self.canvas.yview)
        
        self.scrollable_frame = ttk.Frame(self.canvas)
        
        self.scrollable_frame.bind(
            "<Configure>",
            lambda e: self.canvas.configure(
                scrollregion=self.canvas.bbox("all")
            )
        )
        
        self.canvas_window = self.canvas.create_window((0, 0), window=self.scrollable_frame, anchor="nw")
        self.canvas.configure(yscrollcommand=self.scrollbar.set)
        
        # Pack canvas and scrollbar
        self.scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        self.canvas.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        
        # Bind canvas resize to handle responsiveness and stretching
        self.canvas.bind("<Configure>", self._on_canvas_configure)
        
        # Support mouse wheel scrolling
        def _on_mousewheel(event):
            self.canvas.yview_scroll(int(-1 * (event.delta / 120)), "units")
        
        self.canvas.bind("<MouseWheel>", _on_mousewheel)
        self.scrollable_frame.bind("<MouseWheel>", _on_mousewheel)

    def _on_canvas_configure(self, event) -> None:
        self.canvas.itemconfig(self.canvas_window, width=event.width)
        
        card_width_with_padding = 220
        new_cols = max(1, event.width // card_width_with_padding)
        
        if self.current_cols != new_cols:
            self.current_cols = new_cols
            self._redraw_grid()

    def _refresh_grid(self) -> None:
        current_ids = {eq["equipment_id"] for eq in self.state.created_equipments}
        existing_ids = set(self.cards.keys())

        if current_ids != existing_ids:
            self._redraw_grid()
        else:
            self._update_cards_in_place()

    def _update_cards_in_place(self) -> None:
        for eq in self.state.created_equipments:
            eq_id = eq["equipment_id"]
            if eq_id in self.cards:
                widgets = self.cards[eq_id]
                if "lbl_qty" in widgets:
                    widgets["lbl_qty"].config(text=f"물품 수량: {eq.get('produced_qty', 0)} / {eq.get('target_qty', 0)} EA")
                if "lbl_target" in widgets:
                    widgets["lbl_target"].config(text=f"공정 횟수: {eq.get('current_runs', 0)} / {eq.get('target_runs', 0)} 회")
                
                is_running = eq.get("is_running", True)
                widgets["btn_toggle"].config(
                    text="ON" if is_running else "OFF",
                    bg="green3" if is_running else "red"
                )
                
                # Check timer synchronization (Start/Stop timer if state changed externally)
                if is_running and eq_id not in self.timers:
                    self._start_simulation_timer(eq_id)
                elif not is_running and eq_id in self.timers:
                    self.after_cancel(self.timers[eq_id])
                    del self.timers[eq_id]
                    self.elapsed_times[eq_id] = 0
                    widgets["lbl_timer"].config(text=" (정지)", foreground="grey")
                
                try:
                    current_input_interval = float(widgets["var_interval"].get())
                    if current_input_interval != eq["interval_sec"]:
                        widgets["var_interval"].set(str(eq["interval_sec"]))
                except ValueError:
                    pass

    def _update_card_labels(self, eq_id: str, produced_qty: int, target_qty: int, current_runs: int, target_runs: int) -> None:
        if eq_id in self.cards:
            if "lbl_qty" in self.cards[eq_id]:
                self.cards[eq_id]["lbl_qty"].config(text=f"물품 수량: {produced_qty} / {target_qty} EA")
            if "lbl_target" in self.cards[eq_id]:
                self.cards[eq_id]["lbl_target"].config(text=f"공정 횟수: {current_runs} / {target_runs} 회")

    def _toggle_simulation(self, eq_id: str) -> None:
        eq = next((item for item in self.state.created_equipments if item["equipment_id"] == eq_id), None)
        if not eq:
            return

        new_state = not eq.get("is_running", True)
        self.state.update_step_value(eq_id, "is_running", new_state)

        if new_state:
            # Start timer
            self._start_simulation_timer(eq_id)
        else:
            # Stop timer
            if eq_id in self.timers:
                self.after_cancel(self.timers[eq_id])
                del self.timers[eq_id]
            self.elapsed_times[eq_id] = 0
            if eq_id in self.cards:
                self.cards[eq_id]["lbl_timer"].config(text=" (정지)", foreground="grey")

        # Update button visual directly
        if eq_id in self.cards:
            self.cards[eq_id]["btn_toggle"].config(
                text="ON" if new_state else "OFF",
                bg="green3" if new_state else "red"
            )

    def _start_simulation_timer(self, eq_id: str) -> None:
        if eq_id in self.timers:
            self.after_cancel(self.timers[eq_id])
            del self.timers[eq_id]

        eq = next((item for item in self.state.created_equipments if item["equipment_id"] == eq_id), None)
        if not eq or not eq.get("is_running", True):
            return

        self.elapsed_times[eq_id] = 0
        if eq_id in self.cards:
            self.cards[eq_id]["lbl_timer"].config(text=" (0초)", foreground="blue")

        def tick():
            current_eq = next((item for item in self.state.created_equipments if item["equipment_id"] == eq_id), None)
            if not current_eq or not current_eq.get("is_running", True):
                if eq_id in self.timers:
                    del self.timers[eq_id]
                if eq_id in self.elapsed_times:
                    del self.elapsed_times[eq_id]
                return
            
            self.elapsed_times[eq_id] = self.elapsed_times.get(eq_id, 0) + 1
            interval_limit = current_eq.get("interval_sec", 5)

            if eq_id in self.cards:
                self.cards[eq_id]["lbl_timer"].config(
                    text=f" ({self.elapsed_times[eq_id]}초)", 
                    foreground="red" if self.elapsed_times[eq_id] >= interval_limit else "blue"
                )

            if self.elapsed_times[eq_id] >= interval_limit:
                self.elapsed_times[eq_id] = 0
                
                # Increment current runs and produced qty (1-to-1 assumption but decoupled)
                next_runs = current_eq.get("current_runs", 0) + 1
                next_qty = current_eq.get("produced_qty", 0) + 1
                
                current_eq["current_runs"] = next_runs
                current_eq["produced_qty"] = next_qty
                
                target_runs_limit = current_eq.get("target_runs", 0)
                target_qty_limit = current_eq.get("target_qty", 0)
                
                is_done = False
                event_type = "PRODUCED"
                
                if target_qty_limit > 0 and next_qty >= target_qty_limit:
                    event_type = "COMPLETED"
                    is_done = True
                
                self._update_card_labels(
                    eq_id, 
                    next_qty,
                    target_qty_limit,
                    next_runs, 
                    target_runs_limit
                )
                
                # Report production event to WAS in a background thread to prevent UI lag
                import threading
                threading.Thread(
                    target=lambda: self.state.report_production_to_was(eq_id, event_type, 1),
                    daemon=True
                ).start()
                
                if is_done:
                    # Target achieved, stop the simulation
                    self.state.update_step_value(eq_id, "is_running", False)
                    return
                
                if eq_id in self.cards:
                    self.cards[eq_id]["lbl_timer"].config(text=" (0초)", foreground="blue")
            
            self.timers[eq_id] = self.after(1000, tick)

        self.timers[eq_id] = self.after(1000, tick)

    def _redraw_grid(self) -> None:
        # Clear removed timers
        current_ids = {eq["equipment_id"] for eq in self.state.created_equipments}
        removed_ids = set(self.timers.keys()) - current_ids
        for eq_id in removed_ids:
            self.after_cancel(self.timers[eq_id])
            del self.timers[eq_id]
            if eq_id in self.elapsed_times:
                del self.elapsed_times[eq_id]

        # Destroy existing widgets
        for child in self.scrollable_frame.winfo_children():
            child.destroy()
        self.cards.clear()

        cols = self.current_cols

        # Rebuild layout (dynamic responsive grid columns)
        for i, eq in enumerate(self.state.created_equipments):
            eq_id = eq["equipment_id"]
            is_running = eq.get("is_running", True)
            
            master_name = eq.get("process_master_name", eq.get("equipment_name", eq_id))
            card_title = f" {master_name} ({eq_id}) "
            
            # Card
            card = ttk.LabelFrame(self.scrollable_frame, text=card_title, padding=8)
            card.grid(row=i // cols, column=i % cols, padx=6, pady=6, sticky="nsew")
            
            # Header Frame (Step Name & Delete Button inline)
            header_frame = ttk.Frame(card)
            header_frame.pack(fill=tk.X, pady=(0, 5))
            
            lbl_name = ttk.Label(header_frame, text=eq["equipment_name"], font=("Malgun Gothic", 10, "bold"))
            lbl_name.pack(side=tk.LEFT, anchor=tk.W)
            
            # Delete Button
            btn_delete = ttk.Button(
                header_frame,
                text="X",
                width=2,
                command=lambda eid=eq_id: self.state.remove_equipment(eid),
                style="Accent.TButton"
            )
            btn_delete.pack(side=tk.RIGHT, anchor=tk.E)
            
            # Start / Stop Toggle Button
            btn_toggle = tk.Button(
                header_frame,
                text="ON" if is_running else "OFF",
                bg="green3" if is_running else "red",
                fg="white",
                font=("Malgun Gothic", 8, "bold"),
                width=3,
                relief="flat",
                bd=0,
                cursor="hand2",
                command=lambda eid=eq_id: self._toggle_simulation(eid)
            )
            btn_toggle.pack(side=tk.RIGHT, anchor=tk.E, padx=(0, 4))
            
            # Divider
            ttk.Separator(card, orient="horizontal").pack(fill=tk.X, pady=4)
            
            # Qty Info Frame (Compact list)
            # Qty Info Frame (Compact list)
            info_frame = ttk.Frame(card)
            info_frame.pack(fill=tk.X, pady=3)
            
            lbl_qty = ttk.Label(
                info_frame,
                text=f"물품 수량: {eq.get('produced_qty', 0)} / {eq.get('target_qty', 0)} EA",
                font=("Malgun Gothic", 9)
            )
            lbl_qty.pack(anchor=tk.W)

            lbl_target = ttk.Label(
                info_frame, 
                text=f"공정 횟수: {eq.get('current_runs', 0)} / {eq.get('target_runs', 0)} 회", 
                font=("Malgun Gothic", 9)
            )
            lbl_target.pack(anchor=tk.W)
            
            # Interval config frame (Inline)
            interval_frame = ttk.Frame(card)
            interval_frame.pack(fill=tk.X, pady=(4, 0))
            
            ttk.Label(interval_frame, text="인터벌(초): ", font=("Malgun Gothic", 9)).pack(side=tk.LEFT)
            
            var_interval = tk.StringVar(value=str(eq.get("interval_sec", 5)))
            entry_interval = ttk.Entry(interval_frame, textvariable=var_interval, width=5)
            entry_interval.pack(side=tk.LEFT, padx=(2, 0))
            
            # Live countdown/elapsed timer label
            lbl_timer = ttk.Label(interval_frame, text=" (0초)", font=("Malgun Gothic", 9, "bold"), foreground="blue")
            lbl_timer.pack(side=tk.LEFT, padx=(3, 0))
            
            # Bind Entry updates
            def make_on_change(eid, var):
                def on_change(*args):
                    try:
                        val = float(var.get())
                        if val < 1:
                            val = 1
                        self.state.update_step_value(eid, "interval_sec", val)
                        self._start_simulation_timer(eid)
                    except ValueError:
                        pass
                return on_change
            
            on_change_func = make_on_change(eq_id, var_interval)
            entry_interval.bind("<FocusOut>", lambda e, f=on_change_func: f())
            entry_interval.bind("<Return>", lambda e, f=on_change_func: f())
            
            # Save reference
            self.cards[eq_id] = {
                "card": card,
                "lbl_qty": lbl_qty,
                "lbl_target": lbl_target,
                "var_interval": var_interval,
                "lbl_timer": lbl_timer,
                "btn_toggle": btn_toggle,
            }
            
            # Bind mouse wheel to card children so scrolling works everywhere
            for w in [card, header_frame, lbl_name, info_frame, lbl_qty, lbl_target, interval_frame, lbl_timer]:
                w.bind("<MouseWheel>", lambda e: self.canvas.yview_scroll(int(-1 * (e.delta / 120)), "units"))
            
            # Start timer if not already running and it is active
            if is_running:
                if eq_id not in self.timers:
                    self._start_simulation_timer(eq_id)
            else:
                lbl_timer.config(text=" (정지)", foreground="grey")

        # Configure columns with minsize to prevent squishing
        for col_idx in range(cols):
            self.scrollable_frame.grid_columnconfigure(col_idx, minsize=210, weight=1)
        for col_idx in range(cols, 10):
            self.scrollable_frame.grid_columnconfigure(col_idx, minsize=0, weight=0)
