SELECT ITEM_ID, 
       ITEM_CODE,
       ITEM_NAME, 
       CATEGORY AS ItemType, 
       UNIT,
       Description,
       CREATED_AT
FROM ITEM
WHERE ITEM_CODE = :ItemCode
