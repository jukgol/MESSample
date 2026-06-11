from __future__ import annotations

import tkinter as tk
from tkinter import ttk
from app.state import AppState
from app.title_bar import TitleBar
from app.db_equipment_panel import DbEquipmentPanel
from app.process_grid_panel import ProcessGridPanel
from app.equipment_detail_panel import EquipmentDetailPanel

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
        
        # 3. Bottom Panel (Detail View)
        self.detail_panel = EquipmentDetailPanel(self.root, self.state)


def main() -> None:
    root = tk.Tk()
    app = MESTestToolApp(root)
    root.mainloop()


if __name__ == "__main__":
    main()
