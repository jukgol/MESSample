using Shared.Models.App;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace WAS.Services.App
{
    public interface IBomService
    {
        Task<IEnumerable<BomDto>> GetBomsByParentAsync(int parentId);
        Task<IEnumerable<BomDto>> GetBomsByStepAsync(int stepId);
        Task<IEnumerable<BomDto>> GetAllBomsAsync();
        Task CreateBomAsync(BomCreateDto dto);
        Task UpdateBomAsync(int id, BomUpdateDto dto);
        Task UpdateBomProcessStepAsync(int bomId, int? processStepId);
        Task DeleteBomAsync(int id);
        Task LoadScenarioBomsAsync();
    }
}
