# 사용자(User) DB 테이블 설계 (테스트용 간소화)

> 시스템 접속 및 기본 권한 관리를 위한 사용자 정보입니다.

---

## 테이블 목록

| 테이블 | 역할 |
|---|---|
| USER_INFO | 사용자 기본 정보 및 로그인 정보 |
| USER_ROLE | 시스템 접근 권한 정의 |

---

## 상세 설계

### 1. USER_INFO (사용자 정보)

| 컬럼 | 타입 | Null | 제약 조건 | 설명 |
|---|---|---|---|---|
| user_id | INT | N | PK, AUTO_INC | 시스템 내부 식별용 고유 번호 |
| login_id | VARCHAR(50) | N | UNIQUE | 로그인 아이디 |
| password | VARCHAR(255) | N | | 암호화된 비밀번호 |
| user_name | VARCHAR(100) | N | | 사용자 실명 |
| role_code | VARCHAR(20) | N | FK | `USER_ROLE.role_code` 참조 |
| is_active | CHAR(1) | N | DEFAULT 'Y' | 계정 활성 상태 (Y/N) |
| failed_login_count | INT | N | DEFAULT 0 | 로그인 실패 횟수 (성공 시 0으로 초기화) |
| last_login_at | DATETIME | Y | | 마지막 로그인 일시 |
| created_at | DATETIME | N | DEFAULT NOW() | 계정 생성 일시 |
| updated_at | DATETIME | Y | | 정보 수정 일시 |

### 2. USER_ROLE (권한 마스터)

| 컬럼 | 타입 | Null | 제약 조건 | 설명 |
|---|---|---|---|---|
| role_code | VARCHAR(20) | N | PK | 권한 코드 (예: ADMIN, USER) |
| role_name | VARCHAR(100) | N | | 권한 명칭 (예: 관리자, 일반사용자) |
| description | VARCHAR(255) | Y | | 권한 상세 설명 |
