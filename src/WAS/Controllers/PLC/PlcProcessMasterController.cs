using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shared.Models.PLC;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using WAS.Services.PLC;

namespace WAS.Controllers.PLC
{
    [ApiController]
    [Route("api/plc/process-master")]
    [AllowAnonymous]
    public class PlcProcessMasterController : ControllerBase
    {
        private readonly IPlcProcessMasterService _plcProcessMasterService;
        private readonly ILogger<PlcProcessMasterController> _logger;

        public PlcProcessMasterController(
            IPlcProcessMasterService plcProcessMasterService,
            ILogger<PlcProcessMasterController> logger)
        {
            _plcProcessMasterService = plcProcessMasterService;
            _logger = logger;
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<PlcProcessMasterDto>), 200)]
        [ProducesResponseType(500)]
        public async Task<ActionResult<IEnumerable<PlcProcessMasterDto>>> GetProcessMasters()
        {
            try
            {
                var processes = await _plcProcessMasterService.GetProcessMastersAsync();
                return Ok(processes);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get PLC process master list.");
                return StatusCode(500, new { Message = "Failed to get process master list." });
            }
        }
    }
}
