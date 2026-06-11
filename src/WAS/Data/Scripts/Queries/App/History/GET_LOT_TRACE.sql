SELECT lt.lot_trace_id AS LotRelationID,
       lt.parent_lot_id AS ParentLotID,
       parent_lot.lot_no AS ParentLotNo,
       parent_item.item_id AS ParentItemID,
       parent_item.item_name AS ParentItemName,
       lt.child_lot_id AS ChildLotID,
       child_lot.lot_no AS ChildLotNo,
       child_item.item_id AS ChildItemID,
       child_item.item_name AS ChildItemName,
       lt.trace_type AS RelationType,
       lt.input_qty AS InputQty,
       lt.output_qty AS OutputQty,
       lt.process_step_execution_id AS ProcessStepExecutionID,
       wo.work_order_no AS WorkOrderNo,
       ps.step_name AS StepName,
       lt.ref_type AS RefType,
       lt.ref_id AS RefID,
       lt.created_at AS CreatedAt,
       'PARENT' AS Direction,
       LEVEL AS TraceDepth
FROM LOT_TRACE lt
LEFT JOIN LOT parent_lot ON lt.parent_lot_id = parent_lot.lot_id
LEFT JOIN ITEM parent_item ON parent_lot.item_id = parent_item.item_id
JOIN LOT child_lot ON lt.child_lot_id = child_lot.lot_id
JOIN ITEM child_item ON child_lot.item_id = child_item.item_id
LEFT JOIN PROCESS_STEP_EXECUTION pse ON lt.process_step_execution_id = pse.process_step_execution_id
LEFT JOIN WORK_ORDER wo ON pse.work_order_id = wo.work_order_id
LEFT JOIN PROCESS_STEP ps ON pse.process_step_id = ps.step_id
START WITH lt.child_lot_id = :LotId
CONNECT BY NOCYCLE PRIOR lt.parent_lot_id = lt.child_lot_id
UNION ALL
SELECT lt.lot_trace_id AS LotRelationID,
       lt.parent_lot_id AS ParentLotID,
       parent_lot.lot_no AS ParentLotNo,
       parent_item.item_id AS ParentItemID,
       parent_item.item_name AS ParentItemName,
       lt.child_lot_id AS ChildLotID,
       child_lot.lot_no AS ChildLotNo,
       child_item.item_id AS ChildItemID,
       child_item.item_name AS ChildItemName,
       lt.trace_type AS RelationType,
       lt.input_qty AS InputQty,
       lt.output_qty AS OutputQty,
       lt.process_step_execution_id AS ProcessStepExecutionID,
       wo.work_order_no AS WorkOrderNo,
       ps.step_name AS StepName,
       lt.ref_type AS RefType,
       lt.ref_id AS RefID,
       lt.created_at AS CreatedAt,
       'CHILD' AS Direction,
       LEVEL AS TraceDepth
FROM LOT_TRACE lt
LEFT JOIN LOT parent_lot ON lt.parent_lot_id = parent_lot.lot_id
LEFT JOIN ITEM parent_item ON parent_lot.item_id = parent_item.item_id
JOIN LOT child_lot ON lt.child_lot_id = child_lot.lot_id
JOIN ITEM child_item ON child_lot.item_id = child_item.item_id
LEFT JOIN PROCESS_STEP_EXECUTION pse ON lt.process_step_execution_id = pse.process_step_execution_id
LEFT JOIN WORK_ORDER wo ON pse.work_order_id = wo.work_order_id
LEFT JOIN PROCESS_STEP ps ON pse.process_step_id = ps.step_id
START WITH lt.parent_lot_id = :LotId
CONNECT BY NOCYCLE PRIOR lt.child_lot_id = lt.parent_lot_id
ORDER BY Direction, TraceDepth, CreatedAt DESC
