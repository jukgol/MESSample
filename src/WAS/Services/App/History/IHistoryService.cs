using Shared.Models.App;

namespace WAS.Services.App
{
    public interface IHistoryService
    {
        Task<IEnumerable<WorkOrderHistoryDto>> GetWorkOrderHistoryAsync();
        Task<IEnumerable<LotRelationHistoryDto>> GetLotRelationsAsync();
        Task<IEnumerable<LotTraceHistoryDto>> GetLotTraceAsync(int lotId);
    }
}
