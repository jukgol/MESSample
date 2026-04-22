using Microsoft.Extensions.Logging;
using WAS.Attributes;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace WAS.Services.Table
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
            string baseDir = Directory.GetCurrentDirectory();
            string path = Path.Combine(baseDir, "Data", "Scripts", "Queries", "Attrib");

            if (!Directory.Exists(path)) path = Path.Combine(baseDir, "src", "WAS", "Data", "Scripts", "Queries", "Attrib");
            if (!Directory.Exists(path)) path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Data", "Scripts", "Queries", "Attrib");

            if (!Directory.Exists(path))
            {
                _logger.LogWarning($"[TABLE_ATTR] 경로를 찾을 수 없습니다: {path}");
                return Task.FromResult(new List<string>());
            }

            var files = Directory.GetFiles(path, "*.sql");
            var result = files.Select(f => Path.GetFileNameWithoutExtension(f)).ToList();
            return Task.FromResult(result);
        }

        public Task<string> GetScriptContentAsync(string scriptName)
        {
            // TODO: 스크립트 내용 읽기 로직 구현
            return Task.FromResult(string.Empty);
        }

        public Task ApplyScriptAsync(string scriptName, Dictionary<string, object> parameters)
        {
            // TODO: 스크립트 실행 로직 구현
            return Task.CompletedTask;
        }

        // 컨트롤러 호출 대응용 임시 구현
        public Task<(bool Success, string Message, string ExecutedSql)> ExecuteAttribScriptAsync(string fileName, string tableName, string columnName, string? newColumnName, string? dataType, bool isNotNull, bool isUnique)
        {
            return Task.FromResult((true, "스크립트 실행 성공 (임시)", ""));
        }

        public Task<(bool Success, string Message, string ExecutedSql)> CreateTableAsync(string tableName, string sql)
        {
            return Task.FromResult((true, "테이블 생성 성공 (임시)", ""));
        }
    }
}
