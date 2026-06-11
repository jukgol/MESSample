# Frontend 이력 화면 설계 및 구현 계획

본 문서는 `HistoryController.cs`에서 제공하는 3가지 API를 Frontend에 통합하고, "로그 / 이력" 메뉴 하위에 각각의 카테고리를 추가하여 목록 형태로 정보를 시각화하기 위한 설계안이다.

---

## 1. 대상 API 및 데이터 구조

`HistoryController`는 조회 전용 API로 다음 3가지 엔드포인트를 제공한다.

### ① 작업지시 이력 (`GET /api/History/work-orders`)
- **설명**: 완료되거나 진행된 작업지시의 전체 목록 조회
- **반환 데이터 (`WorkOrderHistoryDto`)**:
  - `workOrderID` (int): 작업지시 ID
  - `workOrderNo` (string): 작업지시 번호
  - `processMasterID` (int): 공정 마스터 ID
  - `processMasterName` (string): 공정 마스터 이름
  - `orderQty` (int): 지시 수량
  - `workerName` (string): 작업자 이름
  - `status` (string): 상태
  - `approvedAt` (string/DateTime): 승인 일시
  - `createdAt` (string/DateTime): 생성 일시

### ② LOT 관계 이력 (`GET /api/History/lot-relations`)
- **설명**: 원자재와 반제품/완제품 간의 부모-자식 관계 목록 조회
- **반환 데이터 (`LotRelationHistoryDto`)**:
  - `lotRelationID` (int): 관계 ID
  - `parentLotNo` (string): 부모 LOT 번호
  - `parentItemName` (string): 부모 품목명
  - `childLotNo` (string): 자식 LOT 번호
  - `childItemName` (string): 자식 품목명
  - `relationType` (string): 관계 유형 (예: 투입, 산출)
  - `inputQty` (int?): 투입 수량
  - `outputQty` (int): 산출 수량
  - `workOrderNo` (string): 연관 작업지시 번호
  - `stepName` (string): 공정 단계명
  - `createdAt` (string/DateTime): 생성 일시

### ③ LOT 추적 이력 (`GET /api/History/lots/{lotId}/trace`)
- **설명**: 특정 LOT 기준의 상하위 계보(Trace Depth, Direction)를 추적하여 조회
- **파라미터**: `lotId` (조회할 LOT의 ID)
- **반환 데이터 (`LotTraceHistoryDto`)**:
  - `LotRelationHistoryDto` 상속
  - `direction` (string): 추적 방향 (`FORWARD`, `BACKWARD` 등)
  - `traceDepth` (int): 추적 깊이

---

## 2. Frontend 메뉴 및 라우팅 설계

### ① Sidebar (`Sidebar.tsx`) 수정
"로그 / 이력" 대메뉴 하위에 3개의 서브 카테고리를 구성한다.

- **로그 / 이력** (`/dashboard/history`)
  - **작업지시 이력**: `/dashboard/history/work-orders` (권한: ADMIN, VIEWER)
  - **LOT 관계 이력**: `/dashboard/history/lot-relations` (권한: ADMIN, VIEWER)
  - **LOT 추적 이력**: `/dashboard/history/lot-trace` (권한: ADMIN, VIEWER)

### ② 라우터 (`DashboardRoutes.tsx`) 수정
새로운 경로에 해당하는 컴포넌트를 라우터에 등록한다.

- `/dashboard/history/work-orders` -> `<WorkOrderHistoryList />`
- `/dashboard/history/lot-relations` -> `<LotRelationHistoryList />`
- `/dashboard/history/lot-trace` -> `<LotTraceHistoryList />`

---

## 3. UI/UX 디자인 설계

프리미엄 MES 테마(어두운 모드, 부드러운 그라데이션, Glassmorphism 카드 스타일 등)에 어울리도록 구현한다.

### ① 작업지시 이력 화면 (`WorkOrderHistoryList.tsx`)
- **검색 필터**: 작업지시 번호, 작업자명, 상태별 필터링 기능 제공
- **목록 테이블**: Tailwind CSS 대신 프로젝트에 정의된 Vanilla CSS(Premium Card, Table 스타일 등)를 기반으로 작성
- **상태 배지**: 승인 여부, 상태(`COMPLETED`, `RUNNING`, `CREATED` 등)를 직관적이고 미려한 색상의 배지로 표현

### ② LOT 관계 이력 화면 (`LotRelationHistoryList.tsx`)
- **검색 필터**: 부모 LOT 번호, 자식 LOT 번호, 품목명 검색
- **목록 테이블**: 투입/산출 관계를 명확히 구분할 수 있도록 칩(Chip) 형태로 표시
- **연결 흐름 시각화**: 부모 LOT에서 자식 LOT로 연결되는 흐름을 텍스트 및 간결한 화살표 아이콘(`lucide-react` 사용)으로 목록 내에서 매핑

### ③ LOT 추적 이력 화면 (`LotTraceHistoryList.tsx`)
- **LOT 선택**: 상단에 검색 및 선택이 가능한 LOT 드롭다운 또는 입력 필드 제공
- **계보 추적 테이블**: 선택된 LOT의 조상(Parent) 및 후손(Child)을 깊이(`traceDepth`)와 방향(`direction`)에 따라 계층적으로 정렬하여 목록으로 시각화
- **시각적 트리/라인 표시**: Tree 구조의 깊이를 들여쓰기(Padding-left) 및 연결 라인 기호(`└─`, `├─`)를 활용해 텍스트 기반으로 가독성 극대화

---

## 4. 데이터 흐름 및 API 클라이언트 갱신

1. **Swagger 빌드**: `dotnet build src/WAS/WAS.csproj`를 통해 `src/api/swagger.json` 최신화
2. **API Client 생성**: `src/Frontend` 폴더에서 `npm run generate-api`를 실행하여 `src/Frontend/src/api` 내의 API 서비스 파일들 자동 생성
3. **React Query / API Hook 사용**:
   - 새로 생성된 `History` API 클라이언트를 호출하여 데이터를 React State 또는 Query로 관리

---

## 5. 작업 순서

1. **API 생성**:
   - WAS 빌드 후 `npm run generate-api` 실행을 통해 프론트엔드 API 클라이언트에 `History` 관련 메서드 확보
2. **라우터 및 사이드바 설정**:
   - `Sidebar.tsx`에 신규 서브 카테고리 추가 (경로: `/dashboard/history/...`)
   - `DashboardRoutes.tsx`에 라우트 규칙 설정
3. **컴포넌트 개발**:
   - `src/Frontend/src/features/history` 폴더 구조 생성
   - 작업지시 이력, LOT 관계 이력, LOT 추적 이력 컴포넌트 각각 구현
4. **스타일링 및 UX 폴리싱**:
   - `index.css`에 정의된 프리미엄 스타일 적극 활용
   - 로딩 스피너 및 에러 바운더리 등 예외 처리 추가
