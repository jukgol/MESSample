using Shared.Models.App;
using WAS.Data;

namespace WAS.Services.App
{
    public partial class LotService : ILotService
    {
        private readonly IScriptExecutor _scriptExecutor;
        private readonly IItemService _itemService;
        private readonly DbProvider _db;

        public LotService(IScriptExecutor scriptExecutor, IItemService itemService, DbProvider db)
        {
            _scriptExecutor = scriptExecutor;
            _itemService = itemService;
            _db = db;
        }

        public async Task<IEnumerable<LotDto>> GetLotsAsync()
        {
            return await _scriptExecutor.ExecuteQueryAsync<LotDto>("App/Lot/GET_LOT_LIST");
        }
    }
}
