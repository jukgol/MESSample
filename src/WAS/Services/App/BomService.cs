using Shared.Models.App;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.IO;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using System.Linq;
using System;

namespace WAS.Services.App
{
    public class BomService : IBomService
    {
        private readonly IScriptExecutor _scriptExecutor;
        private readonly IItemService _itemService;
        private readonly ILogger<BomService> _logger;

        public BomService(IScriptExecutor scriptExecutor, IItemService itemService, ILogger<BomService> logger)
        {
            _scriptExecutor = scriptExecutor;
            _itemService = itemService;
            _logger = logger;
        }

        public async Task<IEnumerable<BomDto>> GetBomsByParentAsync(int parentId)
        {
            return await _scriptExecutor.ExecuteQueryAsync<BomDto>("App/Bom/GET_BOM_BY_PARENT", new { ParentItemId = parentId });
        }

        public async Task CreateBomAsync(BomCreateDto dto)
        {
            await _scriptExecutor.ExecuteNonQueryAsync("App/Bom/CREATE_BOM", new
            {
                ParentItemId = dto.ParentItemID,
                ChildItemId = dto.ChildItemID,
                BomQty = dto.BomQty
            });
        }

        public async Task UpdateBomAsync(int id, BomUpdateDto dto)
        {
            await _scriptExecutor.ExecuteNonQueryAsync("App/Bom/UPDATE_BOM", new
            {
                BomId = id,
                BomQty = dto.BomQty
            });
        }

        public async Task DeleteBomAsync(int id)
        {
            await _scriptExecutor.ExecuteNonQueryAsync("App/Bom/DELETE_BOM", new
            {
                BomId = id
            });
        }

        public async Task LoadScenarioBomsAsync()
        {
            var currentDir = Directory.GetCurrentDirectory();
            var path = Path.Combine(currentDir, "..", "senario", "data", "bom.json");

            if (!File.Exists(path))
            {
                var dir = currentDir;
                while (dir != null && !File.Exists(Path.Combine(dir, "senario", "data", "bom.json")))
                {
                    dir = Directory.GetParent(dir)?.FullName;
                }

                if (dir != null)
                {
                    path = Path.Combine(dir, "senario", "data", "bom.json");
                }
            }

            if (!File.Exists(path))
            {
                _logger.LogError("Scenario BOM JSON file not found at: {Path}", path);
                throw new FileNotFoundException($"시나리오 BOM 레시피 파일을 찾을 수 없습니다: {path}");
            }

            var jsonText = await File.ReadAllTextAsync(path);
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var boms = JsonSerializer.Deserialize<List<BomScenarioDto>>(jsonText, options);

            if (boms == null || boms.Count == 0)
            {
                _logger.LogWarning("Scenario BOM list is empty or invalid in JSON.");
                return;
            }

            // 품목 코드 -> 품목 ID 매핑용 딕셔너리 구성
            var items = await _itemService.GetItemsAsync();
            var itemMap = items.ToDictionary(x => x.ItemCode, x => x.ItemID);

            // 기존 등록된 전체 BOM 목록 조회 (중복 사전 방지용)
            var dbBoms = await _scriptExecutor.ExecuteQueryAsync<BomDto>("App/Bom/GET_BOM_LIST");
            var existingBoms = dbBoms.Select(x => (x.ParentItemID, x.ChildItemID)).ToHashSet();

            foreach (var bom in boms)
            {
                if (!itemMap.TryGetValue(bom.ParentItemCode, out var parentId))
                {
                    _logger.LogWarning("[WARN] 부모 품목 코드({ParentCode})가 등록되어 있지 않아 BOM을 스킵합니다.", bom.ParentItemCode);
                    continue;
                }

                if (!itemMap.TryGetValue(bom.ChildItemCode, out var childId))
                {
                    _logger.LogWarning("[WARN] 자식 품목 코드({ChildCode})가 등록되어 있지 않아 BOM을 스킵합니다.", bom.ChildItemCode);
                    continue;
                }

                if (existingBoms.Contains((parentId, childId)))
                {
                    _logger.LogInformation("[SKIP] BOM: {ParentCode} -> {ChildCode} 이미 존재함", bom.ParentItemCode, bom.ChildItemCode);
                }
                else
                {
                    await CreateBomAsync(new BomCreateDto
                    {
                        ParentItemID = parentId,
                        ChildItemID = childId,
                        BomQty = bom.BomQty
                    });
                    _logger.LogInformation("[INSERT] BOM: {ParentCode} -> {ChildCode} (Qty: {Qty}) 추가 완료", bom.ParentItemCode, bom.ChildItemCode, bom.BomQty);
                }
            }
        }
    }
}
