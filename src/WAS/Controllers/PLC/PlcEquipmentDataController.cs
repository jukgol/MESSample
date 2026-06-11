using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shared.Models.PLC;
using System;
using System.Text.Json;

namespace WAS.Controllers.PLC
{
    [ApiController]
    [Route("api/plc/equipment-data")]
    [AllowAnonymous]
    public class PlcEquipmentDataController : ControllerBase
    {
        private readonly ILogger<PlcEquipmentDataController> _logger;

        public PlcEquipmentDataController(ILogger<PlcEquipmentDataController> logger)
        {
            _logger = logger;
        }

        [HttpPost]
        [ProducesResponseType(typeof(PlcEquipmentDataReceiveResponseDto), 200)]
        [ProducesResponseType(400)]
        public ActionResult<PlcEquipmentDataReceiveResponseDto> ReceiveEquipmentData([FromBody] JsonElement payload)
        {
            if (payload.ValueKind == JsonValueKind.Undefined || payload.ValueKind == JsonValueKind.Null)
            {
                return BadRequest(new { Message = "PLC payload is required." });
            }

            _logger.LogInformation("PLC equipment data received: {Payload}", payload.GetRawText());

            return Ok(new PlcEquipmentDataReceiveResponseDto
            {
                Success = true,
                ReceivedAt = DateTime.UtcNow,
                Message = "PLC equipment data received."
            });
        }

        [HttpPost("state")]
        [ProducesResponseType(typeof(PlcEquipmentStateResponseDto), 200)]
        [ProducesResponseType(400)]
        public ActionResult<PlcEquipmentStateResponseDto> ReceiveEquipmentState([FromBody] PlcEquipmentStateRequestDto dto)
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

            var equipmentId = dto.EquipmentID.Trim();
            _logger.LogInformation(
                "PLC equipment state received. EquipmentID: {EquipmentID}, State: {State}, OccurredAt: {OccurredAt}",
                equipmentId,
                state,
                dto.OccurredAt);

            return Ok(new PlcEquipmentStateResponseDto
            {
                Success = true,
                EquipmentID = equipmentId,
                State = state,
                ReceivedAt = DateTime.UtcNow,
                Message = "PLC equipment state received."
            });
        }
    }
}
