using WAS.Data;
using System;
using System.Data;
using System.Threading.Tasks;

namespace WAS.Services
{
    public class ScriptExecutor : IScriptExecutor
    {
        private readonly DbProvider _db;

        public ScriptExecutor(DbProvider db)
        {
            _db = db;
        }

        public async Task<(bool Success, string Message)> ExecuteSqlAsync(string sql)
        {
            try
            {
                using var connection = _db.CreateConnection();
                if (connection is System.Data.Common.DbConnection dbConn) await dbConn.OpenAsync();
                else connection.Open();

                // 1. ?∏Î?ÏΩúÎ°† Í∏∞Ï??ºÎ°ú Î™ÖÎ†π Î∂ÑÎ¶¨
                var rawStatements = sql.Split(';', StringSplitOptions.RemoveEmptyEntries);
                
                int executedCount = 0;
                foreach (var rawStmt in rawStatements)
                {
                    // 2. Í∞?Î™ÖÎ†π ?¥Î???Ï£ºÏÑù Î∞?Î∂àÌïÑ?îÌïú Í≥µÎ∞± ?úÍ±∞
                    var lines = rawStmt.Split(new[] { "\r\n", "\r", "\n" }, StringSplitOptions.None);
                    var cleanLines = lines
                        .Select(l => l.Trim())
                        .Where(l => !l.StartsWith("--") && !string.IsNullOrWhiteSpace(l))
                        .ToList();
                    
                    var trimmedStmt = string.Join(" ", cleanLines).Trim();
                    
                    if (string.IsNullOrWhiteSpace(trimmedStmt)) continue;

                    // 3. SELECT Î¨∏Ï? NonQuery?êÏÑú ?úÏô∏
                    if (trimmedStmt.StartsWith("SELECT", StringComparison.OrdinalIgnoreCase)) continue;

                    try 
                    {
                        using var command = connection.CreateCommand();
                        command.CommandText = trimmedStmt;
                        
                        if (command is System.Data.Common.DbCommand cmd)
                        {
                            await cmd.ExecuteNonQueryAsync();
                        }
                        else
                        {
                            command.ExecuteNonQuery();
                        }
                        executedCount++;
                    }
                    catch (Exception ex)
                    {
                        // ?¥Îñ§ ÏøºÎ¶¨?êÏÑú ?§Ìå®?àÎäîÏßÄ ?ÅÏÑ∏???åÎ¶º
                        return (false, $"SQL ?§Ìñâ ?§Ìå® (ÏøºÎ¶¨: {trimmedStmt}) : {ex.Message}");
                    }
                }

                return (true, $"{executedCount}Í∞úÏùò Î™ÖÎ†π???±Í≥µ?ÅÏúºÎ°??§Ìñâ?òÏóà?µÎãà??");
            }
            catch (Exception ex)
            {
                return (false, $"?úÏä§???§Î•ò Î∞úÏÉù: {ex.Message}");
            }
        }
    }
}

