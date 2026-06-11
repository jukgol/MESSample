INSERT INTO PROCESS_INPUT (
    process_step_execution_id,
    lot_id,
    item_id,
    input_qty,
    used_qty,
    remain_qty,
    input_at
)
SELECT pse.process_step_execution_id,
       l.lot_id,
       b.child_item_id,
       (b.bom_qty * wo.order_qty) AS input_qty,
       (b.bom_qty * wo.order_qty) AS used_qty,
       0 AS remain_qty,
       CURRENT_TIMESTAMP AS input_at
FROM PROCESS_STEP_EXECUTION pse
JOIN WORK_ORDER wo ON wo.work_order_id = pse.work_order_id
JOIN PROCESS_STEP ps ON ps.step_id = pse.process_step_id
JOIN BOM b ON b.process_step_id = ps.step_id
JOIN (
    SELECT lot_id, item_id,
           ROW_NUMBER() OVER (PARTITION BY item_id ORDER BY lot_id DESC) as rn
    FROM LOT
    WHERE qty > 0
) l ON l.item_id = b.child_item_id AND l.rn = 1
WHERE wo.work_order_no = :WorkOrderNo
  AND NOT EXISTS (
      SELECT 1 
      FROM PROCESS_INPUT pi 
      WHERE pi.process_step_execution_id = pse.process_step_execution_id
        AND pi.item_id = b.child_item_id
  )
