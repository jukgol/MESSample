from __future__ import annotations

import json
import tkinter as tk
from tkinter import ttk, messagebox

# DUMMY EQUIPMENTS
DUMMY_EQUIPMENTS = [
    {
        "equipment_id": "EQP-001",
        "equipment_name": "투입 설비 1호기",
        "line": "LINE-A",
        "process": "투입",
        "use_yn": "Y",
        "status": "대기",
    },
    {
        "equipment_id": "EQP-002",
        "equipment_name": "가공 설비 1호기",
        "line": "LINE-A",
        "process": "가공",
        "use_yn": "Y",
        "status": "대기",
    },
    {
        "equipment_id": "EQP-003",
        "equipment_name": "검사 설비 1호기",
        "line": "LINE-B",
        "process": "검사",
        "use_yn": "Y",
        "status": "대기",
    },
]


class MESTestToolApp:
    def __init__(self, root: tk.Tk) -> None:
        self.root = root
        self.root.title("MES TestTool")
        self.root.geometry("1000x650")
        
        # State
        self.created_equipments: list[dict] = []
        self.selected_detail_id: str | None = None

        self._init_styles()
        self._create_layout()
        self._load_db_equipments()

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
        # Title block
        title_frame = ttk.Frame(self.root, padding=10)
        title_frame.pack(fill=tk.X)
        
        title_label = ttk.Label(title_frame, text="MES TestTool", style="Header.TLabel")
        title_label.pack(anchor=tk.W)
        
        caption_label = ttk.Label(
            title_frame, 
            text="DB 장비 목록에서 선택한 장비를 테스트 공정 그리드에 추가합니다.", 
            style="Caption.TLabel"
        )
        caption_label.pack(anchor=tk.W)

        # Main Body (Split Left & Right)
        body_frame = ttk.Frame(self.root, padding=10)
        body_frame.pack(fill=tk.BOTH, expand=True)

        # Left Column (DB Equipment List & Creation)
        left_frame = ttk.LabelFrame(body_frame, text=" DB 장비 목록 ", padding=10)
        left_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=(0, 10))

        # Select Box Combo
        combo_frame = ttk.Frame(left_frame)
        combo_frame.pack(fill=tk.X, pady=(0, 10))
        
        ttk.Label(combo_frame, text="생성할 장비: ").pack(side=tk.LEFT)
        self.combo_equipment = ttk.Combobox(combo_frame, state="readonly", width=30)
        self.combo_equipment.pack(side=tk.LEFT, padx=5, fill=tk.X, expand=True)
        self.combo_equipment.bind("<<ComboboxSelected>>", self._on_combo_select)

        # DB Equipment Treeview Table
        db_cols = ("ID", "장비명", "라인", "공정", "사용여부", "상태")
        self.db_tree = ttk.Treeview(left_frame, columns=db_cols, show="headings", height=10)
        for col in db_cols:
            self.db_tree.heading(col, text=col)
            self.db_tree.column(col, width=60, anchor=tk.CENTER)
        self.db_tree.column("장비명", width=120, anchor=tk.W)
        self.db_tree.pack(fill=tk.BOTH, expand=True, pady=(0, 10))

        # Create Button
        self.btn_create = ttk.Button(
            left_frame, 
            text="선택 장비 생성", 
            command=self._create_equipment,
            style="Accent.TButton"
        )
        self.btn_create.pack(fill=tk.X)
        self.lbl_create_status = ttk.Label(left_frame, text="", style="Caption.TLabel")
        self.lbl_create_status.pack(anchor=tk.W, pady=(5, 0))

        # Right Column (Process Grid)
        right_frame = ttk.LabelFrame(body_frame, text=" 생성된 공정 그리드 ", padding=10)
        right_frame.pack(side=tk.RIGHT, fill=tk.BOTH, expand=True)

        grid_cols = ("ID", "장비명", "라인", "공정", "상태", "OK / NG", "보기", "삭제")
        self.grid_tree = ttk.Treeview(right_frame, columns=grid_cols, show="headings")
        for col in grid_cols:
            self.grid_tree.heading(col, text=col)
            self.grid_tree.column(col, width=70, anchor=tk.CENTER)
        self.grid_tree.column("장비명", width=120, anchor=tk.W)
        self.grid_tree.pack(fill=tk.BOTH, expand=True, pady=(0, 10))
        
        # Double click to view, or bindings
        self.grid_tree.bind("<Double-1>", self._on_grid_double_click)

        # Right Grid Action buttons helper
        action_frame = ttk.Frame(right_frame)
        action_frame.pack(fill=tk.X)
        
        self.btn_view_detail = ttk.Button(action_frame, text="선택 상세 보기", command=self._view_selected_detail)
        self.btn_view_detail.pack(side=tk.LEFT, padx=(0, 5))
        
        self.btn_delete_equipment = ttk.Button(action_frame, text="선택 장비 삭제", command=self._delete_selected_equipment)
        self.btn_delete_equipment.pack(side=tk.LEFT)

        # Bottom Frame (Detail)
        bottom_frame = ttk.LabelFrame(self.root, text=" 장비 상세 ", padding=10)
        bottom_frame.pack(fill=tk.X, side=tk.BOTTOM, padx=10, pady=(0, 10))

        self.txt_detail = tk.Text(bottom_frame, height=6, font=("Consolas", 10), state=tk.DISABLED)
        self.txt_detail.pack(fill=tk.X)

    def _load_db_equipments(self) -> None:
        combo_values = []
        for eq in DUMMY_EQUIPMENTS:
            self.db_tree.insert(
                "",
                tk.END,
                values=(
                    eq["equipment_id"],
                    eq["equipment_name"],
                    eq["line"],
                    eq["process"],
                    eq["use_yn"],
                    eq["status"],
                )
            )
            combo_values.append(f"{eq['equipment_id']} / {eq['equipment_name']}")
        
        self.combo_equipment["values"] = combo_values
        if combo_values:
            self.combo_equipment.current(0)
            self._update_create_button_state()

    def _on_combo_select(self, event) -> None:
        self._update_create_button_state()

    def _get_selected_combo_id(self) -> str | None:
        val = self.combo_equipment.get()
        if not val:
            return None
        return val.split(" / ")[0]

    def _update_create_button_state(self) -> None:
        selected_id = self._get_selected_combo_id()
        if not selected_id:
            self.btn_create.state(["disabled"])
            self.lbl_create_status.config(text="")
            return

        is_already_created = any(eq["equipment_id"] == selected_id for eq in self.created_equipments)
        if is_already_created:
            self.btn_create.state(["disabled"])
            self.lbl_create_status.config(text="이미 생성된 장비입니다.", foreground="red")
        else:
            self.btn_create.state(["!disabled"])
            self.lbl_create_status.config(text="")

    def _create_equipment(self) -> None:
        selected_id = self._get_selected_combo_id()
        if not selected_id:
            return

        # Find dummy eq
        eq = next((item for item in DUMMY_EQUIPMENTS if item["equipment_id"] == selected_id), None)
        if not eq:
            return

        # Create
        new_eq = {
            **eq,
            "progress_status": "대기",
            "ok_count": 0,
            "ng_count": 0,
        }
        self.created_equipments.append(new_eq)
        
        self._refresh_grid()
        self._update_create_button_state()
        
        # Select newly created one
        self.selected_detail_id = selected_id
        self._update_detail_view()

    def _refresh_grid(self) -> None:
        # Clear
        for item in self.grid_tree.get_children():
            self.grid_tree.delete(item)
            
        # Re-populate
        for eq in self.created_equipments:
            self.grid_tree.insert(
                "",
                tk.END,
                iid=eq["equipment_id"],
                values=(
                    eq["equipment_id"],
                    eq["equipment_name"],
                    eq["line"],
                    eq["process"],
                    eq["progress_status"],
                    f"{eq['ok_count']} / {eq['ng_count']}",
                    "보기",
                    "삭제"
                )
            )

    def _on_grid_double_click(self, event) -> None:
        item_id = self.grid_tree.focus()
        if item_id:
            self.selected_detail_id = item_id
            self._update_detail_view()

    def _view_selected_detail(self) -> None:
        selected_items = self.grid_tree.selection()
        if not selected_items:
            messagebox.showinfo("알림", "그리드에서 상세 정보를 볼 장비를 선택해주세요.")
            return
        self.selected_detail_id = selected_items[0]
        self._update_detail_view()

    def _delete_selected_equipment(self) -> None:
        selected_items = self.grid_tree.selection()
        if not selected_items:
            messagebox.showinfo("알림", "삭제할 장비를 선택해주세요.")
            return
        
        eq_id = selected_items[0]
        self.created_equipments = [eq for eq in self.created_equipments if eq["equipment_id"] != eq_id]
        
        if self.selected_detail_id == eq_id:
            self.selected_detail_id = None
            
        self._refresh_grid()
        self._update_create_button_state()
        self._update_detail_view()

    def _update_detail_view(self) -> None:
        self.txt_detail.config(state=tk.NORMAL)
        self.txt_detail.delete("1.0", tk.END)
        
        if self.selected_detail_id is None:
            self.txt_detail.insert(tk.END, "공정 그리드에서 장비를 선택하고 [선택 상세 보기] 버튼을 클릭하세요.")
            self.txt_detail.config(state=tk.DISABLED)
            return

        eq = next((item for item in self.created_equipments if item["equipment_id"] == self.selected_detail_id), None)
        if not eq:
            self.txt_detail.insert(tk.END, "선택된 장비가 없습니다.")
            self.txt_detail.config(state=tk.DISABLED)
            return

        # Build json block like st.json
        detail_data = {
            "equipment_id": eq["equipment_id"],
            "equipment_name": eq["equipment_name"],
            "line": eq["line"],
            "process": eq["process"],
        }
        
        self.txt_detail.insert(tk.END, "상세 내용은 다음 단계에서 채웁니다.\n")
        self.txt_detail.insert(tk.END, json.dumps(detail_data, indent=4, ensure_ascii=False))
        self.txt_detail.config(state=tk.DISABLED)


def main() -> None:
    root = tk.Tk()
    app = MESTestToolApp(root)
    root.mainloop()


if __name__ == "__main__":
    main()
