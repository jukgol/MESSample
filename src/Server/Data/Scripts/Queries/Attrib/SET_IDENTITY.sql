-- 특정 컬럼을 Oracle Identity(자동 증가) 속성으로 변경 (Sequence 기반 권장)
-- 주의: 이미 일반 컬럼인 경우 직접 IDENTITY로 변경이 불가할 수 있으므로 시퀀스를 활용합니다.

-- 1. 시퀀스 생성 (테이블명_컬럼명_SEQ)
-- 2. 해당 컬럼의 DEFAULT 값을 시퀀스.NEXTVAL로 지정

-- [참고] 만약 IDENTITY 열로 반드시 변경해야 한다면 컬럼을 드롭 후 재생성해야 합니다.
-- 여기서는 가장 안전한 DEFAULT SEQUENCE 방식을 예시로 듭니다 (Oracle 12c+)

DECLARE
    v_seq_name VARCHAR2(100) := '{TABLE}_{COLUMN}_SEQ';
    v_sql VARCHAR2(500);
BEGIN
    -- 시퀀스 존재 여부 확인 후 생성
    BEGIN
        v_sql := 'CREATE SEQUENCE ' || v_seq_name || ' START WITH 1 INCREMENT BY 1';
        EXECUTE IMMEDIATE v_sql;
    EXCEPTION
        WHEN OTHERS THEN NULL; -- 이미 존재하면 무시
    END;

    -- 컬럼의 DEFAULT 값을 시퀀스로 변경
    v_sql := 'ALTER TABLE {TABLE} MODIFY ({COLUMN} DEFAULT ' || v_seq_name || '.NEXTVAL)';
    EXECUTE IMMEDIATE v_sql;
END;
