using Microsoft.AspNetCore.Mvc;
using Shared.Models.App;
using System.Threading.Tasks;
using WAS.Attributes;
using WAS.Common.Constants;

namespace WAS.Controllers.App
{
    public partial class ProcessMonitoringController
    {
        [HttpPost("starttool/start")]
        [HasPermission(Permissions.ProcessExecute)]
        [ProducesResponseType(typeof(StartToolSignalResponseDto), 200)]
        [ProducesResponseType(typeof(StartToolSignalResponseDto), 502)]
        [ProducesResponseType(401)]
        public async Task<ActionResult<StartToolSignalResponseDto>> StartStartTool([FromBody] StartToolSignalRequestDto? dto)
        {
            var result = await _processMonitoringService.SendStartToolStartAsync(dto);
            return result.Success ? Ok(result) : StatusCode(502, result);
        }

        [HttpPost("starttool/stop")]
        [HasPermission(Permissions.ProcessExecute)]
        [ProducesResponseType(typeof(StartToolSignalResponseDto), 200)]
        [ProducesResponseType(typeof(StartToolSignalResponseDto), 502)]
        [ProducesResponseType(401)]
        public async Task<ActionResult<StartToolSignalResponseDto>> StopStartTool([FromBody] StartToolSignalRequestDto? dto)
        {
            var result = await _processMonitoringService.SendStartToolStopAsync(dto);
            return result.Success ? Ok(result) : StatusCode(502, result);
        }
    }
}
