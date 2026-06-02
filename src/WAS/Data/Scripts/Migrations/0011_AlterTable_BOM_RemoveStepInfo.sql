-- 0011: BOM 테이블 구조 변경 (공정 정보 제거)

-- 1. 기존 PROCESS_STEP 테이블 외래키 제약조건 제거
ALTER TABLE BOM DROP CONSTRAINT FK_BOM_STEP;
/

-- 2. 기존 복합 유니크 제약조건 (parent_item_id, child_item_id, step_id) 제거
ALTER TABLE BOM DROP CONSTRAINT UQ_BOM_ITEM_STEP;
/

-- 3. step_id 컬럼 제거
ALTER TABLE BOM DROP COLUMN step_id;
/

-- 4. 신규 유니크 제약조건 (부모-자식 조합) 추가하여 동일 품목 중복 매핑 방지
ALTER TABLE BOM ADD CONSTRAINT UQ_BOM_PARENT_CHILD UNIQUE (parent_item_id, child_item_id);
/
