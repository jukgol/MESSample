DECLARE
    v_current_qty NUMBER;
    v_reserved_qty NUMBER;
    v_after_qty NUMBER;
BEGIN
    UPDATE PROCESS_STEP_EXECUTION
    SET status = 'RUNNING',
        started_at = NVL(started_at, CURRENT_TIMESTAMP),
        updated_at = CURRENT_TIMESTAMP
    WHERE process_step_execution_id = :ExecutionId
      AND status IN ('WAITING', 'PAUSED');

    FOR r IN (
        SELECT process_input_id,
               lot_id,
               input_qty
        FROM PROCESS_INPUT
        WHERE process_step_execution_id = :ExecutionId
          AND used_qty = 0
          AND remain_qty = input_qty
        ORDER BY process_input_id
    )
    LOOP
        SELECT current_qty,
               reserved_qty
        INTO v_current_qty,
             v_reserved_qty
        FROM LOT_STOCK
        WHERE lot_id = r.lot_id
        FOR UPDATE;

        v_after_qty := v_current_qty - r.input_qty;
        IF v_after_qty < 0 THEN
            RAISE_APPLICATION_ERROR(-20001, 'Lot stock cannot be negative while starting execution.');
        END IF;

        UPDATE LOT_STOCK
        SET current_qty = v_after_qty,
            reserved_qty = 0,
            updated_at = CURRENT_TIMESTAMP
        WHERE lot_id = r.lot_id;

        UPDATE PROCESS_INPUT
        SET used_qty = input_qty,
            remain_qty = 0
        WHERE process_input_id = r.process_input_id;

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
            'CONSUME',
            v_current_qty,
            -r.input_qty,
            v_after_qty,
            'Reserved lot consumed by process execution start',
            'PROCESS_STEP_EXECUTION',
            :ExecutionId,
            CURRENT_TIMESTAMP
        );
    END LOOP;
END;
