SELECT ITEM_CODE as ItemCode, 
       ITEM_NAME as ItemName, 
       ITEM_TYPE as ItemType, 
       UNIT, 
       IS_ACTIVE as IsActive, 
       CREATED_AT as CreatedAt
FROM ITEM
ORDER BY ITEM_CODE ASC
