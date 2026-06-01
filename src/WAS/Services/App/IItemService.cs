using Shared.Models.App;

namespace WAS.Services.App
{
    public interface IItemService
    {
        Task<IEnumerable<ItemDto>> GetItemsAsync();
        Task CreateItemAsync(ItemCreateDto dto);
        Task UpdateItemAsync(int id, ItemUpdateDto dto);
        Task DeleteItemAsync(int id);
        Task GenerateDummyItemsAsync(int count);
    }
}
