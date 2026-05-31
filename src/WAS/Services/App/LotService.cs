using Shared.Models.App;

namespace WAS.Services.App
{
    public class LotService : ILotService
    {
        private readonly IScriptExecutor _scriptExecutor;

        public LotService(IScriptExecutor scriptExecutor)
        {
            _scriptExecutor = scriptExecutor;
        }

        public async Task<IEnumerable<LotDto>> GetLotsAsync()
        {
            return await _scriptExecutor.ExecuteQueryAsync<LotDto>("App/GET_LOT_LIST");
        }

        public async Task CreateLotAsync(LotCreateDto dto)
        {
            await _scriptExecutor.ExecuteNonQueryAsync("App/CREATE_LOT", new
            {
                ItemId = dto.ItemID,
                LotNo = dto.LotNo,
                Qty = dto.Qty,
                Status = dto.Status
            });
        }

        public async Task UpdateLotAsync(int id, LotUpdateDto dto)
        {
            await _scriptExecutor.ExecuteNonQueryAsync("App/UPDATE_LOT", new
            {
                LotId = id,
                Qty = dto.Qty,
                Status = dto.Status
            });
        }

        public async Task DeleteLotAsync(int id)
        {
            await _scriptExecutor.ExecuteNonQueryAsync("App/DELETE_LOT", new
            {
                LotId = id
            });
        }
    }
}
