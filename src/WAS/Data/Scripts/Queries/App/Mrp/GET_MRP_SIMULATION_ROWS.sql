SELECT s.step_id AS StepID,
       s.step_name AS StepName,
       s.seq_no AS SeqNo,
       s.step_type AS StepType,
       b.bom_id AS BomID,
       b.child_item_id AS ChildItemID,
       ci.item_name AS ChildItemName,
       b.bom_qty AS BomQty,
       NVL(stock.current_stock, 0) AS CurrentStock
FROM PROCESS_STEP s
LEFT JOIN BOM b ON b.process_step_id = s.step_id
LEFT JOIN ITEM ci ON b.child_item_id = ci.item_id
LEFT JOIN (
    SELECT item_id,
           SUM(qty) AS current_stock
    FROM LOT
    GROUP BY item_id
) stock ON stock.item_id = b.child_item_id
WHERE s.process_master_id = :ProcessMasterId
ORDER BY s.seq_no ASC, b.bom_id ASC
