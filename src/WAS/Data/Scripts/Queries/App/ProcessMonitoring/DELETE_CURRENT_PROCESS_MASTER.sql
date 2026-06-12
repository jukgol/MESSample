DECLARE
    v_work_order_id NUMBER;
BEGIN
    SELECT work_order_id
    INTO v_work_order_id
    FROM (
        SELECT wo.work_order_id,
               ROW_NUMBER() OVER (
                   ORDER BY wo.approved_at DESC, wo.work_order_id DESC
               ) AS rn
        FROM WORK_ORDER wo
        WHERE wo.process_master_id = :ProcessMasterId
          AND EXISTS (
              SELECT 1
              FROM PROCESS_STEP_EXECUTION pse
              WHERE pse.work_order_id = wo.work_order_id
                AND pse.status <> 'DELETED'
          )
    )
    WHERE rn = 1;

    FOR r IN (
        SELECT pi.lot_id,
               NVL(ls.current_qty, 0) AS current_qty,
               NVL(ls.reserved_qty, 0) AS reserved_qty
        FROM PROCESS_INPUT pi
        JOIN PROCESS_STEP_EXECUTION pse ON pse.process_step_execution_id = pi.process_step_execution_id
        JOIN LOT_STOCK ls ON ls.lot_id = pi.lot_id
        WHERE pse.work_order_id = v_work_order_id
          AND pi.used_qty = 0
          AND pi.remain_qty = pi.input_qty
          AND NVL(ls.reserved_qty, 0) > 0
        FOR UPDATE OF ls.reserved_qty
    )
    LOOP
        UPDATE LOT_STOCK
        SET reserved_qty = 0,
            updated_at = CURRENT_TIMESTAMP
        WHERE lot_id = r.lot_id;

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
            'RELEASE',
            r.current_qty,
            0,
            r.current_qty,
            'Reserved lot released by process master deletion',
            'WORK_ORDER',
            v_work_order_id,
            CURRENT_TIMESTAMP
        );
    END LOOP;

    UPDATE PROCESS_STEP_EXECUTION
    SET status = 'DELETED',
        updated_at = CURRENT_TIMESTAMP
    WHERE work_order_id = v_work_order_id
      AND status <> 'DELETED';
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        NULL;
END;
