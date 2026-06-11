# WAS 이력 조회 설계

## 1. 설계 목적

WAS에서 업무 이력을 조회하기 위한 API 설계를 정리한다.

현재 lot의 수량, 상태, 재고 정보는 lot 재고관리 화면과 `LotController`의 책임으로 둔다.

이력 조회 영역에서는 현재 상태를 수정하거나 관리하지 않고, 이미 발생한 업무 흐름을 조회하는 데 집중한다.

우선 조회 대상은 다음 두 가지로 제한한다.

- 작업지시 이력
- lot relation 이력
- lot trace 이력

lot relation과 lot trace는 둘 다 필요하지만, 역할을 분리한다.

lot relation은 lot 간의 직접 연결 데이터이다.

lot trace는 relation을 따라 부모 방향 또는 자식 방향으로 추적하는 조회 기능이다.

## 2. 컨트롤러 명칭

시스템 로그가 아니라 업무 이력 조회이므로 `LogController`보다는 `HistoryController` 계열 명칭을 사용한다.

추천 명칭은 다음과 같다.

```text
HistoryController
```

또는 범위를 더 명확히 하려면 다음처럼 나눌 수 있다.

```text
WorkOrderHistoryController
LotTraceHistoryController
```

현재 단계에서는 이력 조회 화면이 하나의 메뉴로 묶일 가능성이 높으므로, 단일 `HistoryController`로 시작하는 것이 적절하다.

## 3. 책임 범위

`HistoryController`는 조회 전용 컨트롤러로 둔다.

생성, 수정, 삭제 API는 두지 않는다.

업무 데이터 변경은 기존 업무 컨트롤러와 서비스에서 처리하고, 이력 조회 컨트롤러는 그 결과를 읽기만 한다.

역할은 다음과 같다.

```text
HistoryController
- 작업지시 이력 조회
- lot relation 조회
- lot trace 조회
```

작업지시별 공정 실행 이력은 작업지시 이력 조회의 상세 범위에 포함한다.

lot 기준 부모/자식 직접 관계와 공정 실행 기준 relation은 lot relation 조회의 검색 조건 또는 상세 범위에 포함한다.

lot 계보 추적은 lot trace 조회의 범위에 포함한다.

다음 항목은 이 컨트롤러의 책임에서 제외한다.

```text
lot 현재 재고 조회
lot stock 직접 변경
lot 생성/수정/삭제
stock history 직접 수정
작업지시 승인/취소 처리
```

## 4. 작업지시 이력 조회

작업지시 이력은 이미 생성된 작업지시와 그 작업지시에 연결된 공정 실행, 투입, 산출 정보를 조회하는 영역이다.

조회 목적은 다음과 같다.

- 어떤 작업지시가 언제 승인되었는지 확인
- 작업지시가 어떤 공정 단계로 실행되었는지 확인
- 각 공정에서 어떤 lot가 투입되었는지 확인
- 각 공정에서 어떤 lot가 산출되었는지 확인
- 작업지시 기준 생산 흐름을 시간순으로 확인

기본 조회 단위는 작업지시이다.

목록에서는 작업지시 번호, 공정 마스터, 지시 수량, 작업자, 승인일, 현재 또는 최종 상태 정도만 보여준다.

상세에서는 공정 실행 단위로 확장해서 보여준다.

상세 흐름은 다음처럼 구성한다.

```text
작업지시
-> 공정 실행 목록
-> 각 공정의 투입 lot 목록
-> 각 공정의 산출 lot 목록
```

## 5. 작업지시 이력 API 후보

작업지시 이력 API는 다음 정도로 시작한다.

```text
GET /api/History/work-orders
```

작업지시 이력 목록 조회.

검색 조건 후보는 다음과 같다.

- 작업지시 번호
- 공정 마스터 ID
- 작업자
- 승인 시작일
- 승인 종료일
- 상태

```text
GET /api/History/work-orders/{workOrderId}
```

작업지시 상세 이력 조회.

작업지시 기본 정보, 공정 실행 목록, 투입 lot, 산출 lot을 함께 반환한다.

```text
GET /api/History/work-orders/{workOrderId}/executions
```

작업지시의 공정 실행 이력만 별도로 조회한다.

상세 화면에서 필요한 경우 분리 조회용으로 사용한다.

## 6. LOT Relation 조회

lot relation 조회는 lot 간의 직접 관계를 확인하는 영역이다.

예를 들어 밀가루 lot1과 밀가루 lot2를 사용해서 면 lot3을 만들었다면, relation은 다음처럼 직접 연결된 여러 건으로 본다.

```text
밀가루 lot1 -> 면 lot3
밀가루 lot2 -> 면 lot3
```

relation 조회의 목적은 다음과 같다.

- 특정 산출 lot에 직접 연결된 투입 lot 확인
- 특정 투입 lot이 직접 영향을 준 산출 lot 확인
- 특정 공정 실행에서 생성된 직접 lot 관계 확인
- relation type, input qty, output qty, 생성 시점 확인

relation은 한 단계 관계만 보여준다.

즉 parent lot과 child lot의 직접 연결을 조회하는 기능이다.

## 7. LOT Relation API 후보

lot relation API는 다음 정도로 시작한다.

```text
GET /api/History/lots/relations
```

lot relation 목록 조회.

검색 조건 후보는 다음과 같다.

- parent lot 번호
- child lot 번호
- relation type
- 공정 실행 ID
- 생성 시작일
- 생성 종료일

```text
GET /api/History/lots/{lotId}/relations
```

특정 lot 기준 직접 relation 조회.

방향 옵션 후보는 다음과 같다.

```text
direction=parents
direction=children
direction=all
```

```text
GET /api/History/executions/{processStepExecutionId}/lot-relations
```

특정 공정 실행에서 발생한 직접 lot relation 조회.

## 8. LOT Trace 조회

lot trace 조회는 특정 lot이 어디서 왔고, 어디로 이어졌는지 확인하기 위한 영역이다.

현재 lot 재고 정보는 lot 재고관리에서 확인하므로, 이 화면에서는 계보와 관계를 중심으로 본다.

조회 목적은 다음과 같다.

- 특정 산출 lot이 어떤 투입 lot들로 만들어졌는지 확인
- 특정 투입 lot이 어떤 산출 lot들에 영향을 주었는지 확인
- 공정 실행 단위로 lot 관계를 확인
- 외부 입고, backfill, 공정 산출 등 lot 생성 출처를 확인

trace는 relation을 기반으로 lot 계보를 따라가는 조회로 본다.

투입 lot이 여러 개면 산출 lot 하나에 여러 relation이 연결되고, trace는 그 relation들을 따라 확장 조회한다.

예시는 다음과 같다.

```text
밀가루 lot1 -> 면 lot3
밀가루 lot2 -> 면 lot3
```

정확히 한 제품 단위의 원인을 구분할 수 없는 경우에는, 같은 공정 실행에 투입된 모든 lot을 산출 lot의 영향 lot으로 본다.

`LOT_TRACE`는 `LOT_STOCK_HISTORY`와 역할이 다르다.

`LOT_STOCK_HISTORY`는 수량이 언제 얼마만큼 변했는지를 보여준다.

`LOT_TRACE`는 어떤 lot이 어떤 lot으로 이어졌는지를 보여준다.

예를 들어 밀가루 lot1이 700 차감되고 면 lot3이 70 증가한 사실은 stock history에서 확인한다.

하지만 밀가루 lot1이 면 lot3의 원인이 되었다는 직접 관계는 lot relation에서 확인한다.

그리고 면 lot3이 다시 다른 반제품이나 완제품으로 이어졌는지 계속 따라가는 것은 lot trace에서 확인한다.

따라서 이력 조회 화면에서는 stock history와 별도로 lot relation, lot trace 조회가 모두 필요하다.

## 9. LOT Trace API 후보

lot trace API는 다음 정도로 시작한다.

```text
GET /api/History/lots/{lotId}/trace
```

특정 lot 기준 trace 조회.

부모 방향과 자식 방향을 함께 반환하거나, 옵션으로 방향을 지정할 수 있다.

방향 옵션 후보는 다음과 같다.

```text
direction=parents
direction=children
direction=all
```

```text
GET /api/History/lots/{lotId}/parents
```

특정 lot을 만들 때 영향을 준 부모 lot 목록 조회.

```text
GET /api/History/lots/{lotId}/children
```

특정 lot이 영향을 준 자식 lot 목록 조회.

```text
GET /api/History/lots/{lotId}/genealogy
```

특정 lot 기준 계보 조회.

relation을 재귀적으로 따라가 부모 계보 또는 자식 계보를 반환한다.

초기 구현에서는 재귀 깊이를 제한할 수 있다.

## 10. LOT Relation / Trace 화면 기준

lot relation/trace 화면은 현재 재고 화면과 분리한다.

현재 재고 화면은 lot별 현재 수량과 상태를 빠르게 확인하는 화면이다.

lot relation/trace 화면은 lot의 직접 관계와 계보를 따라가는 화면이다.

기본 화면 구성은 다음과 같다.

```text
검색 영역
- lot 번호
- relation type
- 공정 실행 ID
- 기간

relation 목록
- parent lot
- child lot
- relation type
- input qty
- output qty
- 공정 실행
- 생성일

상세 영역
- 선택한 lot의 부모 lot 목록
- 선택한 lot의 자식 lot 목록
- 선택한 lot의 상위 trace
- 선택한 lot의 하위 trace
- 관련 작업지시 또는 공정 실행 정보
```

처음 구현은 그래프 UI까지 가지 않고, 목록과 부모/자식 관계 조회만으로 충분하다.

나중에 필요하면 lot genealogy 그래프 화면으로 확장한다.

## 11. 서비스 구조

조회 전용 서비스는 `HistoryService`로 둔다.

컨트롤러는 `IHistoryService`를 주입받아 조회 결과만 반환한다.

권장 흐름은 다음과 같다.

```text
HistoryController
-> IHistoryService
-> HistoryService
-> SQL Script
-> Database
```

`HistoryService`는 lot 현재 수량 변경이나 작업지시 상태 변경을 수행하지 않는다.

현재 수량 변경은 `LotService`가 담당하고, 작업지시 처리는 `WorkOrderService`가 담당한다.

## 12. SQL 조회 기준

작업지시 이력은 기존 작업지시, 공정 실행, 투입, 산출 테이블을 조인해서 조회한다.

lot relation은 `LOT_TRACE` 테이블의 직접 parent-child 관계를 중심으로 부모 lot, 자식 lot, 품목, 공정 실행 정보를 조인한다.

lot trace는 relation 조회 결과를 기반으로 부모 방향 또는 자식 방향으로 확장 조회한다.

조회 SQL은 다음 영역으로 나눈다.

```text
Data/Scripts/Queries/App/History/WorkOrder
Data/Scripts/Queries/App/History/LotRelation
Data/Scripts/Queries/App/History/LotTrace
```

또는 단순하게 시작하려면 다음처럼 한 폴더에 둔다.

```text
Data/Scripts/Queries/App/History
```

현재 단계에서는 파일 수가 많지 않으므로 단일 `App/History` 폴더로 시작해도 충분하다.

## 13. DTO 구성

작업지시 이력 목록 DTO는 목록 표시용으로 가볍게 구성한다.

작업지시 상세 DTO는 작업지시 기본 정보와 공정 실행 목록을 포함한다.

공정 실행 DTO 안에는 투입 lot 목록과 산출 lot 목록을 포함할 수 있다.

lot relation DTO는 다음 정보를 포함한다.

- relation ID
- parent lot ID
- parent lot 번호
- parent item ID
- parent item 이름
- child lot ID
- child lot 번호
- child item ID
- child item 이름
- relation type
- input qty
- output qty
- process step execution ID
- 공정명 또는 step명
- ref type
- ref ID
- 생성일

lot trace 상세 DTO는 다음 구조를 고려한다.

```text
기준 lot
직접 parent relation 목록
직접 child relation 목록
상위 trace 목록
하위 trace 목록
관련 공정 실행 목록
```

## 14. 구현 순서 제안

1. `HistoryModels.cs` 추가
2. `IHistoryService`, `HistoryService` 추가
3. `HistoryController` 추가
4. 작업지시 이력 목록 SQL 추가
5. 작업지시 상세 SQL 추가
6. lot relation 목록 SQL 추가
7. lot 기준 부모/자식 relation SQL 추가
8. 공정 실행 기준 lot relation SQL 추가
9. lot 기준 trace/genealogy 조회 SQL 또는 서비스 로직 추가
10. swagger 빌드 확인
11. 프론트 이력 화면에서 API 연결

## 15. 현재 결론

이력 조회는 `Log`가 아니라 `History` 개념으로 간다.

현재 lot 재고 정보는 lot 재고관리 영역에서 본다.

history 영역에서는 다음 두 가지를 우선 구현한다.

- 작업지시 이력
- lot relation 이력
- lot trace 이력

컨트롤러는 조회 전용으로 두고, 데이터 변경은 기존 업무 서비스에 맡긴다.

lot relation과 lot trace는 stock history와 별도 책임으로 둔다.

stock history는 수량 변경을 설명한다.

lot relation은 부모 lot과 자식 lot의 직접 연결을 설명한다.

lot trace는 relation을 따라 lot 계보를 추적한다.
