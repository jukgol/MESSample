using Server.Data;
using System;
using System.Data;
using System.Threading.Tasks;

namespace Server.Services
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

                // 1. 세미콜론 기준으로 명령 분리
                var rawStatements = sql.Split(';', StringSplitOptions.RemoveEmptyEntries);
                
                int executedCount = 0;
                foreach (var rawStmt in rawStatements)
                {
                    // 2. 각 명령 내부의 주석 및 불필요한 공백 제거
                    var lines = rawStmt.Split(new[] { "\r\n", "\r", "\n" }, StringSplitOptions.None);
                    var cleanLines = lines
                        .Select(l => l.Trim())
                        .Where(l => !l.StartsWith("--") && !string.IsNullOrWhiteSpace(l))
                        .ToList();
                    
                    var trimmedStmt = string.Join(" ", cleanLines).Trim();
                    
                    if (string.IsNullOrWhiteSpace(trimmedStmt)) continue;

                    // 3. SELECT 문은 NonQuery에서 제외
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
                        // 어떤 쿼리에서 실패했는지 상세히 알림
                        return (false, $"SQL 실행 실패 (쿼리: {trimmedStmt}) : {ex.Message}");
                    }
                }

                return (true, $"{executedCount}개의 명령이 성공적으로 실행되었습니다.");
            }
            catch (Exception ex)
            {
                return (false, $"시스템 오류 발생: {ex.Message}");
            }
        }
    }
}
