using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shared.Models.App;
using WAS.Attributes;
using WAS.Common.Constants;
using WAS.Services.App;

namespace WAS.Controllers.App
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class HistoryController : ControllerBase
    {
        private readonly IHistoryService _historyService;

        public HistoryController(IHistoryService historyService)
        {
            _historyService = historyService;
        }

        [HttpGet("work-orders")]
        [HasPermission(Permissions.ProcessView)]
        [ProducesResponseType(typeof(IEnumerable<WorkOrderHistoryDto>), 200)]
        [ProducesResponseType(401)]
        public async Task<ActionResult<IEnumerable<WorkOrderHistoryDto>>> GetWorkOrderHistory()
        {
            try
            {
                var rows = await _historyService.GetWorkOrderHistoryAsync();
                return Ok(rows);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"Work order history query failed: {ex.Message}" });
            }
        }

        [HttpGet("lot-relations")]
        [HasPermission(Permissions.ProcessView)]
        [ProducesResponseType(typeof(IEnumerable<LotRelationHistoryDto>), 200)]
        [ProducesResponseType(401)]
        public async Task<ActionResult<IEnumerable<LotRelationHistoryDto>>> GetLotRelations()
        {
            try
            {
                var rows = await _historyService.GetLotRelationsAsync();
                return Ok(rows);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"Lot relation history query failed: {ex.Message}" });
            }
        }

        [HttpGet("lots/{lotId}/trace")]
        [HasPermission(Permissions.ProcessView)]
        [ProducesResponseType(typeof(IEnumerable<LotTraceHistoryDto>), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        public async Task<ActionResult<IEnumerable<LotTraceHistoryDto>>> GetLotTrace(int lotId)
        {
            try
            {
                if (lotId <= 0)
                {
                    return BadRequest(new { Message = "LotID must be greater than zero." });
                }

                var rows = await _historyService.GetLotTraceAsync(lotId);
                return Ok(rows);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"Lot trace history query failed: {ex.Message}" });
            }
        }
    }
}
