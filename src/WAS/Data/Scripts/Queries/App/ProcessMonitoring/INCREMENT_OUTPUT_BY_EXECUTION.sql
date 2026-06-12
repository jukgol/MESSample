UPDATE PROCESS_OUTPUT
SET output_qty = output_qty + :Qty,
    output_at = CURRENT_TIMESTAMP
WHERE process_output_id = (
    SELECT process_output_id
    FROM (
        SELECT process_output_id
        FROM PROCESS_OUTPUT
        WHERE process_step_execution_id = :ExecutionId
          AND output_type = 'GOOD'
        ORDER BY process_output_id ASC
    )
    WHERE ROWNUM = 1
)
