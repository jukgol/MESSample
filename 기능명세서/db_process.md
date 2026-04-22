# MES 제조 공정 DB 테이블 설계

> PCB 기판 제조 공정 기준 테스트용 설계입니다.

---

## 테이블 목록

| 테이블 | 역할 |
|---|---|
| ITEM | 자재/부품/완제품 종류 정의 (마스터) |
| LOT | 실제 입고된 묶음 단위 |
| PROCESS_STEP | 공정 단계 정의 (마스터) |
| PROCESS_LOG | LOT이 각 공정을 통과한 기록 |
| PROCESS_PARAM | 공정별 파라미터 (온도, 시간 등) |
| QC_RESULT | 품질 검사 결과 |
| SHIPMENT | 완제품 출하 기록 |

---

## 테이블 상세

### 1. ITEM — 자재 마스터

물건의 종류를 정의하는 테이블. 실제 입고 수량과는 무관하게 "어떤 물건인지"를 등록한다.

| 컬럼 | 타입 | 설명 |
|---|---|---|
| item_id | INT (PK, AUTO_INCREMENT) | 자재 고유 ID |
| item_name | VARCHAR(100) | 자재명 (예: PCB 기판 A타입) |
| category | VARCHAR(50) | 분류 (원자재 / 부품 / 반제품 / 완제품) |
| unit | VARCHAR(20) | 단위 (개, kg, m 등) |
| description | TEXT | 스펙 및 설명 |

---

### 2. LOT — 입고 단위

ITEM이 실제로 입고될 때마다 생성되는 묶음 단위. 같은 ITEM이라도 입고될 때마다 새 LOT이 생긴다.

| 컬럼 | 타입 | 설명 |
|---|---|---|
| lot_id | INT (PK, AUTO_INCREMENT) | LOT 고유 ID |
| item_id | INT (FK → ITEM) | 어떤 자재인지 |
| lot_no | VARCHAR(50) | LOT 번호 (바코드/QR 등에 사용) |
| qty | INT | 입고 수량 |
| received_at | DATETIME | 입고 일시 |
| status | VARCHAR(30) | 현재 상태 (입고대기 / 공정중 / 완료 / 출하완료) |

---

### 3. PROCESS_STEP — 공정 단계 정의

어떤 공정이 어떤 순서로 진행되는지 정의하는 마스터 테이블.

| 컬럼 | 타입 | 설명 |
|---|---|---|
| step_id | INT (PK, AUTO_INCREMENT) | 공정 단계 고유 ID |
| step_name | VARCHAR(100) | 공정명 (예: 세척, 건조, 외관검사) |
| seq_no | INT | 공정 순서 번호 |
| step_type | VARCHAR(30) | 단계 유형 (pre_process / main_process / qc) |
| description | TEXT | 공정 설명 |

---

### 4. PROCESS_LOG — 공정 처리 이력

LOT이 각 공정 단계를 통과할 때마다 생성되는 기록. MES의 핵심 테이블.

| 컬럼 | 타입 | 설명 |
|---|---|---|
| log_id | INT (PK, AUTO_INCREMENT) | 로그 고유 ID |
| lot_id | INT (FK → LOT) | 어떤 LOT인지 |
| step_id | INT (FK → PROCESS_STEP) | 어떤 공정 단계인지 |
| started_at | DATETIME | 공정 시작 일시 |
| ended_at | DATETIME | 공정 종료 일시 |
| operator | VARCHAR(50) | 작업자 |
| equipment_id | VARCHAR(50) | 사용 설비 ID |
| result | VARCHAR(30) | 처리 결과 (완료 / 실패 / 대기) |
| memo | TEXT | 비고 |

---

### 5. PROCESS_PARAM — 공정 파라미터

공정별로 다른 측정값을 저장하는 테이블. 컬럼을 추가하지 않고 key-value 구조로 유연하게 저장한다.

| 컬럼 | 타입 | 설명 |
|---|---|---|
| param_id | INT (PK, AUTO_INCREMENT) | 파라미터 고유 ID |
| log_id | INT (FK → PROCESS_LOG) | 어떤 공정 로그인지 |
| param_key | VARCHAR(50) | 파라미터 이름 (예: water_temp, humidity) |
| param_value | VARCHAR(100) | 파라미터 값 (예: 45, 3.2) |
| unit | VARCHAR(20) | 단위 (예: °C, %, 초) |

> **사용 예시 (세척 공정)**
>
> | log_id | param_key | param_value | unit |
> |---|---|---|---|
> | 1 | water_temp | 45 | °C |
> | 1 | detergent_conc | 3.2 | % |
> | 1 | wash_time | 120 | 초 |

---

### 6. QC_RESULT — 품질 검사 결과

공정 처리 후 진행하는 품질 검사 결과를 저장한다.

| 컬럼 | 타입 | 설명 |
|---|---|---|
| qc_id | INT (PK, AUTO_INCREMENT) | 검사 결과 고유 ID |
| log_id | INT (FK → PROCESS_LOG) | 어떤 공정 로그인지 |
| judgment | VARCHAR(10) | 판정 (PASS / FAIL) |
| defect_type | VARCHAR(50) | 불량 유형 (오염 / 스크래치 / 단락 등) |
| action | VARCHAR(20) | 처리 방법 (pass / rework / scrap) |
| inspector | VARCHAR(50) | 검사자 |
| memo | TEXT | 비고 |

---

### 7. SHIPMENT — 출하 기록

공정을 모두 마친 LOT을 고객에게 출하할 때 생성되는 기록.

| 컬럼 | 타입 | 설명 |
|---|---|---|
| ship_id | INT (PK, AUTO_INCREMENT) | 출하 고유 ID |
| lot_id | INT (FK → LOT) | 어떤 LOT인지 |
| order_id | VARCHAR(50) | 주문 번호 |
| qty | INT | 출하 수량 |
| shipped_at | DATETIME | 출하 일시 |

---

## 테이블 관계 요약

```
ITEM (1) ──── (N) LOT
LOT  (1) ──── (N) PROCESS_LOG
PROCESS_STEP (1) ──── (N) PROCESS_LOG
PROCESS_LOG (1) ──── (N) PROCESS_PARAM
PROCESS_LOG (1) ──── (0..1) QC_RESULT
LOT (1) ──── (N) SHIPMENT
```

---

## LOT 상태 흐름

```
입고대기 → 공정중 → 검사중 → 완료 → 출하완료
                        ↓
                    재작업 (rework) → 공정중으로 복귀
                        ↓
                    폐기 (scrap)
```

---

> **참고** — 이 설계는 테스트용 단순 구조입니다.
> 실운영 시에는 LOT 분할/병합, 설비(Equipment) 테이블, 작업자 권한 관리 등을 추가로 고려해야 합니다.