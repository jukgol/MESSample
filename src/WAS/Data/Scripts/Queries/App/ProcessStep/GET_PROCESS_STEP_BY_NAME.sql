SELECT step_id,
       step_name,
       seq_no,
       step_type,
       description,
       created_at
FROM PROCESS_STEP
WHERE step_name = :StepName
