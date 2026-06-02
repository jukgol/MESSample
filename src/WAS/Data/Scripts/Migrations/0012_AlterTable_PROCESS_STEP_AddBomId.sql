-- 0012: PROCESS_STEP 테이블에 bom_id 추가 (BOM 연계)

-- 1. bom_id 컬럼 추가 (자재 소모가 없는 공정도 있으므로 NULL 허용)
ALTER TABLE PROCESS_STEP ADD (
    bom_id NUMBER
);
/

-- 2. BOM 테이블 외래키 설정
ALTER TABLE PROCESS_STEP ADD CONSTRAINT FK_STEP_BOM FOREIGN KEY (bom_id) REFERENCES BOM(bom_id);
/
