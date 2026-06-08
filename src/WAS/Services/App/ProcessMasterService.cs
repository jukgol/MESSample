using Shared.Models.App;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace WAS.Services.App
{
    public class ProcessMasterService : IProcessMasterService
    {
        private readonly IScriptExecutor _scriptExecutor;
        private readonly ILogger<ProcessMasterService> _logger;

        public ProcessMasterService(IScriptExecutor scriptExecutor, ILogger<ProcessMasterService> logger)
        {
            _scriptExecutor = scriptExecutor;
            _logger = logger;
        }

        public async Task<IEnumerable<ProcessMasterDto>> GetProcessMastersAsync()
        {
            return await _scriptExecutor.ExecuteQueryAsync<ProcessMasterDto>("App/ProcessMaster/GET_PROCESS_MASTER_LIST");
        }

        public async Task<ProcessMasterDto?> GetProcessMasterByIdAsync(int id)
        {
            var result = await _scriptExecutor.ExecuteQueryAsync<ProcessMasterDto>("App/ProcessMaster/GET_PROCESS_MASTER_BY_ID", new { ProcessId = id });
            return result.FirstOrDefault();
        }

        public async Task<ProcessMasterDto?> GetProcessMasterByCodeAsync(string code)
        {
            var result = await _scriptExecutor.ExecuteQueryAsync<ProcessMasterDto>("App/ProcessMaster/GET_PROCESS_MASTER_BY_CODE", new { ProcessCode = code });
            return result.FirstOrDefault();
        }

        public async Task CreateProcessMasterAsync(ProcessMasterCreateDto dto)
        {
            await _scriptExecutor.ExecuteNonQueryAsync("App/ProcessMaster/CREATE_PROCESS_MASTER", new
            {
                ProcessCode = dto.ProcessCode,
                ProcessName = dto.ProcessName,
                Description = dto.Description
            });
        }

        public async Task UpdateProcessMasterAsync(int id, ProcessMasterUpdateDto dto)
        {
            await _scriptExecutor.ExecuteNonQueryAsync("App/ProcessMaster/UPDATE_PROCESS_MASTER", new
            {
                ProcessId = id,
                ProcessName = dto.ProcessName,
                Description = dto.Description
            });
        }

        public async Task DeleteProcessMasterAsync(int id)
        {
            await _scriptExecutor.ExecuteNonQueryAsync("App/ProcessMaster/DELETE_PROCESS_MASTER", new
            {
                ProcessId = id
            });
        }
    }
}
