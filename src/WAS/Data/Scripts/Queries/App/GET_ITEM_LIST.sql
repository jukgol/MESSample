SELECT ITEM_ID, 
       ITEM_NAME, 
       CATEGORY AS ItemType, 
       UNIT,
       Description,
       CREATED_AT
FROM ITEM
ORDER BY ITEM_ID ASC
