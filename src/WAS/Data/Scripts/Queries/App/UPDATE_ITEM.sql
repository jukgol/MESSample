UPDATE ITEM
SET ITEM_CODE = :ItemCode,
    ITEM_NAME = :ItemName,
    CATEGORY = :ItemType,
    UNIT = :Unit,
    DESCRIPTION = :Description
WHERE ITEM_ID = :ItemId
