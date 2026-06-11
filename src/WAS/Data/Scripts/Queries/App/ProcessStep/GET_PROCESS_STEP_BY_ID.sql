SELECT s.step_id,
       s.step_name,
       s.seq_no,
       s.step_type,
       s.equipment_id,
       s.description,
       s.process_master_id,
       m.process_name AS process_master_name,
       s.created_at
FROM PROCESS_STEP s
LEFT JOIN PROCESS_MASTER m ON s.process_master_id = m.process_id
WHERE s.step_id = :StepId

