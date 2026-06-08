using Shared.Models.App;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace WAS.Services.App
{
    public interface IProcessMasterService
    {
        Task<IEnumerable<ProcessMasterDto>> GetProcessMastersAsync();
        Task<ProcessMasterDto?> GetProcessMasterByIdAsync(int id);
        Task<ProcessMasterDto?> GetProcessMasterByCodeAsync(string code);
        Task CreateProcessMasterAsync(ProcessMasterCreateDto dto);
        Task UpdateProcessMasterAsync(int id, ProcessMasterUpdateDto dto);
        Task DeleteProcessMasterAsync(int id);
    }
}
