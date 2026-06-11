SELECT step_id,
       step_name,
       seq_no,
       step_type,
       equipment_id,
       description,
       process_master_id,
       created_at
FROM PROCESS_STEP
WHERE step_name = :StepName
