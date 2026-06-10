using Shared.Models.App;
using System.Collections.Generic;

namespace WAS.Services.App
{
    public interface IProcessMonitoringStateStore
    {
        IReadOnlyCollection<CurrentWorkOrderStateDto> GetCurrentWorkOrders();
        CurrentWorkOrderStateDto? GetCurrentWorkOrder(int workOrderId);
        CurrentProcessStepStateDto? GetCurrentStepByEquipment(string equipmentId);
        CurrentProcessStepStateDto? GetCurrentStepByExecution(int executionId);
        void ReplaceAll(
            IEnumerable<ProcessStepExecutionDto> executions,
            IEnumerable<ProcessInputDto> inputs,
            IEnumerable<ProcessOutputDto> outputs);
    }
}
