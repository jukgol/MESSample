using Microsoft.Extensions.Logging;
using Server.Attributes;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Services.Table
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
        public async Task<List<string>> GetAttribScriptsAsync()
        {
            string baseDir = Directory.GetCurrentDirectory();
            string path = Path.Combine(baseDir, "Data", "Scripts", "Queries", "Attrib");

            if (!Directory.Exists(path)) path = Path.Combine(baseDir, "src", "Server", "Data", "Scripts", "Queries", "Attrib");
            if (!Directory.Exists(path)) path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Data", "Scripts", "Queries", "Attrib");

            if (!Directory.Exists(path)) return new List<string>();

            return Directory.GetFiles(path, "*.sql").Select(Path.GetFileName).ToList();
        }

        [Log("테이블 속성 스크립트 실행")]
        public async Task<(bool Success, string Message, string ExecutedSql)> ExecuteAttribScriptAsync(string fileName, string tableName, string columnName)
        {
            try
            {
                string baseDir = Directory.GetCurrentDirectory();
                string attribPath = Path.Combine(baseDir, "Data", "Scripts", "Queries", "Attrib");
                if (!Directory.Exists(attribPath)) attribPath = Path.Combine(baseDir, "src", "Server", "Data", "Scripts", "Queries", "Attrib");
                if (!Directory.Exists(attribPath)) attribPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Data", "Scripts", "Queries", "Attrib");

                string filePath = Path.Combine(attribPath, fileName);
                if (!System.IO.File.Exists(filePath)) return (false, "속성 스크립트 파일을 찾을 수 없습니다.", "");

                string sql = await System.IO.File.ReadAllTextAsync(filePath);
                sql = sql.Replace("{TABLE}", tableName, StringComparison.OrdinalIgnoreCase)
                         .Replace("{COLUMN}", columnName, StringComparison.OrdinalIgnoreCase);

                _logger.LogInformation("--- [속성 스크립트 실행 시도] 파일: {FileName}, 대상: {Table}.{Column} ---", 
                    fileName, tableName, columnName);

                var result = await _scriptExecutor.ExecuteSqlAsync(sql);

                if (result.Success)
                {
                    _logger.LogInformation("--- [속성 스크립트 실행 성공] ---");
                    return (true, result.Message, sql);
                }
                else
                {
                    _logger.LogError("--- [속성 스크립트 실행 실패] ---\nSQL: {Sql}\nError: {Error}", sql, result.Message);
                    return (false, result.Message, sql);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "--- [속성 스크립트 서버 오류] ---");
                return (false, $"속성 스크립트 실행 중 서버 오류: {ex.Message}", "");
            }
        }
    }
}
