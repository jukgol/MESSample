using Shared.Models.App;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WAS.Services.App
{
    public class WorkOrderService : IWorkOrderService
    {
        private readonly IScriptExecutor _scriptExecutor;

        public WorkOrderService(IScriptExecutor scriptExecutor)
        {
            _scriptExecutor = scriptExecutor;
        }

        public async Task<IEnumerable<ProcessMasterDto>> GetMastersAsync()
        {
            return await _scriptExecutor.ExecuteQueryAsync<ProcessMasterDto>("App/WorkOrder/GET_WORK_ORDER_MASTERS");
        }

        public async Task<WorkOrderPreviewDto> GetPreviewAsync(WorkOrderPreviewRequestDto request)
        {
            var steps = await BuildStepAvailabilityAsync(request.ProcessMasterID, request.OrderQty);

            return new WorkOrderPreviewDto
            {
                ProcessMasterID = request.ProcessMasterID,
                OrderQty = request.OrderQty,
                IsAvailable = steps.All(step => step.IsAvailable),
                Steps = steps
            };
        }

        public async Task<WorkOrderCreateResultDto> CreateAsync(WorkOrderCreateRequestDto request)
        {
            var steps = await BuildStepAvailabilityAsync(request.ProcessMasterID, request.OrderQty);
            var isApproved = steps.All(step => step.IsAvailable);
            var approvedAt = DateTime.Now;
            var workOrderNo = $"WO-{approvedAt:yyyyMMddHHmmss}";

            if (isApproved)
            {
                await _scriptExecutor.ExecuteNonQueryAsync(
                    "App/WorkOrder/CREATE_WORK_ORDER",
                    new
                    {
                        WorkOrderNo = workOrderNo,
                        ProcessMasterId = request.ProcessMasterID,
                        OrderQty = request.OrderQty,
                        WorkerUserId = request.WorkerUserID,
                        WorkerName = request.WorkerName.Trim(),
                        IsAvailable = "Y"
                    });
            }

            return new WorkOrderCreateResultDto
            {
                WorkOrderNo = workOrderNo,
                ProcessMasterID = request.ProcessMasterID,
                OrderQty = request.OrderQty,
                WorkerUserID = request.WorkerUserID,
                WorkerName = request.WorkerName.Trim(),
                IsApproved = isApproved,
                ApprovedAt = approvedAt,
                Steps = steps
            };
        }

        private async Task<List<WorkOrderStepAvailabilityDto>> BuildStepAvailabilityAsync(int processMasterId, int orderQty)
        {
            var rows = await _scriptExecutor.ExecuteQueryAsync<WorkOrderStepRowDto>(
                "App/WorkOrder/GET_WORK_ORDER_STEP_AVAILABILITY_ROWS",
                new { ProcessMasterId = processMasterId });

            return rows
                .GroupBy(row => new { row.StepID, row.StepName, row.SeqNo })
                .OrderBy(group => group.Key.SeqNo)
                .Select(group => new WorkOrderStepAvailabilityDto
                {
                    StepID = group.Key.StepID,
                    StepName = group.Key.StepName,
                    SeqNo = group.Key.SeqNo,
                    IsAvailable = group
                        .Where(row => row.BomID.HasValue && row.BomQty.HasValue)
                        .All(row => row.CurrentStock >= row.BomQty!.Value * orderQty)
                })
                .ToList();
        }
    }
}
