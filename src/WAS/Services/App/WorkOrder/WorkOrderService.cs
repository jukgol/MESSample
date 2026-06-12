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
        private readonly IProcessInputService _processInputService;
        private readonly IProcessOutputService _processOutputService;
        private readonly IProcessMonitoringService _processMonitoringService;
        private readonly IProcessMonitoringStateStore _processMonitoringStateStore;

        public WorkOrderService(
            IScriptExecutor scriptExecutor,
            IProcessInputService processInputService,
            IProcessOutputService processOutputService,
            IProcessMonitoringService processMonitoringService,
            IProcessMonitoringStateStore processMonitoringStateStore)
        {
            _scriptExecutor = scriptExecutor;
            _processInputService = processInputService;
            _processOutputService = processOutputService;
            _processMonitoringService = processMonitoringService;
            _processMonitoringStateStore = processMonitoringStateStore;
        }

        public async Task<IEnumerable<ProcessMasterDto>> GetMastersAsync()
        {
            return await _scriptExecutor.ExecuteQueryAsync<ProcessMasterDto>("App/WorkOrder/GET_WORK_ORDER_MASTERS");
        }

        public async Task<IEnumerable<WorkOrderHistoryDto>> GetHistoryAsync()
        {
            return await _scriptExecutor.ExecuteQueryAsync<WorkOrderHistoryDto>("App/WorkOrder/GET_WORK_ORDER_HISTORY");
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
            var hasActiveWorkOrder = _processMonitoringStateStore
                .GetCurrentWorkOrders()
                .Any(workOrder => workOrder.ProcessMasterID == request.ProcessMasterID);

            if (hasActiveWorkOrder)
            {
                throw new InvalidOperationException("해당 공정 라인은 이미 진행 중인 작업지시가 있습니다.");
            }

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

                await _scriptExecutor.ExecuteNonQueryAsync(
                    "App/WorkOrder/CREATE_WORK_ORDER_STEP_EXECUTIONS",
                    new { WorkOrderNo = workOrderNo });

                await _processInputService.ReserveWorkOrderInputLotsAsync(workOrderNo);
                await _processOutputService.EnsureInitialOutputsByWorkOrderNoAsync(workOrderNo);

                await _processMonitoringService.AddWorkOrderToCurrentStateAsync(workOrderNo);
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
                    IsAvailable = group.Any(row => row.BomID.HasValue && row.BomQty.HasValue)
                        && group
                            .Where(row => row.BomID.HasValue && row.BomQty.HasValue)
                            .All(row => row.CurrentStock >= row.BomQty!.Value * orderQty)
                })
                .ToList();
        }

    }
}
