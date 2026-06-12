UPDATE PROCESS_STEP_EXECUTION
SET status = 'DONE',
    ended_at = NVL(ended_at, CURRENT_TIMESTAMP),
    updated_at = CURRENT_TIMESTAMP
WHERE process_step_execution_id = :ExecutionId
  AND status IN ('WAITING', 'RUNNING', 'PAUSED')
