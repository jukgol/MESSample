using Shared.Models.App;

namespace WAS.Services.App
{
    public interface IProcessStepService
    {
        Task<IEnumerable<ProcessStepDto>> GetProcessStepsAsync();
        Task<ProcessStepDto?> GetProcessStepByIdAsync(int id);
        Task CreateProcessStepAsync(ProcessStepCreateDto dto);
        Task UpdateProcessStepAsync(int id, ProcessStepUpdateDto dto);
        Task DeleteProcessStepAsync(int id);
    }
}
