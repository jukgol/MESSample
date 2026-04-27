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
            return await _scriptExecutor.ExecuteQueryAsync<ItemDto>("App/GET_ITEM_LIST");
        }
    }
}
