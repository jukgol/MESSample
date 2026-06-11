using System.Threading.Tasks;
using Shared.Models.App;

namespace WAS.Services.App
{
    public interface IItemTypeService
    {
        Task<IEnumerable<ItemTypeDto>> GetItemTypesAsync();
        Task CreateItemTypeAsync(ItemTypeCreateDto dto);
        Task UpdateItemTypeAsync(int id, ItemTypeUpdateDto dto);
        Task DeleteItemTypeAsync(int id);
        Task LoadScenarioItemTypesAsync();
    }
}
