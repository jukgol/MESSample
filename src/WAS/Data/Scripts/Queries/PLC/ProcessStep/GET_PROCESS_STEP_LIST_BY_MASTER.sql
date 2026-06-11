SELECT s.step_id AS StepID,
       s.step_name AS StepName,
       s.seq_no AS SeqNo,
       s.step_type AS StepType,
       s.description AS Description,
       s.process_master_id AS ProcessMasterID,
       m.process_name AS ProcessMasterName
FROM PROCESS_STEP s
LEFT JOIN PROCESS_MASTER m ON s.process_master_id = m.process_id
WHERE s.process_master_id = :ProcessMasterId
ORDER BY s.seq_no ASC, s.step_id ASC
