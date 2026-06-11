from __future__ import annotations

import tkinter as tk
from tkinter import ttk
from app.state import AppState

class DbEquipmentPanel(ttk.LabelFrame):
    def __init__(self, parent: tk.Widget, state: AppState) -> None:
        super().__init__(parent, text=" DB 공정 목록 ", padding=10)
        self.state = state
        
        self.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=(0, 10))
        self._create_widgets()
        
        # Subscribe
        self.state.subscribe_db_equipments_loaded(self._load_tree_data)
        self.state.subscribe_created_equipments_changed(self._update_create_button_state)

    def _create_widgets(self) -> None:
        # Table Treeview
        db_cols = ("ID", "전체 공정", "공정", "사용여부", "상태")
        self.db_tree = ttk.Treeview(self, columns=db_cols, show="headings", height=12)
        for col in db_cols:
            self.db_tree.heading(col, text=col)
            self.db_tree.column(col, width=60, anchor=tk.CENTER)
        self.db_tree.column("전체 공정", width=120, anchor=tk.W)
        self.db_tree.pack(fill=tk.BOTH, expand=True, pady=(0, 10))
        
        # Bind treeview select change
        self.db_tree.bind("<<TreeviewSelect>>", lambda e: self._update_create_button_state())

        # Create Button
        self.btn_create = ttk.Button(
            self, 
            text="선택 공정 생성", 
            command=self._create_equipment,
            style="Accent.TButton"
        )
        self.btn_create.pack(fill=tk.X)
        
        self.lbl_create_status = ttk.Label(self, text="", style="Caption.TLabel")
        self.lbl_create_status.pack(anchor=tk.W, pady=(5, 0))

    def _load_tree_data(self) -> None:
        for item in self.db_tree.get_children():
            self.db_tree.delete(item)

        for eq in self.state.dummy_equipments:
            self.db_tree.insert(
                "",
                tk.END,
                iid=eq["equipment_id"], # iid를 equipment_id로 지정하여 찾기 쉽게 함
                values=(
                    eq["equipment_id"],
                    eq["equipment_name"],
                    eq["process"],
                    eq["use_yn"],
                    eq["status"],
                )
            )
            
        self._update_create_button_state()

    def _get_selected_tree_id(self) -> str | None:
        selected_items = self.db_tree.selection()
        if not selected_items:
            return None
        return selected_items[0]

    def _update_create_button_state(self) -> None:
        selected_id = self._get_selected_tree_id()
        if not selected_id:
            self.btn_create.state(["disabled"])
            self.lbl_create_status.config(text="목록에서 공정을 선택해 주세요.")
            return

        # EQP-001 같은 마스터 ID가 들어가 있거나 하위 스텝(EQP-001-)이 생성되어 있는지 체크
        is_already_created = any(
            eq["equipment_id"] == selected_id or eq["equipment_id"].startswith(f"{selected_id}-")
            for eq in self.state.created_equipments
        )
        if is_already_created:
            self.btn_create.state(["disabled"])
            self.lbl_create_status.config(text="이미 생성된 공정(또는 스텝)입니다.", foreground="red")
        else:
            self.btn_create.state(["!disabled"])
            self.lbl_create_status.config(text="")

    def _create_equipment(self) -> None:
        selected_id = self._get_selected_tree_id()
        if selected_id:
            self.state.create_equipment(selected_id)
