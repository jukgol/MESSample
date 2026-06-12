using Shared.Models.App;

namespace WAS.Services.App
{
    public class HistoryService : IHistoryService
    {
        private readonly IScriptExecutor _scriptExecutor;

        public HistoryService(IScriptExecutor scriptExecutor)
        {
            _scriptExecutor = scriptExecutor;
        }

        public async Task<IEnumerable<WorkOrderHistoryDto>> GetWorkOrderHistoryAsync()
        {
            return await _scriptExecutor.ExecuteQueryAsync<WorkOrderHistoryDto>("App/History/GET_WORK_ORDER_HISTORY");
        }

        public async Task<IEnumerable<LotRelationHistoryDto>> GetLotRelationsAsync()
        {
            return await _scriptExecutor.ExecuteQueryAsync<LotRelationHistoryDto>("App/History/GET_LOT_RELATIONS");
        }

        public async Task<IEnumerable<LotTraceHistoryDto>> GetLotTraceAsync(int lotId)
        {
            return await _scriptExecutor.ExecuteQueryAsync<LotTraceHistoryDto>(
                "App/History/GET_LOT_TRACE",
                new { LotId = lotId });
        }

        public async Task<IEnumerable<LotStockHistoryDto>> GetLotStockHistoryAsync()
        {
            return await _scriptExecutor.ExecuteQueryAsync<LotStockHistoryDto>(
                "App/History/GET_LOT_STOCK_HISTORY");
        }
    }
}
