SELECT wo.work_order_id AS WorkOrderID,
       wo.work_order_no AS WorkOrderNo,
       wo.process_master_id AS ProcessMasterID,
       pm.process_name AS ProcessMasterName,
       wo.order_qty AS OrderQty,
       wo.worker_name AS WorkerName,
       CASE
           WHEN COUNT(pse.process_step_execution_id) > 0
                AND SUM(CASE WHEN pse.status = 'DELETED' THEN 1 ELSE 0 END) = COUNT(pse.process_step_execution_id) THEN 'DELETED'
           WHEN SUM(CASE WHEN pse.status = 'RUNNING' THEN 1 ELSE 0 END) > 0 THEN 'RUNNING'
           WHEN SUM(CASE WHEN pse.status = 'PAUSED' THEN 1 ELSE 0 END) > 0 THEN 'PAUSED'
           WHEN COUNT(pse.process_step_execution_id) > 0
                AND SUM(CASE WHEN pse.status IN ('DONE', 'COMPLETED') THEN 1 ELSE 0 END) = COUNT(pse.process_step_execution_id) THEN 'DONE'
           WHEN COUNT(pse.process_step_execution_id) > 0 THEN 'WAITING'
           ELSE 'APPROVED'
       END AS Status,
       wo.approved_at AS ApprovedAt,
       wo.created_at AS CreatedAt
FROM WORK_ORDER wo
JOIN PROCESS_MASTER pm ON wo.process_master_id = pm.process_id
LEFT JOIN PROCESS_STEP_EXECUTION pse ON wo.work_order_id = pse.work_order_id
GROUP BY wo.work_order_id,
         wo.work_order_no,
         wo.process_master_id,
         pm.process_name,
         wo.order_qty,
         wo.worker_name,
         wo.approved_at,
         wo.created_at
ORDER BY wo.created_at DESC, wo.work_order_id DESC
