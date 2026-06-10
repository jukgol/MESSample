UPDATE PROCESS_INPUT
SET used_qty = :UsedQty,
    remain_qty = :RemainQty
WHERE process_input_id = :InputId
