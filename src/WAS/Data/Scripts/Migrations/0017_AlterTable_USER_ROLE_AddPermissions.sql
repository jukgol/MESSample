-- 0017: USER_ROLE 테이블에 PERMISSIONS 컬럼 추가 및 권한 정보 Seeding

-- 1. USER_ROLE 테이블에 PERMISSIONS 컬럼 추가 (JSON 제약조건 포함)
ALTER TABLE USER_ROLE ADD (PERMISSIONS CLOB);
/
ALTER TABLE USER_ROLE ADD CONSTRAINT CHK_USER_ROLE_PERMISSIONS CHECK (PERMISSIONS IS JSON);
/

-- 2. 역할별 기본 권한 JSON 매핑 업데이트
UPDATE USER_ROLE 
SET PERMISSIONS = '["*"]' 
WHERE ROLE_CODE = 'ADMIN';
/

UPDATE USER_ROLE 
SET PERMISSIONS = '["Permissions.Process.View", "Permissions.Process.Execute"]' 
WHERE ROLE_CODE = 'OPERATOR';
/

UPDATE USER_ROLE 
SET PERMISSIONS = '["Permissions.QC.View", "Permissions.QC.Execute"]' 
WHERE ROLE_CODE = 'QC';
/

UPDATE USER_ROLE 
SET PERMISSIONS = '["Permissions.Process.View", "Permissions.QC.View", "Permissions.MasterData.View", "Permissions.Inventory.View"]' 
WHERE ROLE_CODE = 'VIEWER';
/

COMMIT;
/
