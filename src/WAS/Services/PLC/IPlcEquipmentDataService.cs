using Shared.Models.PLC;
using System.Text.Json;
using System.Threading.Tasks;

namespace WAS.Services.PLC
{
    public interface IPlcEquipmentDataService
    {
        Task<PlcEquipmentDataReceiveResponseDto> HandleEquipmentDataAsync(JsonElement payload);
        Task<PlcEquipmentStateResponseDto> HandleEquipmentStateAsync(PlcEquipmentStateRequestDto dto);
    }
}
