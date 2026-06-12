DECLARE
    v_current_qty NUMBER;
    v_reserved_qty NUMBER;
    v_after_qty NUMBER;
    v_work_order_no VARCHAR2(50);
    v_order_qty NUMBER;
    v_output_item_id NUMBER;
    v_output_lot_id NUMBER;
    v_output_count NUMBER;
BEGIN
    UPDATE PROCESS_STEP_EXECUTION
    SET status = 'RUNNING',
        started_at = NVL(started_at, CURRENT_TIMESTAMP),
        updated_at = CURRENT_TIMESTAMP
    WHERE process_step_execution_id = :ExecutionId
      AND status IN ('WAITING', 'PAUSED');

    SELECT COUNT(*)
    INTO v_output_count
    FROM PROCESS_OUTPUT
    WHERE process_step_execution_id = :ExecutionId;

    IF v_output_count = 0 THEN
        SELECT wo.work_order_no,
               wo.order_qty,
               MIN(b.parent_item_id)
        INTO v_work_order_no,
             v_order_qty,
             v_output_item_id
        FROM PROCESS_STEP_EXECUTION pse
        JOIN WORK_ORDER wo ON wo.work_order_id = pse.work_order_id
        JOIN BOM b ON b.process_step_id = pse.process_step_id
        WHERE pse.process_step_execution_id = :ExecutionId
        GROUP BY wo.work_order_no,
                 wo.order_qty;

        INSERT INTO LOT (
            item_id,
            lot_no,
            qty,
            received_at,
            status
        )
        VALUES (
            v_output_item_id,
            v_work_order_no || '-OUT-' || :ExecutionId,
            0,
            CURRENT_TIMESTAMP,
            'IN_PROGRESS'
        )
        RETURNING lot_id INTO v_output_lot_id;

        INSERT INTO LOT_STOCK (
            lot_id,
            current_qty,
            reserved_qty,
            updated_at,
            created_at
        )
        VALUES (
            v_output_lot_id,
            0,
            0,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        );

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
            v_output_lot_id,
            'CREATE',
            0,
            0,
            0,
            'Output lot created by process execution start',
            'PROCESS_STEP_EXECUTION',
            :ExecutionId,
            CURRENT_TIMESTAMP
        );

        INSERT INTO LOT_TRACE (
            parent_lot_id,
            child_lot_id,
            trace_type,
            input_qty,
            output_qty,
            process_step_execution_id,
            ref_type,
            ref_id,
            created_at
        )
        VALUES (
            NULL,
            v_output_lot_id,
            'PROCESS_OUTPUT',
            NULL,
            0,
            :ExecutionId,
            'PROCESS_STEP_EXECUTION',
            :ExecutionId,
            CURRENT_TIMESTAMP
        );

        INSERT INTO PROCESS_OUTPUT (
            process_step_execution_id,
            lot_id,
            item_id,
            target_qty,
            output_qty,
            output_type,
            output_at
        )
        VALUES (
            :ExecutionId,
            v_output_lot_id,
            v_output_item_id,
            v_order_qty,
            0,
            'GOOD',
            CURRENT_TIMESTAMP
        );
    END IF;

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
