using Shared.Models.App;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace WAS.Services.App
{
    public class ProcessMonitoringService : IProcessMonitoringService
    {
        private readonly IScriptExecutor _scriptExecutor;
        private readonly IProcessMonitoringStateStore _stateStore;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly string _startToolBaseUrl;

        public ProcessMonitoringService(
            IScriptExecutor scriptExecutor,
            IProcessMonitoringStateStore stateStore,
            IHttpClientFactory httpClientFactory,
            IConfiguration configuration)
        {
            _scriptExecutor = scriptExecutor;
            _stateStore = stateStore;
            _httpClientFactory = httpClientFactory;
            _startToolBaseUrl = configuration["StartTool:BaseUrl"] ?? "http://localhost:9090";
        }

        public async Task<IEnumerable<CurrentWorkOrderStateDto>> GetCurrentWorkOrdersAsync()
        {
            await Task.CompletedTask;
            return _stateStore.GetCurrentWorkOrders();
        }

        public async Task<CurrentWorkOrderStateDto?> GetCurrentWorkOrderAsync(int workOrderId)
        {
            await Task.CompletedTask;
            return _stateStore.GetCurrentWorkOrder(workOrderId);
        }

        public async Task<CurrentProcessStepStateDto?> GetCurrentStepByEquipmentAsync(string equipmentId)
        {
            await Task.CompletedTask;
            return _stateStore.GetCurrentStepByEquipment(equipmentId);
        }

        public async Task DeleteCurrentProcessMasterAsync(int processMasterId)
        {
            if (processMasterId <= 0)
            {
                throw new ArgumentException("ProcessMasterID must be greater than zero.");
            }

            await _scriptExecutor.ExecuteNonQueryAsync(
                "App/ProcessMonitoring/DELETE_CURRENT_PROCESS_MASTER",
                new { ProcessMasterId = processMasterId });

            await ReloadCurrentStateAsync();
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

        public async Task AddWorkOrderToCurrentStateAsync(string workOrderNo)
        {
            var executions = await _scriptExecutor.ExecuteQueryAsync<ProcessStepExecutionDto>(
                "App/ProcessMonitoring/GET_CURRENT_EXECUTIONS_BY_WORK_ORDER_NO",
                new { WorkOrderNo = workOrderNo });

            var workOrderId = executions.FirstOrDefault()?.WorkOrderID;
            if (workOrderId.HasValue)
            {
                await AddWorkOrderToCurrentStateAsync(workOrderId.Value);
            }
        }

        public async Task AddWorkOrderToCurrentStateAsync(int workOrderId)
        {
            var executions = await _scriptExecutor.ExecuteQueryAsync<ProcessStepExecutionDto>(
                "App/ProcessMonitoring/GET_CURRENT_EXECUTIONS_BY_WORK_ORDER_ID",
                new { WorkOrderId = workOrderId });
            var inputs = await _scriptExecutor.ExecuteQueryAsync<ProcessInputDto>(
                "App/ProcessMonitoring/GET_CURRENT_INPUTS_BY_WORK_ORDER_ID",
                new { WorkOrderId = workOrderId });
            var outputs = await _scriptExecutor.ExecuteQueryAsync<ProcessOutputDto>(
                "App/ProcessMonitoring/GET_CURRENT_OUTPUTS_BY_WORK_ORDER_ID",
                new { WorkOrderId = workOrderId });

            _stateStore.UpsertWorkOrder(executions, inputs, outputs);
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

            await AddWorkOrderToCurrentStateAsync(dto.WorkOrderID);
        }

        public async Task StartExecutionAsync(int executionId)
        {
            await _scriptExecutor.ExecuteNonQueryAsync(
                "App/ProcessMonitoring/START_EXECUTION",
                new { ExecutionId = executionId });

            await RefreshWorkOrderByExecutionAsync(executionId);
        }

        public async Task CompleteExecutionAsync(int executionId)
        {
            await _scriptExecutor.ExecuteNonQueryAsync(
                "App/ProcessMonitoring/COMPLETE_EXECUTION",
                new { ExecutionId = executionId });

            await RefreshWorkOrderByExecutionAsync(executionId);
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

            await RefreshWorkOrderByExecutionAsync(executionId);
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

            await RefreshWorkOrderByInputAsync(inputId);
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

            await RefreshWorkOrderByExecutionAsync(executionId);
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

            await RefreshWorkOrderByOutputAsync(outputId);
        }

        public async Task<CurrentProcessStepStateDto> RecordProductionByEquipmentAsync(string equipmentId, int qty, bool completeExecution = false)
        {
            if (string.IsNullOrWhiteSpace(equipmentId))
            {
                throw new ArgumentException("EquipmentID is required.");
            }

            if (qty <= 0)
            {
                throw new ArgumentException("Qty must be greater than zero.");
            }

            var currentStep = _stateStore.GetCurrentStepByEquipment(equipmentId.Trim());
            if (currentStep == null)
            {
                throw new InvalidOperationException($"Current process step was not found. EquipmentID={equipmentId}");
            }

            if (!string.Equals(currentStep.Status, "RUNNING", StringComparison.OrdinalIgnoreCase))
            {
                throw new InvalidOperationException($"Current process step is not running. EquipmentID={equipmentId}, Status={currentStep.Status}");
            }

            var updatedCount = await _scriptExecutor.ExecuteNonQueryAsync(
                "App/ProcessMonitoring/INCREMENT_OUTPUT_BY_EXECUTION",
                new
                {
                    ExecutionId = currentStep.ProcessStepExecutionID,
                    Qty = qty
                });

            if (updatedCount == 0)
            {
                throw new InvalidOperationException($"Process output was not found. ExecutionId={currentStep.ProcessStepExecutionID}");
            }

            await RefreshWorkOrderByExecutionAsync(currentStep.ProcessStepExecutionID);

            if (completeExecution)
            {
                await CompleteExecutionAsync(currentStep.ProcessStepExecutionID);
            }

            return _stateStore.GetCurrentStepByExecution(currentStep.ProcessStepExecutionID) ?? currentStep;
        }

        public Task<StartToolSignalResponseDto> SendStartToolStartAsync(StartToolSignalRequestDto? dto)
        {
            return SendStartToolSignalAsync("start", dto);
        }

        public Task<StartToolSignalResponseDto> SendStartToolStopAsync(StartToolSignalRequestDto? dto)
        {
            return SendStartToolSignalAsync("stop", dto);
        }

        private async Task<StartToolSignalResponseDto> SendStartToolSignalAsync(string command, StartToolSignalRequestDto? dto)
        {
            var targetId = string.IsNullOrWhiteSpace(dto?.EquipmentId) ? null : dto.EquipmentId.Trim();
            var path = string.IsNullOrEmpty(targetId)
                ? $"/{command}"
                : $"/{command}?id={Uri.EscapeDataString(targetId)}";

            try
            {
                var client = _httpClientFactory.CreateClient();
                client.Timeout = TimeSpan.FromSeconds(3);

                var response = await client.PostAsync(new Uri(new Uri(_startToolBaseUrl), path), null);
                var message = await response.Content.ReadAsStringAsync();

                return new StartToolSignalResponseDto
                {
                    Success = response.IsSuccessStatusCode,
                    Command = command,
                    TargetId = targetId,
                    Message = string.IsNullOrWhiteSpace(message) ? response.ReasonPhrase ?? string.Empty : message
                };
            }
            catch (Exception)
            {
                return new StartToolSignalResponseDto
                {
                    Success = false,
                    Command = command,
                    TargetId = targetId,
                    Message = "StartTool signal server is not reachable."
                };
            }
        }

        private async Task RefreshWorkOrderByExecutionAsync(int executionId)
        {
            var rows = await _scriptExecutor.ExecuteQueryAsync<ProcessMonitoringWorkOrderRefDto>(
                "App/ProcessMonitoring/GET_WORK_ORDER_ID_BY_EXECUTION",
                new { ExecutionId = executionId });
            var workOrderId = rows.FirstOrDefault()?.WorkOrderID;

            if (workOrderId.HasValue)
            {
                await AddWorkOrderToCurrentStateAsync(workOrderId.Value);
            }
        }

        private async Task RefreshWorkOrderByInputAsync(int inputId)
        {
            var rows = await _scriptExecutor.ExecuteQueryAsync<ProcessMonitoringWorkOrderRefDto>(
                "App/ProcessMonitoring/GET_WORK_ORDER_ID_BY_INPUT",
                new { InputId = inputId });
            var workOrderId = rows.FirstOrDefault()?.WorkOrderID;

            if (workOrderId.HasValue)
            {
                await AddWorkOrderToCurrentStateAsync(workOrderId.Value);
            }
        }

        private async Task RefreshWorkOrderByOutputAsync(int outputId)
        {
            var rows = await _scriptExecutor.ExecuteQueryAsync<ProcessMonitoringWorkOrderRefDto>(
                "App/ProcessMonitoring/GET_WORK_ORDER_ID_BY_OUTPUT",
                new { OutputId = outputId });
            var workOrderId = rows.FirstOrDefault()?.WorkOrderID;

            if (workOrderId.HasValue)
            {
                await AddWorkOrderToCurrentStateAsync(workOrderId.Value);
            }
        }

    }
}
