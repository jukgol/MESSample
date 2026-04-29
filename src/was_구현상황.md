# WAS 구현 현황

## 프로젝트 개요
*   .NET 8 Web API / Oracle DB / Dapper

## 구현 기능
*   **Database**: DbUp을 이용한 마이그레이션 자동화 및 테이블 10종 생성
*   **API Automation**: 빌드 시 Swagger JSON 자동 추출 및 전용 Navigator 연결
*   **Table Manager**: 동적 쿼리를 통한 테이블 데이터 조회 및 행 추가 기능
*   **Schema Manager**: DB 스키마(사용자) 및 권한 조회 기능
*   **User Management**: 계정 생성, 수정, 삭제 및 역할(Role) 관리 API
*   **Auth**: JWT 기반 인증 체계 및 로그인 처리 로직 구현
*   **Utility**: DB 연결 상태 테스트 및 세션 유저 확인 기능

## 기술적 특이사항
*   **Swagger/OpenAPI**: 빌드 후 `src/api/swagger.json` 자동 생성 및 문서화 자동화
    *   `Swashbuckle.AspNetCore.Cli` 로컬 도구 활용
    *   `WAS.csproj`에 빌드 후 자동 추출 타겟(`GenerateSwagger`) 구성
*   **Dapper**: JSON 파라미터 변환 및 동적 쿼리 실행기(ScriptExecutor) 구축
*   **CORS**: 프론트엔드 및 외부 접속 허용을 위한 AllowAll 정책 적용
*   **Logging**: 실시간 시스템 로그 및 로깅 프로시저 연동 기반 마련

## 네이밍 및 데이터 매핑 규약
*   **DB ↔ C# ↔ Frontend 매핑 파이프라인 확립**:
    *   **DB**: 대문자 스네이크 케이스 사용 (예: `USER_ID`, `ROLE_CODE`)
    *   **C# (WAS)**: C# 표준 파스칼 케이스 사용 (예: `UserId`, `RoleCode`). DTO 모델도 반드시 파스칼 케이스 유지.
    *   **Frontend**: JS/TS 표준 카멜 케이스 사용 (예: `userId`, `roleCode`).
*   **자동 매핑 구현**:
    *   **Dapper**: `Dapper.DefaultTypeMap.MatchNamesWithUnderscores = true;`를 전역 적용하여 DB의 언더스코어(`_`) 표기법과 C#의 파스칼 케이스를 자동 매핑. (SQL에서 AS 별칭 사용 금지/불필요)
    *   **JSON 직렬화**: ASP.NET Core 기본 직렬화 정책(camelCase)을 사용하여, 서버의 파스칼 케이스 속성이 프론트엔드로 전달될 때 자동으로 카멜 케이스로 변환되도록 처리.
