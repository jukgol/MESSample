using Shared.Models.App;

namespace WAS.Services.App
{
    public class ProcessOutputService : IProcessOutputService
    {
        private readonly IScriptExecutor _scriptExecutor;
        private readonly ILotService _lotService;

        public ProcessOutputService(IScriptExecutor scriptExecutor, ILotService lotService)
        {
            _scriptExecutor = scriptExecutor;
            _lotService = lotService;
        }

        public async Task EnsureInitialOutputAsync(int executionId)
        {
            if (executionId <= 0)
            {
                throw new ArgumentException("ExecutionId must be greater than zero.");
            }

            var outputCountRows = await _scriptExecutor.ExecuteQueryAsync<ProcessOutputCountDto>(
                "App/ProcessMonitoring/GET_OUTPUT_COUNT_BY_EXECUTION",
                new { ExecutionId = executionId });
            var outputCount = outputCountRows.FirstOrDefault()?.OutputCount ?? 0;

            if (outputCount > 0)
            {
                await CreateMissingOutputLotTracesAsync(executionId);
                return;
            }

            var contextRows = await _scriptExecutor.ExecuteQueryAsync<ProcessOutputInitialContextDto>(
                "App/ProcessMonitoring/GET_INITIAL_OUTPUT_CONTEXT",
                new { ExecutionId = executionId });
            var context = contextRows.FirstOrDefault();

            if (context == null)
            {
                throw new InvalidOperationException($"Output context was not found. ExecutionId={executionId}");
            }

            var lotId = await _lotService.CreateProductionLotAsync(
                new LotCreateDto
                {
                    ItemID = context.OutputItemID,
                    LotNo = $"{context.WorkOrderNo}-OUT-{executionId}",
                    Qty = 0,
                    Status = "IN_PROGRESS"
                },
                executionId,
                "PROCESS_STEP_EXECUTION",
                executionId);

            await CreateOutputAsync(
                executionId,
                new ProcessOutputCreateDto
                {
                    LotID = lotId,
                    ItemID = context.OutputItemID,
                    TargetQty = context.OrderQty,
                    OutputQty = 0,
                    OutputType = "GOOD"
                });
        }

        public async Task CreateOutputAsync(int executionId, ProcessOutputCreateDto dto)
        {
            if (executionId <= 0) throw new ArgumentException("ExecutionId must be greater than zero.");
            if (dto.LotID <= 0) throw new ArgumentException("LotID must be greater than zero.");
            if (dto.ItemID <= 0) throw new ArgumentException("ItemID must be greater than zero.");
            if (dto.TargetQty < 0) throw new ArgumentException("TargetQty cannot be negative.");
            if (dto.OutputQty < 0) throw new ArgumentException("OutputQty cannot be negative.");

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

            await CreateMissingOutputLotTracesAsync(executionId);
        }

        public async Task<int> UpdateOutputQuantityAsync(int outputId, int outputQty)
        {
            if (outputId <= 0) throw new ArgumentException("OutputId must be greater than zero.");
            if (outputQty < 0) throw new ArgumentException("OutputQty cannot be negative.");

            return await _scriptExecutor.ExecuteNonQueryAsync(
                "App/ProcessMonitoring/UPDATE_OUTPUT_QUANTITY",
                new
                {
                    OutputId = outputId,
                    OutputQty = outputQty
                });
        }

        public async Task<int> IncrementGoodOutputByExecutionAsync(int executionId, int qty)
        {
            if (executionId <= 0) throw new ArgumentException("ExecutionId must be greater than zero.");
            if (qty <= 0) throw new ArgumentException("Qty must be greater than zero.");

            return await _scriptExecutor.ExecuteNonQueryAsync(
                "App/ProcessMonitoring/INCREMENT_OUTPUT_BY_EXECUTION",
                new
                {
                    ExecutionId = executionId,
                    Qty = qty
                });
        }

        public async Task CreateMissingOutputLotTracesAsync(int executionId)
        {
            var outputs = await _scriptExecutor.ExecuteQueryAsync<ProcessMonitoringOutputTraceDto>(
                "App/ProcessMonitoring/GET_OUTPUTS_WITHOUT_TRACE_BY_EXECUTION",
                new { ExecutionId = executionId });

            foreach (var output in outputs)
            {
                await _lotService.CreateLotTraceAsync(new LotTraceCreateDto
                {
                    ChildLotID = output.LotID,
                    TraceType = "PROCESS_OUTPUT",
                    InputQty = null,
                    OutputQty = output.OutputQty,
                    ProcessStepExecutionID = executionId,
                    RefType = "PROCESS_STEP_EXECUTION",
                    RefID = executionId
                });
            }
        }
    }
}
