using Shared.Models.App;

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

        public async Task CreateItemAsync(ItemCreateDto dto)
        {
            await _scriptExecutor.ExecuteNonQueryAsync("App/CREATE_ITEM", new
            {
                ItemName = dto.ItemName,
                ItemType = dto.ItemType,
                Unit = dto.Unit,
                Description = dto.Description
            });
        }

        public async Task UpdateItemAsync(int id, ItemUpdateDto dto)
        {
            await _scriptExecutor.ExecuteNonQueryAsync("App/UPDATE_ITEM", new
            {
                ItemId = id,
                ItemName = dto.ItemName,
                ItemType = dto.ItemType,
                Unit = dto.Unit,
                Description = dto.Description
            });
        }

        public async Task DeleteItemAsync(int id)
        {
            await _scriptExecutor.ExecuteNonQueryAsync("App/DELETE_ITEM", new
            {
                ItemId = id
            });
        }
    }
}
