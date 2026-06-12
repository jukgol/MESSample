UPDATE PROCESS_OUTPUT
SET output_qty = :OutputQty,
    output_at = CURRENT_TIMESTAMP
WHERE process_output_id = :OutputId
