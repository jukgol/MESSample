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

        [HttpPost("starttool/input-all")]
        [HasPermission(Permissions.ProcessExecute)]
        [ProducesResponseType(typeof(StartToolSignalResponseDto), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<ActionResult<StartToolSignalResponseDto>> InjectAllDummyInputs([FromQuery] string workOrderNo)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(workOrderNo))
                {
                    return BadRequest(new StartToolSignalResponseDto { Success = false, Message = "workOrderNo is required." });
                }

                var insertedCount = await _processMonitoringService.InjectAllInputsAsync(workOrderNo);
                if (insertedCount == 0)
                {
                    var diagnostics = await _processMonitoringService.GetInputInjectionDiagnosticsAsync(workOrderNo);
                    return Ok(new StartToolSignalResponseDto { Success = false, Message = BuildNoInputInsertedMessage(diagnostics), Command = "input-all" });
                }

                return Ok(new StartToolSignalResponseDto { Success = true, Message = $"Successfully injected {insertedCount} dummy inputs.", Command = "input-all" });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new StartToolSignalResponseDto { Success = false, Message = $"Failed to inject inputs: {ex.Message}", Command = "input-all" });
            }
        }

        private static string BuildNoInputInsertedMessage(ProcessInputInjectionDiagnosticsDto diagnostics)
        {
            if (diagnostics.ExecutionCount == 0)
            {
                return "No inputs were inserted because this work order has no process step executions.";
            }

            if (diagnostics.BomMappingCount == 0)
            {
                return "No inputs were inserted because the work order steps have no BOM mappings.";
            }

            if (diagnostics.AvailableLotMappingCount == 0)
            {
                return "No inputs were inserted because BOM child items have no available LOT stock.";
            }

            if (diagnostics.InsertCandidateCount == 0 && diagnostics.ExistingInputCount > 0)
            {
                return "No inputs were inserted because matching PROCESS_INPUT rows already exist.";
            }

            return $"No inputs were inserted. Diagnostics: executions={diagnostics.ExecutionCount}, bomMappings={diagnostics.BomMappingCount}, availableLotMappings={diagnostics.AvailableLotMappingCount}, existingInputs={diagnostics.ExistingInputCount}.";
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
