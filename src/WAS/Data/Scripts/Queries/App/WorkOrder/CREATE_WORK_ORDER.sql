INSERT INTO WORK_ORDER (
    work_order_no,
    process_master_id,
    order_qty,
    worker_user_id,
    worker_name,
    is_available,
    approved_at
) VALUES (
    :WorkOrderNo,
    :ProcessMasterId,
    :OrderQty,
    :WorkerUserId,
    :WorkerName,
    :IsAvailable,
    CURRENT_TIMESTAMP
)
