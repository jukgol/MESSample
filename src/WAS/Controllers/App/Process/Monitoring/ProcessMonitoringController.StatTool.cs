using Microsoft.AspNetCore.Mvc;
using Shared.Models.App;
using System.Threading.Tasks;
using WAS.Attributes;
using WAS.Common.Constants;

namespace WAS.Controllers.App
{
    public partial class ProcessMonitoringController
    {
        [HttpPost("stattool/start")]
        [HasPermission(Permissions.ProcessExecute)]
        [ProducesResponseType(typeof(StatToolSignalResponseDto), 200)]
        [ProducesResponseType(typeof(StatToolSignalResponseDto), 502)]
        [ProducesResponseType(401)]
        public async Task<ActionResult<StatToolSignalResponseDto>> StartStatTool([FromBody] StatToolSignalRequestDto? dto)
        {
            var result = await _processMonitoringService.SendStatToolStartAsync(dto);
            return result.Success ? Ok(result) : StatusCode(502, result);
        }

        [HttpPost("stattool/stop")]
        [HasPermission(Permissions.ProcessExecute)]
        [ProducesResponseType(typeof(StatToolSignalResponseDto), 200)]
        [ProducesResponseType(typeof(StatToolSignalResponseDto), 502)]
        [ProducesResponseType(401)]
        public async Task<ActionResult<StatToolSignalResponseDto>> StopStatTool([FromBody] StatToolSignalRequestDto? dto)
        {
            var result = await _processMonitoringService.SendStatToolStopAsync(dto);
            return result.Success ? Ok(result) : StatusCode(502, result);
        }
    }
}
