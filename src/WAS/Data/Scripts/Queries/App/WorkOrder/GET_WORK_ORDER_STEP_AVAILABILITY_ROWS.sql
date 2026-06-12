SELECT s.step_id AS StepID,
       s.step_name AS StepName,
       s.seq_no AS SeqNo,
       bi.bom_input_id AS BomID,
       bi.input_qty AS BomQty,
       NVL(stock.current_stock, 0) AS CurrentStock
FROM PROCESS_STEP s
LEFT JOIN BOM_RECIPE br ON br.process_step_id = s.step_id
LEFT JOIN BOM_INPUT bi ON bi.bom_recipe_id = br.bom_recipe_id
LEFT JOIN (
    SELECT item_id,
           MAX(NVL(ls.current_qty, l.qty)) AS current_stock
    FROM LOT l
    LEFT JOIN LOT_STOCK ls ON ls.lot_id = l.lot_id
    WHERE NVL(ls.reserved_qty, 0) = 0
      AND NVL(ls.current_qty, l.qty) > 0
    GROUP BY item_id
) stock ON stock.item_id = bi.item_id
WHERE s.process_master_id = :ProcessMasterId
ORDER BY s.seq_no ASC, bi.bom_input_id ASC
