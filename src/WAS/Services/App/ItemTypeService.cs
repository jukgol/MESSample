using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Shared.Models.App;

namespace WAS.Services.App
{
    public class ItemTypeService : IItemTypeService
    {
        private readonly IScriptExecutor _scriptExecutor;
        private readonly ILogger<ItemTypeService> _logger;

        public ItemTypeService(IScriptExecutor scriptExecutor, ILogger<ItemTypeService> logger)
        {
            _scriptExecutor = scriptExecutor;
            _logger = logger;
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

        public async Task LoadScenarioItemTypesAsync()
        {
            var currentDir = Directory.GetCurrentDirectory();
            var path = Path.Combine(currentDir, "..", "senario", "data", "itemtype.json");

            if (!File.Exists(path))
            {
                var dir = currentDir;
                while (dir != null && !File.Exists(Path.Combine(dir, "senario", "data", "itemtype.json")))
                {
                    dir = Directory.GetParent(dir)?.FullName;
                }

                if (dir != null)
                {
                    path = Path.Combine(dir, "senario", "data", "itemtype.json");
                }
            }

            if (!File.Exists(path))
            {
                _logger.LogError("Scenario item type JSON file not found at: {Path}", path);
                throw new FileNotFoundException($"시나리오 품목 유형 데이터 파일을 찾을 수 없습니다: {path}");
            }

            var jsonText = await File.ReadAllTextAsync(path);
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var itemTypes = JsonSerializer.Deserialize<List<ItemTypeCreateDto>>(jsonText, options);

            if (itemTypes == null || itemTypes.Count == 0)
            {
                _logger.LogWarning("Scenario item type list is empty or invalid in JSON.");
                return;
            }

            var dbItemTypes = await GetItemTypesAsync();
            var existingNames = dbItemTypes.Select(x => x.TypeName).ToHashSet();

            foreach (var it in itemTypes)
            {
                if (existingNames.Contains(it.TypeName))
                {
                    _logger.LogInformation("[SKIP] {TypeName} 이미 존재함", it.TypeName);
                }
                else
                {
                    await CreateItemTypeAsync(it);
                    _logger.LogInformation("[INSERT] {TypeName} 추가 완료", it.TypeName);
                }
            }
        }
    }
}
