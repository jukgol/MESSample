using Shared.Models.App;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace WAS.Services.App
{
    public interface IWorkOrderService
    {
        Task<IEnumerable<ProcessMasterDto>> GetMastersAsync();
        Task<WorkOrderPreviewDto> GetPreviewAsync(WorkOrderPreviewRequestDto request);
        Task<WorkOrderCreateResultDto> CreateAsync(WorkOrderCreateRequestDto request);
    }
}
