SELECT s.step_id AS StepID,
       s.step_name AS StepName,
       s.seq_no AS SeqNo,
       s.step_type AS StepType,
       br.bom_recipe_id AS RecipeID,
       bi.bom_input_id AS BomID,
       bi.item_id AS ChildItemID,
       ci.item_name AS ChildItemName,
       bi.input_qty AS BomQty,
       NVL(stock.current_stock, 0) AS CurrentStock,
       NVL(stock.lot_count, 0) AS LotCount
FROM PROCESS_STEP s
LEFT JOIN BOM_RECIPE br ON br.process_step_id = s.step_id
LEFT JOIN BOM_INPUT bi ON bi.bom_recipe_id = br.bom_recipe_id
LEFT JOIN ITEM ci ON bi.item_id = ci.item_id
LEFT JOIN (
    SELECT item_id,
           SUM(qty) AS current_stock,
           COUNT(*) AS lot_count
    FROM LOT
    GROUP BY item_id
) stock ON stock.item_id = bi.item_id
WHERE s.process_master_id = :ProcessMasterId
ORDER BY s.seq_no ASC, bi.bom_input_id ASC
