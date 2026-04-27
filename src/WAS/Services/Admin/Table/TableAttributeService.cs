using Microsoft.Extensions.Logging;
using WAS.Attributes;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using WAS.Data;

namespace WAS.Services.Admin.Table
{
    public class TableAttributeService : ITableAttributeService
    {
        private readonly IScriptExecutor _scriptExecutor;
        private readonly ILogger<TableAttributeService> _logger;

        public TableAttributeService(IScriptExecutor scriptExecutor, ILogger<TableAttributeService> logger)
        {
            _scriptExecutor = scriptExecutor;
            _logger = logger;
        }

        [Log("테이블 속성 스크립트 목록 조회")]
        public Task<List<string>> GetAttribScriptsAsync()
        {
            string path = GetAttribScriptsPath();
            if (!Directory.Exists(path))
            {
                _logger.LogWarning($"[TABLE_ATTR] 경로를 찾을 수 없습니다: {path}");
                return Task.FromResult(new List<string>());
            }

            var files = Directory.GetFiles(path, "*.sql");
            var result = files.Select(f => Path.GetFileName(f)).ToList(); // 확장자 포함하여 반환 (프론트엔드 요구사항 확인 필요)
            return Task.FromResult(result);
        }

        public async Task<string> GetScriptContentAsync(string scriptName)
        {
            string path = Path.Combine(GetAttribScriptsPath(), scriptName);
            if (!File.Exists(path)) throw new FileNotFoundException("스크립트 파일을 찾을 수 없습니다.");
            return await File.ReadAllTextAsync(path);
        }

        public async Task ApplyScriptAsync(string scriptName, Dictionary<string, object> parameters)
        {
            var content = await GetScriptContentAsync(scriptName);
            // 단순 실행 (Dapper 방식)
            await _scriptExecutor.ExecuteNonQueryAsync(content, parameters);
        }

        // 컨트롤러 호출용 상세 구현
        public async Task<(bool Success, string Message, string ExecutedSql)> ExecuteAttribScriptAsync(string fileName, string tableName, string columnName, string? newColumnName, string? dataType, bool isNotNull, bool isUnique)
        {
            try
            {
                string sql = await GetScriptContentAsync(fileName);
                
                // 플레이스홀더 치환
                sql = sql.Replace("{TABLE_NAME}", tableName)
                         .Replace("{COLUMN_NAME}", columnName)
                         .Replace("{NEW_COLUMN_NAME}", newColumnName ?? "")
                         .Replace("{DATA_TYPE}", dataType ?? "")
                         .Replace("{NOT_NULL}", isNotNull ? "NOT NULL" : "NULL")
                         .Replace("{UNIQUE}", isUnique ? "UNIQUE" : "");

                var result = await _scriptExecutor.ExecuteSqlAsync(sql);
                return (result.Success, result.Message, sql);
            }
            catch (Exception ex)
            {
                return (false, $"스크립트 실행 오류: {ex.Message}", "");
            }
        }

        public async Task<(bool Success, string Message, string ExecutedSql)> CreateTableAsync(string tableName, string sql)
        {
            try
            {
                var result = await _scriptExecutor.ExecuteSqlAsync(sql);
                return (result.Success, result.Message, sql);
            }
            catch (Exception ex)
            {
                return (false, $"테이블 생성 오류: {ex.Message}", sql);
            }
        }

        private string GetAttribScriptsPath()
        {
            string baseDir = AppDomain.CurrentDomain.BaseDirectory;
            string path = Path.Combine(baseDir, "Data", "Scripts", "Queries", "Attrib");
            if (Directory.Exists(path)) return path;

            string projectRoot = Directory.GetCurrentDirectory();
            path = Path.Combine(projectRoot, "Data", "Scripts", "Queries", "Attrib");
            if (Directory.Exists(path)) return path;

            path = Path.Combine(projectRoot, "src", "WAS", "Data", "Scripts", "Queries", "Attrib");
            return path;
        }
    }
}
