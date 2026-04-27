# WAS 구현 현황

## 프로젝트 개요
*   .NET 8 Web API / Oracle DB

## 구현 기능
*   **Database**: DbUp을 이용한 마이그레이션 스크립트 자동 실행 (테이블 10종 자동 생성)
*   **Table Manager**: 테이블 목록 조회, 데이터 CRUD(조회/추가) API 구현
*   **Schema Manager**: DB 스키마(사용자) 및 권한 조회 API 구현
*   **User Management**: 사용자 계정 조회, 생성, 수정, 삭제 API 구현
*   **Log Monitoring**: 실시간 시스템 로그 조회 및 로깅 프로시저 배포 기능
*   **CORS**: 프론트엔드 접속 허용 설정 완료 (GET, POST, OPTIONS)

## 기술적 특이사항
*   **Dapper**: `JsonElement` 타입을 Dictionary로 변환하여 동적 쿼리 파라미터 처리
*   **Oracle Managed Data Access**: Oracle DB와의 고성능 연결 및 트랜잭션 관리
*   **Swagger/OpenAPI**: API 문서 자동화 및 테스트 환경 제공 (http://localhost:5175/swagger)
