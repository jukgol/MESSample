using Shared.Models.App;

namespace WAS.Services.App
{
    public interface IProcessOutputService
    {
        Task EnsureInitialOutputsByWorkOrderNoAsync(string workOrderNo);
        Task EnsureInitialOutputAsync(int executionId);
        Task CreateOutputAsync(int executionId, ProcessOutputCreateDto dto);
        Task<int> UpdateOutputQuantityAsync(int outputId, int outputQty);
        Task<int> IncrementGoodOutputByExecutionAsync(int executionId, int qty);
        Task CompleteOutputsAsync(int executionId);
        Task CreateMissingOutputLotTracesAsync(int executionId);
    }
}
