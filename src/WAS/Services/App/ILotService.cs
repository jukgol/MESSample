using Shared.Models.App;

namespace WAS.Services.App
{
    public interface ILotService
    {
        Task<IEnumerable<LotDto>> GetLotsAsync();
        Task CreateLotAsync(LotCreateDto dto);
        Task UpdateLotAsync(int id, LotUpdateDto dto);
        Task DeleteLotAsync(int id);
        Task GenerateDummyLotsAsync(int count);
    }
}
