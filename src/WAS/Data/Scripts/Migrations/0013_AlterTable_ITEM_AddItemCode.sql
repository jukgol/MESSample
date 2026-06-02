-- 0013: ITEM 테이블에 item_code 추가 (비즈니스 식별 키)

-- 1. item_code 컬럼 추가
ALTER TABLE ITEM ADD (
    item_code VARCHAR2(50)
);
/

-- 2. 기존 데이터에 임시 item_code 부여 (예: ITEM_101, ITEM_201 등)
UPDATE ITEM SET item_code = 'ITEM_' || item_id WHERE item_code IS NULL;
/

-- 3. item_code 컬럼을 NOT NULL로 변경
ALTER TABLE ITEM MODIFY (
    item_code VARCHAR2(50) NOT NULL
);
/

-- 4. UNIQUE 제약조건 추가
ALTER TABLE ITEM ADD CONSTRAINT UQ_ITEM_CODE UNIQUE (item_code);
/
