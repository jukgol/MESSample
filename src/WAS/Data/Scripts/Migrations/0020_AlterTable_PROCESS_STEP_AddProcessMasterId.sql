-- 0020: PROCESS_STEP 테이블에 process_master_id 컬럼 추가 (공정 마스터 연계)

-- 1. PROCESS_STEP 테이블에 process_master_id 컬럼 추가 (기존 데이터 호환을 위해 NULL 허용)
ALTER TABLE PROCESS_STEP ADD (
    process_master_id NUMBER
);
/

-- 2. PROCESS_MASTER 테이블을 참조하는 외래키 제약조건 추가
ALTER TABLE PROCESS_STEP ADD CONSTRAINT FK_STEP_PROCESS_MASTER 
    FOREIGN KEY (process_master_id) REFERENCES PROCESS_MASTER(process_id) ON DELETE SET NULL;
/
