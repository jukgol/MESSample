INSERT INTO PROCESS_INPUT (
    process_step_execution_id,
    lot_id,
    item_id,
    input_qty,
    used_qty,
    remain_qty,
    input_at
) VALUES (
    :ExecutionId,
    :LotId,
    :ItemId,
    :InputQty,
    :UsedQty,
    :RemainQty,
    CURRENT_TIMESTAMP
)
