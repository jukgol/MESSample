from __future__ import annotations

import json
import tkinter as tk
from tkinter import ttk
from app.state import AppState

class EquipmentDetailPanel(ttk.LabelFrame):
    def __init__(self, parent: tk.Widget, state: AppState) -> None:
        super().__init__(parent, text=" 스텝 상세 ", padding=10)
        self.state = state
        
        self.pack(fill=tk.X, side=tk.BOTTOM, padx=10, pady=(0, 10))
        self._create_widgets()
        
        # Subscribe
        self.state.subscribe_selected_detail_changed(self._update_detail_view)

    def _create_widgets(self) -> None:
        self.txt_detail = tk.Text(self, height=6, font=("Consolas", 10), state=tk.DISABLED)
        self.txt_detail.pack(fill=tk.X)
        self._update_detail_view(None)

    def _update_detail_view(self, selected_detail_id: str | None) -> None:
        self.txt_detail.config(state=tk.NORMAL)
        self.txt_detail.delete("1.0", tk.END)
        
        if selected_detail_id is None:
            self.txt_detail.insert(tk.END, "공정 스텝에서 스텝을 선택하고 [선택 스텝 보기] 버튼을 클릭하거나 더블 클릭하세요.")
            self.txt_detail.config(state=tk.DISABLED)
            return

        eq = next((item for item in self.state.created_equipments if item["equipment_id"] == selected_detail_id), None)
        if not eq:
            self.txt_detail.insert(tk.END, "선택된 스텝이 없습니다.")
            self.txt_detail.config(state=tk.DISABLED)
            return

        detail_data = {
            "step_id": eq.get("step_id", eq["equipment_id"]),
            "step_name": eq["equipment_name"],
            "process_master_name": eq.get("process_master_name", "미정"), # line 대신 전체 공정 표시
            "step_type": eq["process"],
            "seq_no": eq.get("seq_no", 1),
            "description": eq.get("description", "")
        }
        
        self.txt_detail.insert(tk.END, "상세 내용은 다음 단계에서 채웁니다.\n")
        self.txt_detail.insert(tk.END, json.dumps(detail_data, indent=4, ensure_ascii=False))
        self.txt_detail.config(state=tk.DISABLED)
