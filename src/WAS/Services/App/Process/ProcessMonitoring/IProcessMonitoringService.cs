using Shared.Models.App;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace WAS.Services.App
{
    public interface IProcessMonitoringService
    {
        Task<IEnumerable<CurrentWorkOrderStateDto>> GetCurrentWorkOrdersAsync();
        Task<CurrentWorkOrderStateDto?> GetCurrentWorkOrderAsync(int workOrderId);
        Task<CurrentProcessStepStateDto?> GetCurrentStepByEquipmentAsync(string equipmentId);
        Task AddWorkOrderToCurrentStateAsync(string workOrderNo);
        Task AddWorkOrderToCurrentStateAsync(int workOrderId);
        Task ReloadCurrentStateAsync();
        Task<IEnumerable<ProcessStepExecutionDto>> GetExecutionsByWorkOrderAsync(int workOrderId);
        Task<IEnumerable<ProcessStepExecutionDto>> GetAllExecutionsAsync();
        Task<ProcessStepExecutionDto?> GetExecutionByIdAsync(int executionId);
        Task CreateExecutionAsync(ProcessStepExecutionCreateDto dto);
        Task StartExecutionAsync(int executionId);
        Task<IEnumerable<ProcessInputDto>> GetInputsAsync(int executionId);
        Task CreateInputAsync(int executionId, ProcessInputCreateDto dto);
        Task UpdateInputQuantityAsync(int inputId, ProcessInputQuantityUpdateDto dto);
        Task<IEnumerable<ProcessOutputDto>> GetOutputsAsync(int executionId);
        Task CreateOutputAsync(int executionId, ProcessOutputCreateDto dto);
        Task UpdateOutputQuantityAsync(int outputId, ProcessOutputQuantityUpdateDto dto);
        Task<StartToolSignalResponseDto> SendStartToolStartAsync(StartToolSignalRequestDto? dto);
        Task<StartToolSignalResponseDto> SendStartToolStopAsync(StartToolSignalRequestDto? dto);
    }
}
