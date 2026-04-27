using WAS.Models.App;

namespace WAS.Services.App
{
    public interface IItemService
    {
        Task<IEnumerable<ItemDto>> GetItemsAsync();
    }
}
