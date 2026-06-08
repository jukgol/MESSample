SELECT process_id AS ProcessID,
       process_code AS ProcessCode,
       process_name AS ProcessName,
       description AS Description,
       created_at AS CreatedAt
FROM PROCESS_MASTER
WHERE process_code = :ProcessCode
