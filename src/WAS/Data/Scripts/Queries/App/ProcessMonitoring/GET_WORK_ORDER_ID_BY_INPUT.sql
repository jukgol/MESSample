SELECT pse.work_order_id AS WorkOrderID
FROM PROCESS_INPUT pi
JOIN PROCESS_STEP_EXECUTION pse ON pi.process_step_execution_id = pse.process_step_execution_id
WHERE pi.process_input_id = :InputId
