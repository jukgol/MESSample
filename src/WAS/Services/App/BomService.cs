using Shared.Models.App;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace WAS.Services.App
{
    public class BomService : IBomService
    {
        private readonly IScriptExecutor _scriptExecutor;

        public BomService(IScriptExecutor scriptExecutor)
        {
            _scriptExecutor = scriptExecutor;
        }

        public async Task<IEnumerable<BomDto>> GetBomsByParentAsync(int parentId)
        {
            return await _scriptExecutor.ExecuteQueryAsync<BomDto>("App/Bom/GET_BOM_BY_PARENT", new { ParentItemId = parentId });
        }

        public async Task CreateBomAsync(BomCreateDto dto)
        {
            await _scriptExecutor.ExecuteNonQueryAsync("App/Bom/CREATE_BOM", new
            {
                ParentItemId = dto.ParentItemID,
                ChildItemId = dto.ChildItemID,
                BomQty = dto.BomQty
            });
        }

        public async Task UpdateBomAsync(int id, BomUpdateDto dto)
        {
            await _scriptExecutor.ExecuteNonQueryAsync("App/Bom/UPDATE_BOM", new
            {
                BomId = id,
                BomQty = dto.BomQty
            });
        }

        public async Task DeleteBomAsync(int id)
        {
            await _scriptExecutor.ExecuteNonQueryAsync("App/Bom/DELETE_BOM", new
            {
                BomId = id
            });
        }
    }
}
