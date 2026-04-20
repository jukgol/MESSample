CREATE OR REPLACE PROCEDURE ADD_COLUMN_SAFE (
    p_table_name   IN VARCHAR2,
    p_column_name  IN VARCHAR2,
    p_data_type    IN VARCHAR2,
    p_is_not_null  IN NUMBER, -- 1: TRUE, 0: FALSE
    p_is_unique    IN NUMBER  -- 1: TRUE, 0: FALSE
) AS
    v_count NUMBER;
    v_sql   VARCHAR2(1000);
BEGIN
    -- 1. 컬럼 존재 여부 확인
    SELECT COUNT(*) INTO v_count
    FROM USER_TAB_COLS
    WHERE TABLE_NAME = UPPER(p_table_name)
      AND COLUMN_NAME = UPPER(p_column_name);

    IF v_count > 0 THEN
        RAISE_APPLICATION_ERROR(-20001, '이미 존재하는 컬럼 이름입니다.');
    END IF;

    -- 2. SQL 문 조립
    v_sql := 'ALTER TABLE ' || p_table_name || ' ADD (' || p_column_name || ' ' || p_data_type;

    IF p_is_not_null = 1 THEN
        v_sql := v_sql || ' NOT NULL';
    END IF;

    IF p_is_unique = 1 THEN
        v_sql := v_sql || ' UNIQUE';
    END IF;

    v_sql := v_sql || ')';

    -- 3. 실행
    EXECUTE IMMEDIATE v_sql;
END;
