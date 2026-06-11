from __future__ import annotations

import tkinter as tk
from tkinter import ttk, messagebox
from app.state import AppState

class ProcessGridPanel(ttk.LabelFrame):
    def __init__(self, parent: tk.Widget, state: AppState) -> None:
        super().__init__(parent, text=" 생성된 공정 스텝 ", padding=10)
        self.state = state
        
        self.pack(side=tk.RIGHT, fill=tk.BOTH, expand=True)
        self._create_widgets()
        
        # Subscribe
        self.state.subscribe_created_equipments_changed(self._refresh_grid)

    def _create_widgets(self) -> None:
        # Table
        grid_cols = ("ID", "전체 공정", "스텝명", "공정(타입)", "상태", "OK / NG")
        self.grid_tree = ttk.Treeview(self, columns=grid_cols, show="headings")
        for col in grid_cols:
            self.grid_tree.heading(col, text=col)
            self.grid_tree.column(col, width=70, anchor=tk.CENTER)
        self.grid_tree.column("전체 공정", width=120, anchor=tk.W)
        self.grid_tree.column("스텝명", width=100, anchor=tk.W)
        self.grid_tree.pack(fill=tk.BOTH, expand=True, pady=(0, 10))
        
        # Double click bind
        self.grid_tree.bind("<Double-1>", self._on_grid_double_click)

        # Bottom actions
        action_frame = ttk.Frame(self)
        action_frame.pack(fill=tk.X)
        
        self.btn_view_detail = ttk.Button(action_frame, text="선택 스텝 보기", command=self._view_selected_detail)
        self.btn_view_detail.pack(side=tk.LEFT, padx=(0, 5))
        
        self.btn_delete_equipment = ttk.Button(action_frame, text="선택 스텝 삭제", command=self._delete_selected_equipment)
        self.btn_delete_equipment.pack(side=tk.LEFT)

    def _refresh_grid(self) -> None:
        # Clear
        for item in self.grid_tree.get_children():
            self.grid_tree.delete(item)
            
        # Re-populate
        for eq in self.state.created_equipments:
            self.grid_tree.insert(
                "",
                tk.END,
                iid=eq["equipment_id"],
                values=(
                    eq["equipment_id"],
                    eq.get("process_master_name", "미정"), # 라인 대신 전체 공정 표시
                    eq["equipment_name"],
                    eq["process"],
                    eq["progress_status"],
                    f"{eq['ok_count']} / {eq['ng_count']}"
                )
            )

    def _on_grid_double_click(self, event) -> None:
        item_id = self.grid_tree.focus()
        if item_id:
            self.state.select_detail(item_id)

    def _view_selected_detail(self) -> None:
        selected_items = self.grid_tree.selection()
        if not selected_items:
            messagebox.showinfo("알림", "그리드에서 상세 정보를 볼 스텝을 선택해주세요.")
            return
        self.state.select_detail(selected_items[0])

    def _delete_selected_equipment(self) -> None:
        selected_items = self.grid_tree.selection()
        if not selected_items:
            messagebox.showinfo("알림", "삭제할 스텝을 선택해주세요.")
            return
        
        eq_id = selected_items[0]
        self.state.remove_equipment(eq_id)
