BEGIN
    FOR r IN (
        SELECT work_order_id,
               process_step_execution_id,
               lot_id,
               child_item_id,
               required_qty,
               current_qty
        FROM (
            SELECT wo.work_order_id,
                   pse.process_step_execution_id,
                   l.lot_id,
                   bi.item_id AS child_item_id,
                   (bi.input_qty * wo.order_qty) AS required_qty,
                   NVL(ls.current_qty, l.qty) AS current_qty,
                   ROW_NUMBER() OVER (
                       PARTITION BY pse.process_step_execution_id, bi.item_id
                       ORDER BY l.lot_id DESC
                   ) AS rn
            FROM WORK_ORDER wo
            JOIN PROCESS_STEP_EXECUTION pse ON pse.work_order_id = wo.work_order_id
            JOIN BOM_RECIPE br ON br.process_step_id = pse.process_step_id
            JOIN BOM_INPUT bi ON bi.bom_recipe_id = br.bom_recipe_id
            JOIN LOT l ON l.item_id = bi.item_id
            LEFT JOIN LOT_STOCK ls ON ls.lot_id = l.lot_id
            WHERE wo.work_order_no = :WorkOrderNo
              AND NVL(ls.reserved_qty, 0) = 0
              AND NVL(ls.current_qty, l.qty) >= (bi.input_qty * wo.order_qty)
              AND NOT EXISTS (
                  SELECT 1
                  FROM PROCESS_INPUT pi
                  WHERE pi.process_step_execution_id = pse.process_step_execution_id
                    AND pi.item_id = bi.item_id
              )
        )
        WHERE rn = 1
    )
    LOOP
        INSERT INTO PROCESS_INPUT (
            process_step_execution_id,
            lot_id,
            item_id,
            input_qty,
            used_qty,
            remain_qty,
            input_at
        )
        VALUES (
            r.process_step_execution_id,
            r.lot_id,
            r.child_item_id,
            r.required_qty,
            0,
            r.required_qty,
            CURRENT_TIMESTAMP
        );

        UPDATE LOT_STOCK
        SET reserved_qty = current_qty,
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
            'RESERVE',
            r.current_qty,
            0,
            r.current_qty,
            'Lot reserved by work order approval',
            'WORK_ORDER',
            r.work_order_id,
            CURRENT_TIMESTAMP
        );
    END LOOP;
END; -- query end
