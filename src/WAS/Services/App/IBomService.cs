using Shared.Models.App;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace WAS.Services.App
{
    public interface IBomService
    {
        Task<IEnumerable<BomDto>> GetBomsByParentAsync(int parentId);
        Task CreateBomAsync(BomCreateDto dto);
        Task UpdateBomAsync(int id, BomUpdateDto dto);
        Task DeleteBomAsync(int id);
        Task LoadScenarioBomsAsync();
    }
}
