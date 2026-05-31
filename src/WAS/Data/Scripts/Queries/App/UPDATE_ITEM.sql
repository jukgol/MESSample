UPDATE ITEM
SET ITEM_NAME = :ItemName,
    CATEGORY = :ItemType,
    UNIT = :Unit,
    DESCRIPTION = :Description
WHERE ITEM_ID = :ItemId
