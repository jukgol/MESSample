SELECT COUNT(DISTINCT pse.process_step_execution_id) AS ExecutionCount,
       COUNT(DISTINCT b.bom_id) AS BomMappingCount,
       COUNT(DISTINCT CASE WHEN l.lot_id IS NOT NULL THEN b.bom_id END) AS AvailableLotMappingCount,
       COUNT(DISTINCT CASE WHEN pi.process_input_id IS NOT NULL THEN b.bom_id END) AS ExistingInputCount,
       COUNT(DISTINCT CASE
           WHEN b.bom_id IS NOT NULL
            AND l.lot_id IS NOT NULL
            AND pi.process_input_id IS NULL
           THEN b.bom_id
       END) AS InsertCandidateCount
FROM WORK_ORDER wo
LEFT JOIN PROCESS_STEP_EXECUTION pse ON pse.work_order_id = wo.work_order_id
LEFT JOIN BOM b ON b.process_step_id = pse.process_step_id
LEFT JOIN (
    SELECT lot_id, item_id,
           ROW_NUMBER() OVER (PARTITION BY item_id ORDER BY lot_id DESC) AS rn
    FROM LOT
    WHERE qty > 0
) l ON l.item_id = b.child_item_id AND l.rn = 1
LEFT JOIN PROCESS_INPUT pi
       ON pi.process_step_execution_id = pse.process_step_execution_id
      AND pi.item_id = b.child_item_id
WHERE wo.work_order_no = :WorkOrderNo
