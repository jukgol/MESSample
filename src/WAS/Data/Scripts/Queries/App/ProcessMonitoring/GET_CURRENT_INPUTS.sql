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
SELECT PI.PROCESS_INPUT_ID AS ProcessInputID,
       PI.PROCESS_STEP_EXECUTION_ID AS ProcessStepExecutionID,
       PI.LOT_ID AS LotID,
       L.LOT_NO AS LotNo,
       PI.ITEM_ID AS ItemID,
       I.ITEM_NAME AS ItemName,
       PI.INPUT_QTY AS InputQty,
       PI.USED_QTY AS UsedQty,
       PI.REMAIN_QTY AS RemainQty,
       PI.INPUT_AT AS InputAt,
       PI.CREATED_AT AS CreatedAt
FROM PROCESS_INPUT PI
JOIN PROCESS_STEP_EXECUTION PSE ON PI.PROCESS_STEP_EXECUTION_ID = PSE.PROCESS_STEP_EXECUTION_ID
JOIN LATEST_WORK_ORDER LWO ON LWO.WORK_ORDER_ID = PSE.WORK_ORDER_ID
JOIN LOT L ON PI.LOT_ID = L.LOT_ID
JOIN ITEM I ON PI.ITEM_ID = I.ITEM_ID
WHERE PSE.STATUS <> 'DELETED'
ORDER BY PI.INPUT_AT ASC, PI.PROCESS_INPUT_ID ASC
