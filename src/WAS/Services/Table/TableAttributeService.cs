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

        [Log("?åÏù¥Î∏??çÏÑ± ?§ÌÅ¨Î¶ΩÌä∏ Î™©Î°ù Ï°∞Ìöå")]
        public async Task<List<string>> GetAttribScriptsAsync()
        {
            string baseDir = Directory.GetCurrentDirectory();
            string path = Path.Combine(baseDir, "Data", "Scripts", "Queries", "Attrib");

            if (!Directory.Exists(path)) path = Path.Combine(baseDir, "src", "WAS", "Data", "Scripts", "Queries", "Attrib");
            if (!Directory.Exists(path)) path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Data", "Scripts", "Queries", "Attrib");

            if (!Directory.Exists(path)) return new List<string>();

            return Directory.GetFiles(path, "*.sql").Select(Path.GetFileName).ToList();
        }

        [Log("?åÏù¥Î∏??çÏÑ± ?§ÌÅ¨Î¶ΩÌä∏ ?§Ìñâ")]
        public async Task<(bool Success, string Message, string ExecutedSql)> ExecuteAttribScriptAsync(
            string fileName, 
            string tableName, 
            string columnName,
            string? newColName = null,
            string? dataType = null,
            bool isNotNull = false,
            bool isUnique = false
        )
        {
            try
            {
                string baseDir = Directory.GetCurrentDirectory();
                string attribPath = Path.Combine(baseDir, "Data", "Scripts", "Queries", "Attrib");
                if (!Directory.Exists(attribPath)) attribPath = Path.Combine(baseDir, "src", "WAS", "Data", "Scripts", "Queries", "Attrib");
                if (!Directory.Exists(attribPath)) attribPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Data", "Scripts", "Queries", "Attrib");

                string filePath = Path.Combine(attribPath, fileName);
                if (!System.IO.File.Exists(filePath)) return (false, "?çÏÑ± ?§ÌÅ¨Î¶ΩÌä∏ ?åÏùº??Ï∞æÏùÑ ???ÜÏäµ?àÎã§.", "");

                string sql = await System.IO.File.ReadAllTextAsync(filePath);
                
                // Í∏∞Î≥∏ ÏπòÌôò
                sql = sql.Replace("{TABLE}", tableName, StringComparison.OrdinalIgnoreCase)
                         .Replace("{COLUMN}", columnName, StringComparison.OrdinalIgnoreCase);

                // Ï∂îÍ? ÏπòÌôò (??Ïª¨Îüº Ï∂îÍ???
                if (!string.IsNullOrEmpty(newColName))
                    sql = sql.Replace("{NEW_COL}", newColName, StringComparison.OrdinalIgnoreCase);
                
                if (!string.IsNullOrEmpty(dataType))
                    sql = sql.Replace("{TYPE}", dataType, StringComparison.OrdinalIgnoreCase);

                sql = sql.Replace("{NOTNULL}", isNotNull ? "1" : "0", StringComparison.OrdinalIgnoreCase)
                         .Replace("{UNIQUE}", isUnique ? "1" : "0", StringComparison.OrdinalIgnoreCase);

                _logger.LogInformation("--- [?çÏÑ± ?§ÌÅ¨Î¶ΩÌä∏ ?§Ìñâ ?úÎèÑ] ?åÏùº: {FileName}, ?Ä?? {Table} ---", 
                    fileName, tableName);

                var result = await _scriptExecutor.ExecuteSqlAsync(sql);

                if (result.Success)
                {
                    _logger.LogInformation("--- [?çÏÑ± ?§ÌÅ¨Î¶ΩÌä∏ ?§Ìñâ ?±Í≥µ] ---");
                    return (true, result.Message, sql);
                }
                else
                {
                    _logger.LogError("--- [?çÏÑ± ?§ÌÅ¨Î¶ΩÌä∏ ?§Ìñâ ?§Ìå®] ---\nSQL: {Sql}\nError: {Error}", sql, result.Message);
                    return (false, result.Message, sql);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "--- [?çÏÑ± ?§ÌÅ¨Î¶ΩÌä∏ ?úÎ≤Ñ ?§Î•ò] ---");
                return (false, $"?çÏÑ± ?§ÌÅ¨Î¶ΩÌä∏ ?§Ìñâ Ï§??úÎ≤Ñ ?§Î•ò: {ex.Message}", "");
            }
        }

        [Log("?åÏù¥Î∏??ùÏÑ± ?§Ìñâ")]
        public async Task<(bool Success, string Message, string ExecutedSql)> CreateTableAsync(string tableName, string sql)
        {
            try
            {
                // 1. ÎßàÏù¥Í∑∏Î†à?¥ÏÖò ?¥Î†• ?Ä??
                string baseDir = Directory.GetCurrentDirectory();
                string migrationPath = Path.Combine(baseDir, "Data", "Scripts", "Migrations");
                if (!Directory.Exists(migrationPath)) migrationPath = Path.Combine(baseDir, "src", "WAS", "Data", "Scripts", "Migrations");
                if (!Directory.Exists(migrationPath)) migrationPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Data", "Scripts", "Migrations");

                if (!Directory.Exists(migrationPath)) Directory.CreateDirectory(migrationPath);

                string timestamp = DateTime.Now.ToString("yyyyMMddHHmmss");
                string fileName = $"{timestamp}_CREATE_{tableName}.sql";
                string filePath = Path.Combine(migrationPath, fileName);
                
                await File.WriteAllTextAsync(filePath, sql);

                // 2. SQL ?§Ìñâ
                _logger.LogInformation("--- [?åÏù¥Î∏??ùÏÑ± ?úÎèÑ] Î™ÖÏÑ∏??Í∏∞Î∞ò ?êÎèô ?ùÏÑ± SQL ?§Ìñâ ---");
                var result = await _scriptExecutor.ExecuteSqlAsync(sql);

                if (result.Success)
                {
                    _logger.LogInformation("--- [?åÏù¥Î∏??ùÏÑ± ?±Í≥µ] {TableName} ---", tableName);
                    return (true, result.Message, sql);
                }
                else
                {
                    _logger.LogError("--- [?åÏù¥Î∏??ùÏÑ± ?§Ìå®] ---\nSQL: {Sql}\nError: {Error}", sql, result.Message);
                    return (false, result.Message, sql);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "--- [?åÏù¥Î∏??ùÏÑ± ?úÎ≤Ñ ?§Î•ò] ---");
                return (false, $"?åÏù¥Î∏??ùÏÑ± Ï§??úÎ≤Ñ ?§Î•ò: {ex.Message}", "");
            }
        }
    }
}

