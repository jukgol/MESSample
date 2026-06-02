using Shared.Models.App;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WAS.Services.App
{
    public class ProcessStepService : IProcessStepService
    {
        private readonly IScriptExecutor _scriptExecutor;

        public ProcessStepService(IScriptExecutor scriptExecutor)
        {
            _scriptExecutor = scriptExecutor;
        }

        public async Task<IEnumerable<ProcessStepDto>> GetProcessStepsAsync()
        {
            return await _scriptExecutor.ExecuteQueryAsync<ProcessStepDto>("App/ProcessStep/GET_PROCESS_STEP_LIST");
        }

        public async Task<ProcessStepDto?> GetProcessStepByIdAsync(int id)
        {
            var result = await _scriptExecutor.ExecuteQueryAsync<ProcessStepDto>("App/ProcessStep/GET_PROCESS_STEP_BY_ID", new { StepId = id });
            return result.FirstOrDefault();
        }

        public async Task CreateProcessStepAsync(ProcessStepCreateDto dto)
        {
            await _scriptExecutor.ExecuteNonQueryAsync("App/ProcessStep/CREATE_PROCESS_STEP", new
            {
                StepName = dto.StepName,
                SeqNo = dto.SeqNo,
                StepType = dto.StepType,
                Description = dto.Description,
                BomId = dto.BomID
            });
        }

        public async Task UpdateProcessStepAsync(int id, ProcessStepUpdateDto dto)
        {
            await _scriptExecutor.ExecuteNonQueryAsync("App/ProcessStep/UPDATE_PROCESS_STEP", new
            {
                StepId = id,
                StepName = dto.StepName,
                SeqNo = dto.SeqNo,
                StepType = dto.StepType,
                Description = dto.Description,
                BomId = dto.BomID
            });
        }

        public async Task DeleteProcessStepAsync(int id)
        {
            await _scriptExecutor.ExecuteNonQueryAsync("App/ProcessStep/DELETE_PROCESS_STEP", new
            {
                StepId = id
            });
        }
    }
}
