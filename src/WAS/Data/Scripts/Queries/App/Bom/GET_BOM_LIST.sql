SELECT B.BOM_ID,
       B.PARENT_ITEM_ID AS ParentItemID,
       B.CHILD_ITEM_ID AS ChildItemID,
       B.BOM_QTY AS BomQty,
       B.PROCESS_STEP_ID AS ProcessStepID
FROM BOM B
