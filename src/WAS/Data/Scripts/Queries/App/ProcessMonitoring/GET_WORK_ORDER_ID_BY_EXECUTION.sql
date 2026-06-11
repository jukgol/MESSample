SELECT work_order_id AS WorkOrderID
FROM PROCESS_STEP_EXECUTION
WHERE process_step_execution_id = :ExecutionId
