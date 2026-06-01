using Shared.Models.App;
using Bogus;
using System.Linq;

namespace WAS.Services.App
{
    public class LotService : ILotService
    {
        private readonly IScriptExecutor _scriptExecutor;
        private readonly IItemService _itemService;

        public LotService(IScriptExecutor scriptExecutor, IItemService itemService)
        {
            _scriptExecutor = scriptExecutor;
            _itemService = itemService;
        }

        public async Task<IEnumerable<LotDto>> GetLotsAsync()
        {
            return await _scriptExecutor.ExecuteQueryAsync<LotDto>("App/GET_LOT_LIST");
        }

        public async Task CreateLotAsync(LotCreateDto dto)
        {
            await _scriptExecutor.ExecuteNonQueryAsync("App/CREATE_LOT", new
            {
                ItemId = dto.ItemID,
                LotNo = dto.LotNo,
                Qty = dto.Qty,
                Status = dto.Status
            });
        }

        public async Task UpdateLotAsync(int id, LotUpdateDto dto)
        {
            await _scriptExecutor.ExecuteNonQueryAsync("App/UPDATE_LOT", new
            {
                LotId = id,
                Qty = dto.Qty,
                Status = dto.Status
            });
        }

        public async Task DeleteLotAsync(int id)
        {
            await _scriptExecutor.ExecuteNonQueryAsync("App/DELETE_LOT", new
            {
                LotId = id
            });
        }

        public async Task GenerateDummyLotsAsync(int count)
        {
            var items = await _itemService.GetItemsAsync();
            var itemIds = items.Select(x => x.ItemID).ToList();

            // Fallback: If no items are registered, create dummy items
            if (itemIds.Count == 0)
            {
                await _itemService.CreateItemAsync(new ItemCreateDto
                {
                    ItemName = "Dummy PCB Type A",
                    ItemType = "RawMaterial",
                    Unit = "EA",
                    Description = "Auto-generated master item for testing."
                });
                await _itemService.CreateItemAsync(new ItemCreateDto
                {
                    ItemName = "Dummy Resistor R01",
                    ItemType = "Component",
                    Unit = "EA",
                    Description = "Auto-generated master item for testing."
                });

                // Reload items
                items = await _itemService.GetItemsAsync();
                itemIds = items.Select(x => x.ItemID).ToList();
            }

            // Define Bogus fake data rules
            var faker = new Faker<LotCreateDto>()
                .RuleFor(l => l.ItemID, f => f.PickRandom(itemIds))
                .RuleFor(l => l.LotNo, f => $"LOT-{f.Date.Recent():yyyyMMdd}-{f.Random.AlphaNumeric(4).ToUpper()}")
                .RuleFor(l => l.Qty, f => f.Random.Number(10, 1000))
                .RuleFor(l => l.Status, f => f.PickRandom("입고대기", "공정중", "검사중", "완료"));

            var dummyLots = faker.Generate(count);

            foreach (var dummy in dummyLots)
            {
                await CreateLotAsync(dummy);
            }
        }
    }
}
