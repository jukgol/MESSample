-- [중요] 이 스크립트는 반드시 SYSTEM 이나 SYS 계정으로 접속해서 실행하세요!
-- [사용] C##MYUSER 계정에 필요한 모든 권한을 일괄 부여합니다.

-- 1. 기본 접속 및 리소스 관리 권한 부여
GRANT CONNECT, RESOURCE TO C##MYUSER;

-- 2. 실제 데이터를 저장할 수 있는 공간(Quota) 할당 (중요!)
ALTER USER C##MYUSER QUOTA UNLIMITED ON USERS;

-- 3. 테이블 및 프로시저 생성 권한 직접 부여
GRANT CREATE TABLE TO C##MYUSER;
GRANT CREATE PROCEDURE TO C##MYUSER;
GRANT CREATE VIEW TO C##MYUSER;

-- 4. 다른 사람의 테이블을 조회할 수 있는 권한 (필요시)
-- GRANT SELECT ANY TABLE TO C##MYUSER;

-- 5. 계정 잠금 해제 (혹시 잠겨있을 경우 대비)
ALTER USER C##MYUSER ACCOUNT UNLOCK;

COMMIT;

-- [확인] 권한 부여 결과 확인
SELECT * FROM DBA_TAB_PRIVS WHERE GRANTEE = 'C##MYUSER';
