using Shared.Models.App;

namespace WAS.Services.App
{
    public class ItemTypeService : IItemTypeService
    {
        private readonly IScriptExecutor _scriptExecutor;

        public ItemTypeService(IScriptExecutor scriptExecutor)
        {
            _scriptExecutor = scriptExecutor;
        }

        public async Task<IEnumerable<ItemTypeDto>> GetItemTypesAsync()
        {
            return await _scriptExecutor.ExecuteQueryAsync<ItemTypeDto>("App/ItemType/GET_ITEM_TYPE_LIST");
        }

        public async Task CreateItemTypeAsync(ItemTypeCreateDto dto)
        {
            await _scriptExecutor.ExecuteNonQueryAsync("App/ItemType/CREATE_ITEM_TYPE", new
            {
                TypeName = dto.TypeName
            });
        }

        public async Task UpdateItemTypeAsync(int id, ItemTypeUpdateDto dto)
        {
            await _scriptExecutor.ExecuteNonQueryAsync("App/ItemType/UPDATE_ITEM_TYPE", new
            {
                ItemTypeId = id,
                TypeName = dto.TypeName
            });
        }

        public async Task DeleteItemTypeAsync(int id)
        {
            await _scriptExecutor.ExecuteNonQueryAsync("App/ItemType/DELETE_ITEM_TYPE", new
            {
                ItemTypeId = id
            });
        }
    }
}
