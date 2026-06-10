using Shared.Models.App;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WAS.Services.App
{
    public class ProcessMonitoringService : IProcessMonitoringService
    {
        private readonly IScriptExecutor _scriptExecutor;
        private readonly IProcessMonitoringStateStore _stateStore;

        public ProcessMonitoringService(IScriptExecutor scriptExecutor, IProcessMonitoringStateStore stateStore)
        {
            _scriptExecutor = scriptExecutor;
            _stateStore = stateStore;
        }

        public async Task<IEnumerable<CurrentWorkOrderStateDto>> GetCurrentWorkOrdersAsync()
        {
            await EnsureCurrentStateLoadedAsync();
            return _stateStore.GetCurrentWorkOrders();
        }

        public async Task<CurrentWorkOrderStateDto?> GetCurrentWorkOrderAsync(int workOrderId)
        {
            await EnsureCurrentStateLoadedAsync();
            return _stateStore.GetCurrentWorkOrder(workOrderId);
        }

        public async Task<CurrentProcessStepStateDto?> GetCurrentStepByEquipmentAsync(string equipmentId)
        {
            await EnsureCurrentStateLoadedAsync();
            return _stateStore.GetCurrentStepByEquipment(equipmentId);
        }

        public async Task ReloadCurrentStateAsync()
        {
            var executions = await _scriptExecutor.ExecuteQueryAsync<ProcessStepExecutionDto>(
                "App/ProcessMonitoring/GET_CURRENT_EXECUTIONS");
            var inputs = await _scriptExecutor.ExecuteQueryAsync<ProcessInputDto>(
                "App/ProcessMonitoring/GET_CURRENT_INPUTS");
            var outputs = await _scriptExecutor.ExecuteQueryAsync<ProcessOutputDto>(
                "App/ProcessMonitoring/GET_CURRENT_OUTPUTS");

            _stateStore.ReplaceAll(executions, inputs, outputs);
        }

        public async Task<IEnumerable<ProcessStepExecutionDto>> GetExecutionsByWorkOrderAsync(int workOrderId)
        {
            return await _scriptExecutor.ExecuteQueryAsync<ProcessStepExecutionDto>(
                "App/ProcessMonitoring/GET_EXECUTIONS_BY_WORK_ORDER",
                new { WorkOrderId = workOrderId });
        }

        public async Task<IEnumerable<ProcessStepExecutionDto>> GetAllExecutionsAsync()
        {
            return await _scriptExecutor.ExecuteQueryAsync<ProcessStepExecutionDto>(
                "App/ProcessMonitoring/GET_ALL_EXECUTIONS");
        }

        public async Task<ProcessStepExecutionDto?> GetExecutionByIdAsync(int executionId)
        {
            var rows = await _scriptExecutor.ExecuteQueryAsync<ProcessStepExecutionDto>(
                "App/ProcessMonitoring/GET_EXECUTION_BY_ID",
                new { ExecutionId = executionId });

            return rows.FirstOrDefault();
        }

        public async Task CreateExecutionAsync(ProcessStepExecutionCreateDto dto)
        {
            await _scriptExecutor.ExecuteNonQueryAsync(
                "App/ProcessMonitoring/CREATE_EXECUTION",
                new
                {
                    WorkOrderId = dto.WorkOrderID,
                    ProcessStepId = dto.ProcessStepID,
                    EquipmentId = string.IsNullOrWhiteSpace(dto.EquipmentID) ? null : dto.EquipmentID.Trim(),
                    WorkerUserId = dto.WorkerUserID,
                    Status = string.IsNullOrWhiteSpace(dto.Status) ? "WAITING" : dto.Status.Trim().ToUpperInvariant()
                });

            await ReloadCurrentStateAsync();
        }

        public async Task<IEnumerable<ProcessInputDto>> GetInputsAsync(int executionId)
        {
            return await _scriptExecutor.ExecuteQueryAsync<ProcessInputDto>(
                "App/ProcessMonitoring/GET_INPUTS_BY_EXECUTION",
                new { ExecutionId = executionId });
        }

        public async Task CreateInputAsync(int executionId, ProcessInputCreateDto dto)
        {
            await _scriptExecutor.ExecuteNonQueryAsync(
                "App/ProcessMonitoring/CREATE_INPUT",
                new
                {
                    ExecutionId = executionId,
                    LotId = dto.LotID,
                    ItemId = dto.ItemID,
                    InputQty = dto.InputQty,
                    UsedQty = dto.UsedQty,
                    RemainQty = dto.RemainQty ?? dto.InputQty - dto.UsedQty
                });

            await ReloadCurrentStateAsync();
        }

        public async Task UpdateInputQuantityAsync(int inputId, ProcessInputQuantityUpdateDto dto)
        {
            await _scriptExecutor.ExecuteNonQueryAsync(
                "App/ProcessMonitoring/UPDATE_INPUT_QUANTITY",
                new
                {
                    InputId = inputId,
                    UsedQty = dto.UsedQty,
                    RemainQty = dto.RemainQty
                });

            await ReloadCurrentStateAsync();
        }

        public async Task<IEnumerable<ProcessOutputDto>> GetOutputsAsync(int executionId)
        {
            return await _scriptExecutor.ExecuteQueryAsync<ProcessOutputDto>(
                "App/ProcessMonitoring/GET_OUTPUTS_BY_EXECUTION",
                new { ExecutionId = executionId });
        }

        public async Task CreateOutputAsync(int executionId, ProcessOutputCreateDto dto)
        {
            await _scriptExecutor.ExecuteNonQueryAsync(
                "App/ProcessMonitoring/CREATE_OUTPUT",
                new
                {
                    ExecutionId = executionId,
                    LotId = dto.LotID,
                    ItemId = dto.ItemID,
                    TargetQty = dto.TargetQty,
                    OutputQty = dto.OutputQty,
                    OutputType = string.IsNullOrWhiteSpace(dto.OutputType) ? "GOOD" : dto.OutputType.Trim().ToUpperInvariant()
                });

            await ReloadCurrentStateAsync();
        }

        public async Task UpdateOutputQuantityAsync(int outputId, ProcessOutputQuantityUpdateDto dto)
        {
            await _scriptExecutor.ExecuteNonQueryAsync(
                "App/ProcessMonitoring/UPDATE_OUTPUT_QUANTITY",
                new
                {
                    OutputId = outputId,
                    OutputQty = dto.OutputQty
                });

            await ReloadCurrentStateAsync();
        }

        private async Task EnsureCurrentStateLoadedAsync()
        {
            if (!_stateStore.GetCurrentWorkOrders().Any())
            {
                await ReloadCurrentStateAsync();
            }
        }
    }
}
