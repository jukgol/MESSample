SELECT s.step_id AS StepID,
       s.step_name AS StepName,
       s.seq_no AS SeqNo,
       b.bom_id AS BomID,
       b.bom_qty AS BomQty,
       NVL(stock.current_stock, 0) AS CurrentStock
FROM PROCESS_STEP s
LEFT JOIN BOM b ON b.process_step_id = s.step_id
LEFT JOIN (
    SELECT item_id,
           MAX(NVL(ls.current_qty, l.qty)) AS current_stock
    FROM LOT l
    LEFT JOIN LOT_STOCK ls ON ls.lot_id = l.lot_id
    WHERE NVL(ls.reserved_qty, 0) = 0
      AND NVL(ls.current_qty, l.qty) > 0
    GROUP BY item_id
) stock ON stock.item_id = b.child_item_id
WHERE s.process_master_id = :ProcessMasterId
ORDER BY s.seq_no ASC, b.bom_id ASC
