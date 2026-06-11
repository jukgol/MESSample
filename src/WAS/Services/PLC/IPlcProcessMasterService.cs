using Shared.Models.PLC;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace WAS.Services.PLC
{
    public interface IPlcProcessMasterService
    {
        Task<IEnumerable<PlcProcessMasterDto>> GetProcessMastersAsync();
    }
}
