-- =============================================
-- Author:      Gemini CLI
-- Create date: 2026-04-15
-- Description: 현재 접속한 계정의 모든 프로시저 목록 조회 (프로시저 버전)
-- =============================================
CREATE OR REPLACE PROCEDURE GET_PROCEDURE_LIST (
    O_CURSOR OUT SYS_REFCURSOR
) AS
BEGIN
    OPEN O_CURSOR FOR
        SELECT 
            OBJECT_NAME AS PROCEDURE_NAME,
            CREATED,
            LAST_DDL_TIME AS LAST_MODIFIED,
            STATUS
        FROM 
            USER_OBJECTS
        WHERE 
            OBJECT_TYPE = 'PROCEDURE'
        ORDER BY 
            OBJECT_NAME ASC;
END;
/
