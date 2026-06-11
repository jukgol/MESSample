using Microsoft.AspNetCore.SignalR;
using Shared.Models.PLC;
using System;
using System.Text.Json;
using System.Threading.Tasks;
using WAS.Hubs;

namespace WAS.Services.PLC
{
    public class PlcEquipmentDataService : IPlcEquipmentDataService
    {
        private readonly IHubContext<ProcessMonitoringHub> _hubContext;
        private readonly ILogger<PlcEquipmentDataService> _logger;

        public PlcEquipmentDataService(
            IHubContext<ProcessMonitoringHub> hubContext,
            ILogger<PlcEquipmentDataService> logger)
        {
            _hubContext = hubContext;
            _logger = logger;
        }

        public async Task<PlcEquipmentDataReceiveResponseDto> HandleEquipmentDataAsync(JsonElement payload)
        {
            var receivedAt = DateTime.UtcNow;
            var rawPayload = payload.Clone();

            _logger.LogInformation("PLC equipment data received: {Payload}", rawPayload.GetRawText());

            await _hubContext.Clients.All.SendAsync("PlcEquipmentDataReceived", new
            {
                ReceivedAt = receivedAt,
                Payload = rawPayload
            });

            return new PlcEquipmentDataReceiveResponseDto
            {
                Success = true,
                ReceivedAt = receivedAt,
                Message = "PLC equipment data received."
            };
        }

        public async Task<PlcEquipmentStateResponseDto> HandleEquipmentStateAsync(PlcEquipmentStateRequestDto dto)
        {
            var equipmentId = dto.EquipmentID.Trim();
            var state = dto.State.Trim().ToUpperInvariant();
            var receivedAt = DateTime.UtcNow;

            _logger.LogInformation(
                "PLC equipment state received. EquipmentID: {EquipmentID}, State: {State}, OccurredAt: {OccurredAt}",
                equipmentId,
                state,
                dto.OccurredAt);

            await _hubContext.Clients.All.SendAsync("PlcEquipmentStateChanged", new
            {
                EquipmentID = equipmentId,
                State = state,
                OccurredAt = dto.OccurredAt,
                ReceivedAt = receivedAt
            });

            return new PlcEquipmentStateResponseDto
            {
                Success = true,
                EquipmentID = equipmentId,
                State = state,
                ReceivedAt = receivedAt,
                Message = "PLC equipment state received."
            };
        }
    }
}
