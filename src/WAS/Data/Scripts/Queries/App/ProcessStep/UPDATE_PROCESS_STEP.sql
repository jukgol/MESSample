UPDATE PROCESS_STEP
SET step_name = :StepName,
    seq_no = :SeqNo,
    step_type = :StepType,
    equipment_id = :EquipmentId,
    description = :Description,
    process_master_id = :ProcessMasterId
WHERE step_id = :StepId
