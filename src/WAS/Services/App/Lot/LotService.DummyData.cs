using Bogus;
using Shared.Models.App;

namespace WAS.Services.App
{
    public partial class LotService
    {
        public async Task GenerateDummyLotsAsync(int count)
        {
            var items = await _itemService.GetItemsAsync();
            var itemIds = items.Select(x => x.ItemID).ToList();

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

                items = await _itemService.GetItemsAsync();
                itemIds = items.Select(x => x.ItemID).ToList();
            }

            var faker = new Faker<LotCreateDto>()
                .RuleFor(l => l.ItemID, f => f.PickRandom(itemIds))
                .RuleFor(l => l.LotNo, f => $"LOT-{f.Date.Recent():yyyyMMdd}-{f.Random.AlphaNumeric(4).ToUpper()}")
                .RuleFor(l => l.Qty, f => f.Random.Number(10, 1000))
                .RuleFor(l => l.Status, f => f.PickRandom("RECEIVED", "IN_PROGRESS", "INSPECTION", "DONE"));

            var dummyLots = faker.Generate(count);

            foreach (var dummy in dummyLots)
            {
                await CreateLotAsync(dummy);
            }
        }
    }
}
