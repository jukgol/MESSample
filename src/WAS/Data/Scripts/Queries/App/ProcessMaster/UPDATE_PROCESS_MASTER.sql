UPDATE PROCESS_MASTER
SET process_name = :ProcessName,
    description = :Description
WHERE process_id = :ProcessId
