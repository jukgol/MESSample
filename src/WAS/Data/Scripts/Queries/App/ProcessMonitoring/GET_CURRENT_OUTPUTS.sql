WITH LATEST_WORK_ORDER AS (
    SELECT work_order_id
    FROM (
        SELECT wo.work_order_id,
               ROW_NUMBER() OVER (
                   PARTITION BY wo.process_master_id
                   ORDER BY wo.approved_at DESC, wo.work_order_id DESC
               ) AS rn
        FROM WORK_ORDER wo
        WHERE EXISTS (
            SELECT 1
            FROM PROCESS_STEP_EXECUTION current_pse
            WHERE current_pse.work_order_id = wo.work_order_id
              AND current_pse.status <> 'DELETED'
        )
    )
    WHERE rn = 1
)
SELECT PO.PROCESS_OUTPUT_ID AS ProcessOutputID,
       PO.PROCESS_STEP_EXECUTION_ID AS ProcessStepExecutionID,
       PO.LOT_ID AS LotID,
       L.LOT_NO AS LotNo,
       PO.ITEM_ID AS ItemID,
       I.ITEM_NAME AS ItemName,
       PO.TARGET_QTY AS TargetQty,
       PO.OUTPUT_QTY AS OutputQty,
       PO.OUTPUT_TYPE AS OutputType,
       PO.OUTPUT_AT AS OutputAt,
       PO.CREATED_AT AS CreatedAt
FROM PROCESS_OUTPUT PO
JOIN PROCESS_STEP_EXECUTION PSE ON PO.PROCESS_STEP_EXECUTION_ID = PSE.PROCESS_STEP_EXECUTION_ID
JOIN LATEST_WORK_ORDER LWO ON LWO.WORK_ORDER_ID = PSE.WORK_ORDER_ID
JOIN LOT L ON PO.LOT_ID = L.LOT_ID
JOIN ITEM I ON PO.ITEM_ID = I.ITEM_ID
WHERE PSE.STATUS <> 'DELETED'
ORDER BY PO.OUTPUT_AT ASC, PO.PROCESS_OUTPUT_ID ASC
