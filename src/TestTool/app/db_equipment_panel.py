from __future__ import annotations

import tkinter as tk
from tkinter import ttk
from app.state import AppState

class DbEquipmentPanel(ttk.LabelFrame):
    def __init__(self, parent: tk.Widget, state: AppState) -> None:
        super().__init__(parent, text=" DB 공정 템플릿 목록 (가로 스크롤) ", padding=10)
        self.state = state
        self.cards = {}
        
        self.pack(side=tk.TOP, fill=tk.X, pady=(0, 10))
        self._create_widgets()
        
        # Subscribe
        self.state.subscribe_db_equipments_loaded(self._load_cards_data)
        self.state.subscribe_created_equipments_changed(self._update_all_buttons_state)

    def _create_widgets(self) -> None:
        # Create canvas for horizontal scrolling
        bg_color = ttk.Style().lookup("TFrame", "background") or "#f0f0f0"
        self.canvas = tk.Canvas(self, borderwidth=0, highlightthickness=0, height=105, bg=bg_color)
        self.scrollbar = ttk.Scrollbar(self, orient="horizontal", command=self.canvas.xview)
        
        self.scrollable_frame = ttk.Frame(self.canvas)
        
        self.scrollable_frame.bind(
            "<Configure>",
            lambda e: self.canvas.configure(
                scrollregion=self.canvas.bbox("all")
            )
        )
        
        self.canvas_window = self.canvas.create_window((0, 0), window=self.scrollable_frame, anchor="nw")
        self.canvas.configure(xscrollcommand=self.scrollbar.set)
        
        # Pack canvas and scrollbar
        self.scrollbar.pack(side=tk.BOTTOM, fill=tk.X)
        self.canvas.pack(side=tk.TOP, fill=tk.BOTH, expand=True)
        
        # Bind mouse wheel for horizontal scroll on DB panel
        def _on_mousewheel(event):
            self.canvas.xview_scroll(int(-1 * (event.delta / 120)), "units")
            
        self.canvas.bind("<MouseWheel>", _on_mousewheel)
        self.scrollable_frame.bind("<MouseWheel>", _on_mousewheel)

    def _load_cards_data(self) -> None:
        # Clear existing
        for child in self.scrollable_frame.winfo_children():
            child.destroy()
        self.cards.clear()
        
        # Rebuild DB template cards horizontally
        for i, eq in enumerate(self.state.dummy_equipments):
            eq_id = eq["equipment_id"]
            
            # DB Card
            card = ttk.Frame(self.scrollable_frame, padding=6, relief="groove", borderwidth=1)
            card.grid(row=0, column=i, padx=5, pady=2, sticky="ns")
            
            # Title (Step Type / Line)
            lbl_title = ttk.Label(card, text=eq["equipment_name"], font=("Malgun Gothic", 9, "bold"))
            lbl_title.pack(anchor=tk.W, pady=(0, 2))
            
            # Code Label
            lbl_code = ttk.Label(card, text=f"코드: {eq_id}", style="Caption.TLabel")
            lbl_code.pack(anchor=tk.W, pady=(0, 4))
            
            # Add Button
            btn_add = ttk.Button(
                card,
                text="스텝 추가 +",
                width=10,
                command=lambda eid=eq_id: self.state.create_equipment(eid),
                style="Accent.TButton"
            )
            btn_add.pack(fill=tk.X)
            
            self.cards[eq_id] = btn_add
            
            # Bind wheel
            for w in [card, lbl_title, lbl_code]:
                w.bind("<MouseWheel>", lambda e: self.canvas.xview_scroll(int(-1 * (e.delta / 120)), "units"))
                
        self._update_all_buttons_state()

    def _update_all_buttons_state(self) -> None:
        for eq_id, btn in self.cards.items():
            # Check if this ID or step with prefix is already created
            is_already_created = any(
                eq["equipment_id"] == eq_id or eq["equipment_id"].startswith(f"{eq_id}-")
                for eq in self.state.created_equipments
            )
            if is_already_created:
                btn.state(["disabled"])
                btn.config(text="추가 완료")
            else:
                btn.state(["!disabled"])
                btn.config(text="스텝 추가 +")
