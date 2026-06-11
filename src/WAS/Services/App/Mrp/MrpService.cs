using Shared.Models.App;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WAS.Services.App
{
    public class MrpService : IMrpService
    {
        private readonly IScriptExecutor _scriptExecutor;

        public MrpService(IScriptExecutor scriptExecutor)
        {
            _scriptExecutor = scriptExecutor;
        }

        public async Task<IEnumerable<ProcessMasterDto>> GetMastersAsync()
        {
            return await _scriptExecutor.ExecuteQueryAsync<ProcessMasterDto>("App/Mrp/GET_MRP_MASTERS");
        }

        public async Task<MrpSimulationResultDto> SimulateAsync(MrpSimulationRequestDto request)
        {
            var rows = await _scriptExecutor.ExecuteQueryAsync<MrpSimulationRowDto>(
                "App/Mrp/GET_MRP_SIMULATION_ROWS",
                new { ProcessMasterId = request.ProcessMasterID });

            var steps = rows
                .GroupBy(row => new
                {
                    row.StepID,
                    row.StepName,
                    row.SeqNo,
                    row.StepType
                })
                .OrderBy(group => group.Key.SeqNo)
                .Select(group => new MrpStepDetailDto
                {
                    StepID = group.Key.StepID,
                    StepName = group.Key.StepName,
                    SeqNo = group.Key.SeqNo,
                    StepType = group.Key.StepType,
                    Items = group
                        .Where(row => row.BomID.HasValue && row.ChildItemID.HasValue && row.BomQty.HasValue)
                        .Select(row =>
                        {
                            var requiredQty = row.BomQty!.Value * request.TargetQty;
                            var shortage = requiredQty > row.CurrentStock ? requiredQty - row.CurrentStock : 0;

                            return new MrpItemDetailDto
                            {
                                BomID = row.BomID!.Value,
                                ChildItemID = row.ChildItemID!.Value,
                                ChildItemName = row.ChildItemName ?? string.Empty,
                                UnitQty = row.BomQty.Value,
                                RequiredQty = requiredQty,
                                CurrentStock = row.CurrentStock,
                                Shortage = shortage,
                                IsSufficient = row.CurrentStock >= requiredQty
                            };
                        })
                        .ToList()
                })
                .ToList();

            var totalItemsCount = steps.Sum(step => step.Items.Count);
            var shortageItemsCount = steps.Sum(step => step.Items.Count(item => !item.IsSufficient));

            return new MrpSimulationResultDto
            {
                Summary = new MrpSummaryDto
                {
                    TotalItemsCount = totalItemsCount,
                    ShortageItemsCount = shortageItemsCount,
                    IsFeasible = shortageItemsCount == 0
                },
                Steps = steps
            };
        }
    }
}
