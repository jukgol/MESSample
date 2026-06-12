UPDATE LOT_TRACE
SET output_qty = :OutputQty
WHERE child_lot_id = :LotId
  AND process_step_execution_id = :ExecutionId
