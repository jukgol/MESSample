# WAS 구현 현황

---

## 프로젝트 개요
*   .NET 8 Web API / Oracle DB

---

## DB
*   DbUp: Migrations 스크립트 자동 실행 (테이블 자동 생성)
*   스키마/테이블/컬럼 정보 조회 API
*   동적 데이터 CRUD
*   프로시저 배포 및 로깅
*   사용자 관리(조회, 생성, 수정, 삭제) API 및 UI 구현
*   테이블: USER_INFO, USER_ROLE, TEST_USERS, ITEM, LOT, PROCESS_STEP, PROCESS_LOG, PROCESS_PARAM, QC_RESULT, SHIPMENT

## 기술적 특이사항
*   **Dapper**: `JsonElement` 타입을 SQL 파라미터로 직접 변환하지 못함. (Dictionary나 익명 객체로 변환하여 전달 필요)
