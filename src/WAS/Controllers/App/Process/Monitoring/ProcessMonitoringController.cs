using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WAS.Services.App;

namespace WAS.Controllers.App
{
    [ApiController]
    [Route("api/process-monitoring")]
    [Authorize]
    public partial class ProcessMonitoringController : ControllerBase
    {
        private readonly IProcessMonitoringService _processMonitoringService;

        public ProcessMonitoringController(IProcessMonitoringService processMonitoringService)
        {
            _processMonitoringService = processMonitoringService;
        }
    }
}
