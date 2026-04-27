using WAS.Models.App;

namespace WAS.Services.App
{
    public class ItemService : IItemService
    {
        private readonly IScriptExecutor _scriptExecutor;

        public ItemService(IScriptExecutor scriptExecutor)
        {
            _scriptExecutor = scriptExecutor;
        }

        public async Task<IEnumerable<ItemDto>> GetItemsAsync()
        {
            var sql = @"
                SELECT ITEM_CODE as ItemCode, 
                       ITEM_NAME as ItemName, 
                       ITEM_TYPE as ItemType, 
                       UNIT, 
                       IS_ACTIVE as IsActive, 
                       CREATED_AT as CreatedAt
                FROM ITEM
                ORDER BY ITEM_CODE ASC";

            return await _scriptExecutor.ExecuteQueryAsync<ItemDto>(sql, null, isRawSql: true);
        }
    }
}
