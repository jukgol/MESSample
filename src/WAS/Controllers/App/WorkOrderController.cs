using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shared.Models.App;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using WAS.Attributes;
using WAS.Common.Constants;
using WAS.Services.App;

namespace WAS.Controllers.App
{
    [ApiController]
    [Route("api/work-order")]
    [Authorize]
    public class WorkOrderController : ControllerBase
    {
        private readonly IWorkOrderService _workOrderService;

        public WorkOrderController(IWorkOrderService workOrderService)
        {
            _workOrderService = workOrderService;
        }

        [HttpGet("masters")]
        [HasPermission(Permissions.ProcessView)]
        [ProducesResponseType(typeof(IEnumerable<ProcessMasterDto>), 200)]
        [ProducesResponseType(401)]
        public async Task<ActionResult<IEnumerable<ProcessMasterDto>>> GetMasters()
        {
            try
            {
                var masters = await _workOrderService.GetMastersAsync();
                return Ok(masters);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"Work order master list query failed: {ex.Message}" });
            }
        }

        [HttpGet("history")]
        [HasPermission(Permissions.ProcessView)]
        [ProducesResponseType(typeof(IEnumerable<WorkOrderHistoryDto>), 200)]
        [ProducesResponseType(401)]
        public async Task<ActionResult<IEnumerable<WorkOrderHistoryDto>>> GetHistory()
        {
            try
            {
                var history = await _workOrderService.GetHistoryAsync();
                return Ok(history);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"Work order history query failed: {ex.Message}" });
            }
        }

        [HttpPost("preview")]
        [HasPermission(Permissions.ProcessView)]
        [ProducesResponseType(typeof(WorkOrderPreviewDto), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        public async Task<ActionResult<WorkOrderPreviewDto>> Preview([FromBody] WorkOrderPreviewRequestDto request)
        {
            try
            {
                var validation = ValidatePreviewRequest(request);
                if (validation != null)
                {
                    return validation;
                }

                var preview = await _workOrderService.GetPreviewAsync(request);
                return Ok(preview);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"Work order preview failed: {ex.Message}" });
            }
        }

        [HttpPost("approve")]
        [HasPermission(Permissions.ProcessExecute)]
        [ProducesResponseType(typeof(WorkOrderCreateResultDto), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        public async Task<ActionResult<WorkOrderCreateResultDto>> Approve([FromBody] WorkOrderCreateRequestDto request)
        {
            try
            {
                var validation = ValidateCreateRequest(request);
                if (validation != null)
                {
                    return validation;
                }

                var result = await _workOrderService.CreateAsync(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"Work order approval failed: {ex.Message}" });
            }
        }

        private ActionResult? ValidatePreviewRequest(WorkOrderPreviewRequestDto? request)
        {
            if (request == null)
            {
                return BadRequest(new { Message = "Request body is required." });
            }

            if (request.ProcessMasterID <= 0)
            {
                return BadRequest(new { Message = "ProcessMasterID must be greater than zero." });
            }

            if (request.OrderQty <= 0)
            {
                return BadRequest(new { Message = "OrderQty must be greater than zero." });
            }

            return null;
        }

        private ActionResult? ValidateCreateRequest(WorkOrderCreateRequestDto? request)
        {
            if (request == null)
            {
                return BadRequest(new { Message = "Request body is required." });
            }

            if (request.ProcessMasterID <= 0)
            {
                return BadRequest(new { Message = "ProcessMasterID must be greater than zero." });
            }

            if (request.OrderQty <= 0)
            {
                return BadRequest(new { Message = "OrderQty must be greater than zero." });
            }

            if (string.IsNullOrWhiteSpace(request.WorkerName))
            {
                return BadRequest(new { Message = "WorkerName is required." });
            }

            return null;
        }
    }
}
