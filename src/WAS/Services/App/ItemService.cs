using Shared.Models.App;
using Bogus;

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

        public async Task GenerateDummyItemsAsync(int count)
        {
            var faker = new Faker<ItemCreateDto>()
                .RuleFor(i => i.ItemName, f => f.Commerce.ProductName())
                .RuleFor(i => i.ItemType, f => f.PickRandom("RawMaterial", "Component", "Product"))
                .RuleFor(i => i.Unit, f => f.PickRandom("EA", "SET", "KG", "BOX", "M"))
                .RuleFor(i => i.Description, f => $"{f.Commerce.ProductAdjective()} - {f.Commerce.ProductDescription()}");

            var dummyItems = faker.Generate(count);

            foreach (var dummy in dummyItems)
            {
                await CreateItemAsync(dummy);
            }
        }
    }
}
