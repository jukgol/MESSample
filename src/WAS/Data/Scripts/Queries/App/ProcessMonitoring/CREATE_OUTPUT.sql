INSERT INTO PROCESS_OUTPUT (
    process_step_execution_id,
    lot_id,
    item_id,
    target_qty,
    output_qty,
    output_type,
    output_at
) VALUES (
    :ExecutionId,
    :LotId,
    :ItemId,
    :TargetQty,
    :OutputQty,
    :OutputType,
    CURRENT_TIMESTAMP
)
