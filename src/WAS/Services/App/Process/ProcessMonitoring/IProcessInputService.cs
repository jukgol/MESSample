using Shared.Models.App;

namespace WAS.Services.App
{
    public interface IProcessInputService
    {
        Task CreateInputAsync(int executionId, ProcessInputCreateDto dto);
        Task<int> UpdateInputQuantityAsync(int inputId, ProcessInputQuantityUpdateDto dto);
    }
}
