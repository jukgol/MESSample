UPDATE PROCESS_STEP
SET step_name = :StepName,
    seq_no = :SeqNo,
    step_type = :StepType,
    description = :Description,
    bom_id = :BomId
WHERE step_id = :StepId
