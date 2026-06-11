using Shared.Models.App;
using System.IO;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using System.Linq;

namespace WAS.Services.App
{
    public class ItemService : IItemService
    {
        private readonly IScriptExecutor _scriptExecutor;
        private readonly ILogger<ItemService> _logger;

        public ItemService(IScriptExecutor scriptExecutor, ILogger<ItemService> logger)
        {
            _scriptExecutor = scriptExecutor;
            _logger = logger;
        }

        public async Task<IEnumerable<ItemDto>> GetItemsAsync()
        {
            return await _scriptExecutor.ExecuteQueryAsync<ItemDto>("App/Item/GET_ITEM_LIST");
        }

        public async Task CreateItemAsync(ItemCreateDto dto)
        {
            await _scriptExecutor.ExecuteNonQueryAsync("App/Item/CREATE_ITEM", new
            {
                ItemCode = dto.ItemCode,
                ItemName = dto.ItemName,
                ItemType = dto.ItemType,
                Unit = dto.Unit,
                Description = dto.Description
            });
        }

        public async Task UpdateItemAsync(int id, ItemUpdateDto dto)
        {
            await _scriptExecutor.ExecuteNonQueryAsync("App/Item/UPDATE_ITEM", new
            {
                ItemId = id,
                ItemCode = dto.ItemCode,
                ItemName = dto.ItemName,
                ItemType = dto.ItemType,
                Unit = dto.Unit,
                Description = dto.Description
            });
        }

        public async Task DeleteItemAsync(int id)
        {
            await _scriptExecutor.ExecuteNonQueryAsync("App/Item/DELETE_ITEM", new
            {
                ItemId = id
            });
        }

        public async Task LoadScenarioItemsAsync()
        {
            var currentDir = Directory.GetCurrentDirectory();
            var path = Path.Combine(currentDir, "..", "senario", "data", "item.json");

            if (!File.Exists(path))
            {
                var dir = currentDir;
                while (dir != null && !File.Exists(Path.Combine(dir, "senario", "data", "item.json")))
                {
                    dir = Directory.GetParent(dir)?.FullName;
                }

                if (dir != null)
                {
                    path = Path.Combine(dir, "senario", "data", "item.json");
                }
            }

            if (!File.Exists(path))
            {
                _logger.LogError("Scenario item JSON file not found at: {Path}", path);
                throw new FileNotFoundException($"시나리오 자재 데이터 파일을 찾을 수 없습니다: {path}");
            }

            var jsonText = await File.ReadAllTextAsync(path);
            var options = new JsonSerializerOptions 
            { 
                PropertyNameCaseInsensitive = true,
                PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower
            };
            var items = JsonSerializer.Deserialize<List<ItemCreateDto>>(jsonText, options);

            if (items == null || items.Count == 0)
            {
                _logger.LogWarning("Scenario item list is empty or invalid in JSON.");
                return;
            }

            foreach (var item in items)
            {
                var existing = await _scriptExecutor.ExecuteQueryAsync<ItemDto>("App/Item/GET_ITEM_BY_CODE", new { ItemCode = item.ItemCode });
                var existingItem = existing.FirstOrDefault();
                if (existingItem != null)
                {
                    await UpdateItemAsync(existingItem.ItemID, new ItemUpdateDto
                    {
                        ItemCode = item.ItemCode,
                        ItemName = item.ItemName,
                        ItemType = item.ItemType,
                        Unit = item.Unit,
                        Description = item.Description
                    });
                    _logger.LogInformation("[UPDATE] {ItemName} ({ItemCode}) 업데이트 완료", item.ItemName, item.ItemCode);
                }
                else
                {
                    await CreateItemAsync(item);
                    _logger.LogInformation("[INSERT] {ItemName} ({ItemCode}) 추가 완료", item.ItemName, item.ItemCode);
                }
            }
        }
    }
}
