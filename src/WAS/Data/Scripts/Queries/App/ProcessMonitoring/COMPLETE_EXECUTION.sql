DECLARE
    v_stock_count NUMBER;
BEGIN
    FOR r IN (
        SELECT process_output_id,
               lot_id,
               output_qty
        FROM PROCESS_OUTPUT
        WHERE process_step_execution_id = :ExecutionId
        ORDER BY process_output_id
    )
    LOOP
        UPDATE LOT
        SET qty = r.output_qty,
            status = 'DONE'
        WHERE lot_id = r.lot_id;

        SELECT COUNT(*)
        INTO v_stock_count
        FROM LOT_STOCK
        WHERE lot_id = r.lot_id;

        IF v_stock_count = 0 THEN
            INSERT INTO LOT_STOCK (
                lot_id,
                current_qty,
                reserved_qty,
                updated_at,
                created_at
            )
            VALUES (
                r.lot_id,
                r.output_qty,
                0,
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            );
        ELSE
            UPDATE LOT_STOCK
            SET current_qty = r.output_qty,
                reserved_qty = 0,
                updated_at = CURRENT_TIMESTAMP
            WHERE lot_id = r.lot_id;
        END IF;

        INSERT INTO LOT_STOCK_HISTORY (
            lot_id,
            change_type,
            before_qty,
            change_qty,
            after_qty,
            reason,
            ref_type,
            ref_id,
            created_at
        )
        VALUES (
            r.lot_id,
            'COMPLETE',
            0,
            r.output_qty,
            r.output_qty,
            'Output lot completed by process execution',
            'PROCESS_STEP_EXECUTION',
            :ExecutionId,
            CURRENT_TIMESTAMP
        );

        UPDATE LOT_TRACE
        SET output_qty = r.output_qty
        WHERE child_lot_id = r.lot_id
          AND process_step_execution_id = :ExecutionId;
    END LOOP;

    UPDATE PROCESS_STEP_EXECUTION
    SET status = 'DONE',
        ended_at = NVL(ended_at, CURRENT_TIMESTAMP),
        updated_at = CURRENT_TIMESTAMP
    WHERE process_step_execution_id = :ExecutionId
      AND status IN ('WAITING', 'RUNNING', 'PAUSED');
END;
-- query end
