-- 새로운 컬럼 추가 (Safe Procedure 호출)
-- 사용법: 이름, 타입, NOT NULL 여부, UNIQUE 여부를 입력받아 처리합니다.
BEGIN
    ADD_COLUMN_SAFE(
        p_table_name  => '{TABLE}',
        p_column_name => '{NEW_COL}',
        p_data_type   => '{TYPE}',
        p_is_not_null => {NOTNULL},
        p_is_unique   => {UNIQUE}
    );
END;
