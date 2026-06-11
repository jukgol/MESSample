using Shared.Models.App;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace WAS.Services.App
{
    public interface IMrpService
    {
        Task<IEnumerable<ProcessMasterDto>> GetMastersAsync();
        Task<MrpSimulationResultDto> SimulateAsync(MrpSimulationRequestDto request);
    }
}
