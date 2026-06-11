from __future__ import annotations

import json
import urllib.request
import urllib.error
import tkinter as tk
from tkinter import ttk

# DEFAULT FALLBACK EQUIPMENTS
DEFAULT_DUMMY_EQUIPMENTS = [
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

# Shared Global State / API Fetch utility
class AppState:
    def __init__(self) -> None:
        self.dummy_equipments: list[dict] = []
        self.created_equipments: list[dict] = []
        self.selected_detail_id: str | None = None
        
        # Callbacks for component communication
        self.on_db_equipments_loaded_callbacks: list[callable] = []
        self.on_created_equipments_changed_callbacks: list[callable] = []
        self.on_selected_detail_changed_callbacks: list[callable] = []
        self.on_connection_status_changed_callbacks: list[callable] = []
        self.on_signal_received_callbacks: list[callable] = []

    def fetch_api_equipments(self) -> bool:
        url = "http://localhost:5175/api/plc/process-master"
        try:
            req = urllib.request.Request(url, method="GET")
            with urllib.request.urlopen(req, timeout=3) as response:
                data = json.loads(response.read().decode("utf-8"))
                
                self.dummy_equipments = []
                for idx, item in enumerate(data, start=1):
                    self.dummy_equipments.append({
                        "process_id": item.get("processID", idx), # API의 ProcessID 속성 저장
                        "equipment_id": item.get("processCode", f"EQP-{idx:03d}"),
                        "equipment_name": item.get("processName", f"설비 {idx}호기"),
                        "line": "LINE-A" if idx <= 2 else "LINE-B",
                        "process": item.get("processName", "미정"),
                        "use_yn": "Y",
                        "status": "대기",
                    })
            
            self._notify_connection_status(True)
            self._notify_db_equipments_loaded()
            return True
        except Exception:
            self.dummy_equipments = DEFAULT_DUMMY_EQUIPMENTS
            self._notify_connection_status(False)
            self._notify_db_equipments_loaded()
            return False

    # Event subscription
    def subscribe_db_equipments_loaded(self, callback: callable) -> None:
        self.on_db_equipments_loaded_callbacks.append(callback)

    def subscribe_created_equipments_changed(self, callback: callable) -> None:
        self.on_created_equipments_changed_callbacks.append(callback)

    def subscribe_selected_detail_changed(self, callback: callable) -> None:
        self.on_selected_detail_changed_callbacks.append(callback)

    def subscribe_connection_status_changed(self, callback: callable) -> None:
        self.on_connection_status_changed_callbacks.append(callback)

    def subscribe_signal_received(self, callback: callable) -> None:
        self.on_signal_received_callbacks.append(callback)

    def notify_signal_received(self, path: str, target_id: str | None) -> None:
        import datetime
        time_str = datetime.datetime.now().strftime("%H:%M:%S")
        for cb in self.on_signal_received_callbacks:
            try:
                cb(path, target_id, time_str)
            except Exception:
                pass

    # State modification and notification
    def _notify_db_equipments_loaded(self) -> None:
        for cb in self.on_db_equipments_loaded_callbacks:
            cb()

    def _notify_connection_status(self, is_connected: bool) -> None:
        for cb in self.on_connection_status_changed_callbacks:
            cb(is_connected)

    def select_detail(self, equipment_id: str | None) -> None:
        self.selected_detail_id = equipment_id
        for cb in self.on_selected_detail_changed_callbacks:
            cb(equipment_id)

    def create_equipment(self, equipment_id: str) -> None:
        eq = next((item for item in self.dummy_equipments if item["equipment_id"] == equipment_id), None)
        if not eq:
            return

        process_master_id = eq.get("process_id")
        
        # API를 통해 해당 마스터에 속한 스텝 목록 조회 시도
        steps = []
        if process_master_id is not None:
            url = f"http://localhost:5175/api/plc/process-master/{process_master_id}/steps"
            try:
                req = urllib.request.Request(url, method="GET")
                with urllib.request.urlopen(req, timeout=3) as response:
                    steps = json.loads(response.read().decode("utf-8"))
            except Exception:
                pass

        if steps:
            # API로부터 스텝 리스트를 성공적으로 받아온 경우
            last_added_id = None
            for step in steps:
                step_code = step.get('equipmentID') or step.get('equipmentId')
                if not step_code:
                    step_code = f"{eq['equipment_id']}-{step.get('stepID', step.get('seqNo'))}"
                
                # 중복 등록 방지
                if any(created["equipment_id"] == step_code for created in self.created_equipments):
                    continue
                    
                new_step = {
                    "process_id": process_master_id,
                    "process_master_name": eq["equipment_name"], # 전체 공정명 추가
                    "equipment_id": step_code,
                    "equipment_name": step.get('stepName', '스텝'), # EQP-001 - 면생성 대신 '면생성'만 저장하여 깔끔하게 노출
                    "process": step.get("stepType", eq["process"]),
                    "use_yn": "Y",
                    "status": "대기",
                    "progress_status": "대기",
                    "ok_count": 0,
                    "ng_count": 0,
                    "received_qty": 0,
                    "consumed_qty": 0,
                    "interval_sec": 5,
                    "is_running": False,
                    "step_id": step.get("stepID"),
                    "seq_no": step.get("seqNo"),
                    "description": step.get("description", "")
                }
                self.created_equipments.append(new_step)
                last_added_id = step_code
            
            if last_added_id:
                self.select_detail(last_added_id)
        else:
            # 스텝 API 연동이 실패했거나 스텝이 없는 경우, 마스터 정보 기준 1개 생성 (Fallback)
            if any(created["equipment_id"] == equipment_id for created in self.created_equipments):
                return
                
            new_eq = {
                **eq,
                "progress_status": "대기",
                "ok_count": 0,
                "ng_count": 0,
                "received_qty": 0,
                "consumed_qty": 0,
                "interval_sec": 5,
                "is_running": False,
            }
            self.created_equipments.append(new_eq)
            self.select_detail(equipment_id)
        
        for cb in self.on_created_equipments_changed_callbacks:
            cb()

    def _report_state_to_was(self, equipment_id: str, state: str) -> None:
        import datetime
        url = "http://localhost:5175/api/plc/equipment-data/state"
        payload = {
            "EquipmentID": equipment_id,
            "State": state,
            "OccurredAt": datetime.datetime.utcnow().isoformat() + "Z"
        }
        try:
            req = urllib.request.Request(
                url, 
                data=json.dumps(payload).encode("utf-8"),
                headers={"Content-Type": "application/json"},
                method="POST"
            )
            with urllib.request.urlopen(req, timeout=3) as response:
                pass
        except Exception as e:
            print(f"[TestTool] Failed to report state to WAS: {e}")

    def update_step_value(self, equipment_id: str, key: str, value: any) -> None:
        eq = next((item for item in self.created_equipments if item["equipment_id"] == equipment_id), None)
        if eq and key in eq:
            old_value = eq[key]
            eq[key] = value
            
            if key == "is_running" and old_value != value:
                self._report_state_to_was(equipment_id, "STARTED" if value else "STOPPED")
                
            for cb in self.on_created_equipments_changed_callbacks:
                cb()

    def remove_equipment(self, equipment_id: str) -> None:
        self.created_equipments = [eq for eq in self.created_equipments if eq["equipment_id"] != equipment_id]
        if self.selected_detail_id == equipment_id:
            self.select_detail(None)
            
        for cb in self.on_created_equipments_changed_callbacks:
            cb()

