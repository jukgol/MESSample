from __future__ import annotations

import streamlit as st


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


def init_state() -> None:
    if "created_equipments" not in st.session_state:
        st.session_state.created_equipments = []
    if "selected_detail_id" not in st.session_state:
        st.session_state.selected_detail_id = None


def find_equipment(equipment_id: str) -> dict | None:
    for equipment in DUMMY_EQUIPMENTS:
        if equipment["equipment_id"] == equipment_id:
            return equipment
    return None


def is_created(equipment_id: str) -> bool:
    return any(
        equipment["equipment_id"] == equipment_id
        for equipment in st.session_state.created_equipments
    )


def create_equipment(equipment_id: str) -> None:
    equipment = find_equipment(equipment_id)
    if equipment is None or is_created(equipment_id):
        return

    st.session_state.created_equipments.append(
        {
            **equipment,
            "progress_status": "대기",
            "ok_count": 0,
            "ng_count": 0,
        }
    )


def remove_equipment(equipment_id: str) -> None:
    st.session_state.created_equipments = [
        equipment
        for equipment in st.session_state.created_equipments
        if equipment["equipment_id"] != equipment_id
    ]

    if st.session_state.selected_detail_id == equipment_id:
        st.session_state.selected_detail_id = None


def render_db_equipment_list() -> None:
    st.subheader("DB 장비 목록")

    selected_id = st.selectbox(
        "생성할 장비",
        options=[equipment["equipment_id"] for equipment in DUMMY_EQUIPMENTS],
        format_func=lambda equipment_id: (
            f"{equipment_id} / {find_equipment(equipment_id)['equipment_name']}"
        ),
    )

    st.dataframe(
        DUMMY_EQUIPMENTS,
        use_container_width=True,
        hide_index=True,
        column_config={
            "equipment_id": "장비 ID",
            "equipment_name": "장비명",
            "line": "라인",
            "process": "공정",
            "use_yn": "사용 여부",
            "status": "상태",
        },
    )

    disabled = is_created(selected_id)
    if st.button("선택 장비 생성", disabled=disabled, use_container_width=True):
        create_equipment(selected_id)
        st.rerun()

    if disabled:
        st.caption("이미 생성된 장비입니다.")


def render_process_grid() -> None:
    st.subheader("생성된 공정 그리드")

    if not st.session_state.created_equipments:
        st.info("생성된 장비가 없습니다. DB 장비 목록에서 장비를 선택해 생성하세요.")
        return

    header = st.columns([1.1, 1.7, 1.0, 1.0, 1.0, 1.0, 0.8, 0.8])
    header[0].markdown("**장비 ID**")
    header[1].markdown("**장비명**")
    header[2].markdown("**라인**")
    header[3].markdown("**공정**")
    header[4].markdown("**상태**")
    header[5].markdown("**OK / NG**")
    header[6].markdown("**상세**")
    header[7].markdown("**제거**")

    for equipment in st.session_state.created_equipments:
        row = st.columns([1.1, 1.7, 1.0, 1.0, 1.0, 1.0, 0.8, 0.8])
        row[0].write(equipment["equipment_id"])
        row[1].write(equipment["equipment_name"])
        row[2].write(equipment["line"])
        row[3].write(equipment["process"])
        row[4].write(equipment["progress_status"])
        row[5].write(f'{equipment["ok_count"]} / {equipment["ng_count"]}')

        if row[6].button("보기", key=f'detail-{equipment["equipment_id"]}'):
            st.session_state.selected_detail_id = equipment["equipment_id"]

        if row[7].button("삭제", key=f'remove-{equipment["equipment_id"]}'):
            remove_equipment(equipment["equipment_id"])
            st.rerun()


def render_detail() -> None:
    st.subheader("장비 상세")

    selected_id = st.session_state.selected_detail_id
    if selected_id is None:
        st.info("공정 그리드에서 상세를 선택하면 이 영역에 표시됩니다.")
        return

    equipment = next(
        (
            item
            for item in st.session_state.created_equipments
            if item["equipment_id"] == selected_id
        ),
        None,
    )

    if equipment is None:
        st.info("선택된 장비가 없습니다.")
        return

    st.write("상세 내용은 다음 단계에서 채웁니다.")
    st.json(
        {
            "equipment_id": equipment["equipment_id"],
            "equipment_name": equipment["equipment_name"],
            "line": equipment["line"],
            "process": equipment["process"],
        }
    )


def main() -> None:
    st.set_page_config(page_title="MES TestTool", layout="wide")
    init_state()

    st.title("MES TestTool")
    st.caption("DB 장비 목록에서 선택한 장비를 테스트 공정 그리드에 추가합니다.")

    left, right = st.columns([1.0, 1.6])
    with left:
        render_db_equipment_list()

    with right:
        render_process_grid()

    st.divider()
    render_detail()


if __name__ == "__main__":
    main()
