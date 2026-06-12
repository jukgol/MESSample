UPDATE PROCESS_STEP_EXECUTION
SET status = 'RUNNING',
    started_at = NVL(started_at, CURRENT_TIMESTAMP),
    updated_at = CURRENT_TIMESTAMP
WHERE process_step_execution_id = :ExecutionId
  AND status IN ('WAITING', 'PAUSED')
