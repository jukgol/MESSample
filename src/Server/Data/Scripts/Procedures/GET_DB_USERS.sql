-- =============================================
-- Author:      Antigravity (AI Assistant)
-- Create date: 2026-04-14
-- Description: DB 계정 정보를 조회하는 프로시저 (SYSTEM 계정 권한 필요)
-- =============================================
CREATE OR REPLACE PROCEDURE GET_DB_USERS (
    O_CURSOR OUT SYS_REFCURSOR
) AS
BEGIN
    OPEN O_CURSOR FOR
        SELECT 
            USERNAME, 
            ACCOUNT_STATUS, 
            CREATED, 
            LAST_LOGIN,
            DEFAULT_TABLESPACE
        FROM 
            DBA_USERS
        ORDER BY 
            USERNAME ASC;
END;
/
