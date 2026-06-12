using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shared.Models.PLC;
using System.Text.Json;
using WAS.Services.PLC;

namespace WAS.Controllers.PLC
{
    [ApiController]
    [Route("api/plc/equipment-data")]
    [AllowAnonymous]
    public class PlcEquipmentDataController : ControllerBase
    {
        private readonly IPlcEquipmentDataService _plcEquipmentDataService;

        public PlcEquipmentDataController(IPlcEquipmentDataService plcEquipmentDataService)
        {
            _plcEquipmentDataService = plcEquipmentDataService;
        }

        [HttpPost]
        [ProducesResponseType(typeof(PlcEquipmentDataReceiveResponseDto), 200)]
        [ProducesResponseType(400)]
        public async Task<ActionResult<PlcEquipmentDataReceiveResponseDto>> ReceiveEquipmentData([FromBody] JsonElement payload)
        {
            if (payload.ValueKind == JsonValueKind.Undefined || payload.ValueKind == JsonValueKind.Null)
            {
                return BadRequest(new { Message = "PLC payload is required." });
            }

            var result = await _plcEquipmentDataService.HandleEquipmentDataAsync(payload);
            return Ok(result);
        }

        [HttpPost("state")]
        [ProducesResponseType(typeof(PlcEquipmentStateResponseDto), 200)]
        [ProducesResponseType(400)]
        public async Task<ActionResult<PlcEquipmentStateResponseDto>> ReceiveEquipmentState([FromBody] PlcEquipmentStateRequestDto dto)
        {
            if (dto == null)
            {
                return BadRequest(new { Message = "PLC equipment state payload is required." });
            }

            if (string.IsNullOrWhiteSpace(dto.EquipmentID))
            {
                return BadRequest(new { Message = "equipmentID is required." });
            }

            var state = string.IsNullOrWhiteSpace(dto.State)
                ? string.Empty
                : dto.State.Trim().ToUpperInvariant();

            if (state != "STARTED" && state != "STOPPED")
            {
                return BadRequest(new { Message = "state must be STARTED or STOPPED." });
            }

            var result = await _plcEquipmentDataService.HandleEquipmentStateAsync(dto);
            return Ok(result);
        }

        [HttpPost("production")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(500)]
        public async Task<ActionResult> ReceiveProductionEvent([FromBody] PlcEquipmentProductionRequestDto dto)
        {
            if (dto == null)
            {
                return BadRequest(new { Message = "PLC production payload is required." });
            }

            if (string.IsNullOrWhiteSpace(dto.EquipmentID))
            {
                return BadRequest(new { Message = "equipmentID is required." });
            }

            var productionEvent = string.IsNullOrWhiteSpace(dto.Event)
                ? "PRODUCED"
                : dto.Event.Trim().ToUpperInvariant();

            if (productionEvent != "PRODUCED" && productionEvent != "COMPLETED")
            {
                return BadRequest(new { Message = "event must be PRODUCED or COMPLETED." });
            }

            if (dto.Qty.HasValue && dto.Qty.Value <= 0)
            {
                return BadRequest(new { Message = "qty must be greater than zero." });
            }

            dto.Event = productionEvent;
            dto.Qty ??= 1;

            try
            {
                await _plcEquipmentDataService.HandleProductionEventAsync(dto);
                return Ok();
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { Message = ex.Message });
            }
        }
    }
}
