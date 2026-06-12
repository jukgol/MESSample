using Shared.Models.App;

namespace WAS.Services.App
{
    public interface ILotService
    {
        Task<IEnumerable<LotDto>> GetLotsAsync();
        Task CreateLotAsync(LotCreateDto dto);
        Task<int> CreateLotWithInitialDataAsync(LotCreateDto dto, string traceType = "EXTERNAL_RECEIVE", string? refType = null, int? refId = null);
        Task<int> CreateProductionLotAsync(LotCreateDto dto, int? processStepExecutionId = null, string? refType = null, int? refId = null);
        Task IncreaseLotStockAsync(int lotId, int qty, string reason, string? refType = null, int? refId = null);
        Task DecreaseLotStockAsync(int lotId, int qty, string reason, string? refType = null, int? refId = null);
        Task ConsumeLotStockAsync(int lotId, int qty, string reason, string? refType = null, int? refId = null);
        Task AdjustLotStockAsync(int lotId, int targetQty, string reason, string? refType = null, int? refId = null);
        Task CreateLotTraceAsync(LotTraceCreateDto dto);
        Task UpdateLotAsync(int id, LotUpdateDto dto);
        Task DeleteLotAsync(int id);
        Task GenerateDummyLotsAsync(int count);
    }
}
