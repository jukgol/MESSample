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

            // 방어 코드: 등록된 자재가 없는 경우, 임시 자재 생성
            if (itemIds.Count == 0)
            {
                await _itemService.CreateItemAsync(new ItemCreateDto
                {
                    ItemName = "임시 테스트용 PCB A타입",
                    ItemType = "원자재",
                    Unit = "개",
                    Description = "테스트 데이터 생성기가 자동으로 등록한 마스터 정보입니다."
                });
                await _itemService.CreateItemAsync(new ItemCreateDto
                {
                    ItemName = "임시 테스트용 저항칩 R01",
                    ItemType = "부품",
                    Unit = "개",
                    Description = "테스트 데이터 생성기가 자동으로 등록한 마스터 정보입니다."
                });

                // 다시 자재 목록 로드
                items = await _itemService.GetItemsAsync();
                itemIds = items.Select(x => x.ItemID).ToList();
            }

            // Bogus 룰 정의
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
