using Shared.Models.App;

namespace WAS.Services.App
{
    public class ProcessInputService : IProcessInputService
    {
        private readonly IScriptExecutor _scriptExecutor;

        public ProcessInputService(IScriptExecutor scriptExecutor)
        {
            _scriptExecutor = scriptExecutor;
        }

        public async Task CreateInputAsync(int executionId, ProcessInputCreateDto dto)
        {
            if (executionId <= 0) throw new ArgumentException("ExecutionId must be greater than zero.");
            if (dto.LotID <= 0) throw new ArgumentException("LotID must be greater than zero.");
            if (dto.ItemID <= 0) throw new ArgumentException("ItemID must be greater than zero.");
            if (dto.InputQty <= 0) throw new ArgumentException("InputQty must be greater than zero.");
            if (dto.UsedQty < 0) throw new ArgumentException("UsedQty cannot be negative.");

            var remainQty = dto.RemainQty ?? dto.InputQty - dto.UsedQty;
            if (remainQty < 0) throw new ArgumentException("RemainQty cannot be negative.");

            await _scriptExecutor.ExecuteNonQueryAsync(
                "App/ProcessMonitoring/CREATE_INPUT",
                new
                {
                    ExecutionId = executionId,
                    LotId = dto.LotID,
                    ItemId = dto.ItemID,
                    InputQty = dto.InputQty,
                    UsedQty = dto.UsedQty,
                    RemainQty = remainQty
                });
        }

        public async Task<int> UpdateInputQuantityAsync(int inputId, ProcessInputQuantityUpdateDto dto)
        {
            if (inputId <= 0) throw new ArgumentException("InputId must be greater than zero.");
            if (dto.UsedQty < 0) throw new ArgumentException("UsedQty cannot be negative.");
            if (dto.RemainQty < 0) throw new ArgumentException("RemainQty cannot be negative.");

            return await _scriptExecutor.ExecuteNonQueryAsync(
                "App/ProcessMonitoring/UPDATE_INPUT_QUANTITY",
                new
                {
                    InputId = inputId,
                    UsedQty = dto.UsedQty,
                    RemainQty = dto.RemainQty
                });
        }
    }
}
