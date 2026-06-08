using Shared.Models.App;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IO;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using System;

namespace WAS.Services.App
{
    public class ProcessStepService : IProcessStepService
    {
        private readonly IScriptExecutor _scriptExecutor;
        private readonly ILogger<ProcessStepService> _logger;

        public ProcessStepService(IScriptExecutor scriptExecutor, ILogger<ProcessStepService> logger)
        {
            _scriptExecutor = scriptExecutor;
            _logger = logger;
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
                ProcessMasterId = dto.ProcessMasterID
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
                ProcessMasterId = dto.ProcessMasterID
            });
        }

        public async Task DeleteProcessStepAsync(int id)
        {
            await _scriptExecutor.ExecuteNonQueryAsync("App/ProcessStep/DELETE_PROCESS_STEP", new
            {
                StepId = id
            });
        }

        public async Task LoadScenarioStepsAsync()
        {
            var currentDir = Directory.GetCurrentDirectory();
            var path = Path.Combine(currentDir, "..", "senario", "data", "process.json");

            if (!File.Exists(path))
            {
                var dir = currentDir;
                while (dir != null && !File.Exists(Path.Combine(dir, "senario", "data", "process.json")))
                {
                    dir = Directory.GetParent(dir)?.FullName;
                }

                if (dir != null)
                {
                    path = Path.Combine(dir, "senario", "data", "process.json");
                }
            }

            if (!File.Exists(path))
            {
                _logger.LogError("Scenario process JSON file not found at: {Path}", path);
                throw new FileNotFoundException($"시나리오 공정 데이터 파일을 찾을 수 없습니다: {path}");
            }

            var jsonText = await File.ReadAllTextAsync(path);
            var options = new JsonSerializerOptions 
            { 
                PropertyNameCaseInsensitive = true,
                PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower
            };
            var steps = JsonSerializer.Deserialize<List<ProcessStepCreateDto>>(jsonText, options);

            if (steps == null || steps.Count == 0)
            {
                _logger.LogWarning("Scenario process step list is empty or invalid in JSON.");
                return;
            }

            foreach (var step in steps)
            {
                var existing = await _scriptExecutor.ExecuteQueryAsync<ProcessStepDto>("App/ProcessStep/GET_PROCESS_STEP_BY_NAME", new { StepName = step.StepName });
                if (existing.Any())
                {
                    _logger.LogInformation("[SKIP] {StepName} (Seq: {SeqNo}) 이미 존재함", step.StepName, step.SeqNo);
                }
                else
                {
                    await CreateProcessStepAsync(step);
                    _logger.LogInformation("[INSERT] {StepName} (Seq: {SeqNo}) 추가 완료", step.StepName, step.SeqNo);
                }
            }
        }
    }
}
