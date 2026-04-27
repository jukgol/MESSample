-- =============================================
-- Author:      Antigravity (AI Assistant)
-- Create date: 2026-04-27
-- Description: 사용자 로그인을 위한 정보 조회 프로시저
-- =============================================
CREATE OR REPLACE PROCEDURE LOGIN_USER (
    I_USER_ID IN VARCHAR2,
    O_CURSOR OUT SYS_REFCURSOR
) AS
BEGIN
    OPEN O_CURSOR FOR
        SELECT 
            u.LOGIN_ID as UserId, 
            u.USER_NAME as UserName, 
            u.PASSWORD as Password, 
            u.ROLE_CODE as RoleCode, 
            r.ROLE_NAME as RoleName,
            u.IS_ACTIVE as IsActive
        FROM 
            USER_INFO u
            JOIN USER_ROLE r ON u.ROLE_CODE = r.ROLE_CODE
        WHERE 
            u.LOGIN_ID = I_USER_ID;
END;
/
