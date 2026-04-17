-- 데이터베이스에서 시스템 관리 계정을 제외한 실제 사용자 스키마만 조회
SELECT 
    USERNAME 
FROM 
    ALL_USERS 
WHERE 
    ORACLE_MAINTAINED = 'N'  -- 오라클이 자동으로 생성하고 관리하는 계정 제외
ORDER BY 
    USERNAME
