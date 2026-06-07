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
                BomQty = dto.BomQty,
                ProcessStepId = dto.ProcessStepID
            });
        }

        public async Task UpdateBomAsync(int id, BomUpdateDto dto)
        {
            await _scriptExecutor.ExecuteNonQueryAsync("App/Bom/UPDATE_BOM", new
            {
                BomId = id,
                BomQty = dto.BomQty,
                ProcessStepId = dto.ProcessStepID
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
            var options = new JsonSerializerOptions 
            { 
                PropertyNameCaseInsensitive = true,
                PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower
            };
            var boms = JsonSerializer.Deserialize<List<BomScenarioDto>>(jsonText, options);

            if (boms == null || boms.Count == 0)
            {
                _logger.LogWarning("Scenario BOM list is empty or invalid in JSON.");
                return;
            }

            foreach (var bom in boms)
            {
                var parentItemResult = await _scriptExecutor.ExecuteQueryAsync<ItemDto>("App/Item/GET_ITEM_BY_CODE", new { ItemCode = bom.ParentItemCode });
                var parentItem = parentItemResult.FirstOrDefault();
                if (parentItem == null)
                {
                    _logger.LogWarning("[WARN] 부모 품목 코드({ParentCode})가 등록되어 있지 않아 BOM을 스킵합니다.", bom.ParentItemCode);
                    continue;
                }

                var childItemResult = await _scriptExecutor.ExecuteQueryAsync<ItemDto>("App/Item/GET_ITEM_BY_CODE", new { ItemCode = bom.ChildItemCode });
                var childItem = childItemResult.FirstOrDefault();
                if (childItem == null)
                {
                    _logger.LogWarning("[WARN] 자식 품목 코드({ChildCode})가 등록되어 있지 않아 BOM을 스킵합니다.", bom.ChildItemCode);
                    continue;
                }

                var parentId = parentItem.ItemID;
                var childId = childItem.ItemID;

                int? processStepId = null;
                if (!string.IsNullOrEmpty(bom.ProcessStepName))
                {
                    var stepResult = await _scriptExecutor.ExecuteQueryAsync<ProcessStepDto>("App/ProcessStep/GET_PROCESS_STEP_BY_NAME", new { StepName = bom.ProcessStepName });
                    var step = stepResult.FirstOrDefault();
                    if (step != null)
                    {
                        processStepId = step.StepID;
                    }
                }

                var existingBomResult = await _scriptExecutor.ExecuteQueryAsync<BomDto>("App/Bom/GET_BOM_BY_RELATION", new { ParentItemId = parentId, ChildItemId = childId });
                if (existingBomResult.Any())
                {
                    _logger.LogInformation("[SKIP] BOM: {ParentCode} -> {ChildCode} 이미 존재함", bom.ParentItemCode, bom.ChildItemCode);
                }
                else
                {
                    await CreateBomAsync(new BomCreateDto
                    {
                        ParentItemID = parentId,
                        ChildItemID = childId,
                        BomQty = bom.BomQty,
                        ProcessStepID = processStepId
                    });
                    _logger.LogInformation("[INSERT] BOM: {ParentCode} -> {ChildCode} (Qty: {Qty}, Step: {StepName}) 추가 완료", bom.ParentItemCode, bom.ChildItemCode, bom.BomQty, bom.ProcessStepName);
                }
            }
        }
    }
}
