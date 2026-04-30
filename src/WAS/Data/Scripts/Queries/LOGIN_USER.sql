-- =============================================
-- Author:      Antigravity (AI Assistant)
-- Create date: 2026-04-30
-- Description: 사용자 로그인을 위한 정보 조회 쿼리
-- =============================================
SELECT 
    u.LOGIN_ID, 
    u.USER_NAME, 
    u.PASSWORD, 
    u.ROLE_CODE, 
    r.ROLE_NAME,
    u.IS_ACTIVE
FROM 
    USER_INFO u
    JOIN USER_ROLE r ON u.ROLE_CODE = r.ROLE_CODE
WHERE 
    u.LOGIN_ID = :I_USER_ID
