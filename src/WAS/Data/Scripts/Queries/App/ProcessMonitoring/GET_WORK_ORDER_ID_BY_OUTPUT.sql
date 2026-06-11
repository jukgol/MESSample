SELECT pse.work_order_id AS WorkOrderID
FROM PROCESS_OUTPUT po
JOIN PROCESS_STEP_EXECUTION pse ON po.process_step_execution_id = pse.process_step_execution_id
WHERE po.process_output_id = :OutputId
