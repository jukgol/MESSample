INSERT INTO PROCESS_STEP_EXECUTION (
    work_order_id,
    process_step_id,
    equipment_id,
    worker_user_id,
    status,
    updated_at
)
SELECT wo.work_order_id,
       ps.step_id,
       ps.equipment_id,
       wo.worker_user_id,
       'WAITING',
       CURRENT_TIMESTAMP
FROM WORK_ORDER wo
JOIN PROCESS_STEP ps ON ps.process_master_id = wo.process_master_id
WHERE wo.work_order_no = :WorkOrderNo
