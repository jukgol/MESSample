-- 0018: PROCESS_STEP과 BOM 테이블 간의 관계 변경
-- (PROCESS_STEP에서 bom_id 제거, BOM에 process_step_id 추가)

-- 1. PROCESS_STEP 테이블에서 bom_id 외래키 제약조건 제거 및 컬럼 삭제
ALTER TABLE PROCESS_STEP DROP CONSTRAINT FK_STEP_BOM;
/
ALTER TABLE PROCESS_STEP DROP COLUMN bom_id;
/

-- 2. BOM 테이블에 process_step_id 컬럼 추가
ALTER TABLE BOM ADD (
    process_step_id NUMBER
);
/

-- 3. PROCESS_STEP 테이블의 PK(step_id)를 참조하는 외래키 설정
ALTER TABLE BOM ADD CONSTRAINT FK_BOM_STEP FOREIGN KEY (process_step_id) REFERENCES PROCESS_STEP(step_id);
/

-- 4. 기존 BOM 유니크 제약조건(부모-자식)을 제거하고, 공정까지 포함한 복합 유니크 제약조건으로 변경
ALTER TABLE BOM DROP CONSTRAINT UQ_BOM_PARENT_CHILD;
/
ALTER TABLE BOM ADD CONSTRAINT UQ_BOM_ITEM_STEP UNIQUE (parent_item_id, child_item_id, process_step_id);
/
