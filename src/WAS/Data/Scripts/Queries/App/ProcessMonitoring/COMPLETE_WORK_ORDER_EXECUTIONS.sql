UPDATE PROCESS_STEP_EXECUTION
SET status = 'COMPLETED',
    updated_at = CURRENT_TIMESTAMP
WHERE work_order_id = :WorkOrderId
  AND status = 'DONE'
/
