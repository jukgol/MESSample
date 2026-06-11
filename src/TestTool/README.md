# MES TestTool

MES 모니터링 화면 테스트를 위한 가짜 장비 생성 UI입니다.

## 실행

```powershell
poetry install
.\.venv\Scripts\streamlit.exe run app.py
```

또는 아래 스크립트로 실행한다.

```powershell
.\run.ps1
```

## 현재 범위

- 더미 DB 장비 목록 표시
- 장비 선택 후 공정 그리드에 추가
- 생성된 장비 제거
- 상세 영역은 자리만 준비
