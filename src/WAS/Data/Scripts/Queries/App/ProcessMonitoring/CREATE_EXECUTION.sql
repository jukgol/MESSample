INSERT INTO PROCESS_STEP_EXECUTION (
    work_order_id,
    process_step_id,
    equipment_id,
    worker_user_id,
    status,
    started_at,
    ended_at,
    updated_at
) VALUES (
    :WorkOrderId,
    :ProcessStepId,
    :EquipmentId,
    :WorkerUserId,
    :Status,
    CASE WHEN :Status = 'RUNNING' THEN CURRENT_TIMESTAMP ELSE NULL END,
    CASE WHEN :Status = 'DONE' THEN CURRENT_TIMESTAMP ELSE NULL END,
    CURRENT_TIMESTAMP
)
