using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Shared.Models.App;
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

        [HttpPost("starttool/launch")]
        [HasPermission(Permissions.ProcessExecute)]
        [ProducesResponseType(typeof(StartToolSignalResponseDto), 200)]
        [ProducesResponseType(500)]
        public ActionResult<StartToolSignalResponseDto> LaunchStartTool()
        {
            try
            {
                var projectRoot = System.IO.Path.GetFullPath(System.IO.Path.Combine(System.IO.Directory.GetCurrentDirectory(), "..", "TestTool"));
                
                var startInfo = new System.Diagnostics.ProcessStartInfo
                {
                    FileName = "cmd.exe",
                    Arguments = "/c poetry run python app.py",
                    WorkingDirectory = projectRoot,
                    UseShellExecute = true,
                    CreateNoWindow = false
                };
                
                System.Diagnostics.Process.Start(startInfo);
                return Ok(new StartToolSignalResponseDto { Success = true, Message = "TestTool launched successfully.", Command = "launch" });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new StartToolSignalResponseDto { Success = false, Message = $"Failed to launch TestTool: {ex.Message}", Command = "launch" });
            }
        }
    }
}
