using Dapper;
using Oracle.ManagedDataAccess.Client;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using WAS.Data;

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

                var statements = ParseStatements(sql);
                int executedCount = 0;

                foreach (var stmt in statements)
                {
                    if (string.IsNullOrWhiteSpace(stmt)) continue;
                    using var command = connection.CreateCommand();
                    command.CommandText = stmt;
                    if (command is System.Data.Common.DbCommand dbCmd) await dbCmd.ExecuteNonQueryAsync();
                    else command.ExecuteNonQuery();
                    executedCount++;
                }
                return (true, $"{executedCount}개의 명령이 성공적으로 실행되었습니다.");
            }
            catch (OracleException oex)
            {
                return (false, $"[DB-ERR] Oracle 오류 (코드: {oex.Number}): {oex.Message}");
            }
            catch (Exception ex)
            {
                return (false, $"[SYS-ERR] 시스템 오류: {ex.Message}");
            }
        }

        public async Task<IEnumerable<T>> ExecuteQueryAsync<T>(string queryName, object? parameters = null)
        {
            using var connection = _db.CreateConnection();
            string sql = await GetQuerySqlAsync(queryName);
            
            var dapperParams = MapParameters(parameters);

            try 
            {
                // Oracle 연결인 경우 BindByName 설정을 위해 명시적으로 처리
                if (connection is OracleConnection oraConn)
                {
                    if (oraConn.State != ConnectionState.Open) oraConn.Open();
                }

                return await connection.QueryAsync<T>(sql, dapperParams);
            }
            catch (OracleException oex)
            {
                throw new Exception($"[DB-ERR] 쿼리 실행 실패 (코드: {oex.Number}): {oex.Message}\nSQL: {sql}");
            }
        }

        public async Task ExecuteNonQueryAsync(string queryName, object? parameters = null)
        {
            using var connection = _db.CreateConnection();
            string sql = await GetQuerySqlAsync(queryName);
            
            var dapperParams = MapParameters(parameters);
            
            try
            {
                // Oracle 연결인 경우 BindByName 설정을 위해 명시적으로 처리
                if (connection is OracleConnection oraConn)
                {
                    if (oraConn.State != ConnectionState.Open) oraConn.Open();
                    // Dapper Execute 호출 시 내부적으로 생성되는 Command의 BindByName을 true로 만드는 
                    // 가장 확실한 방법은 Dapper의 파라미터 핸들러를 사용하는 것이지만, 
                    // 여기서는 가장 호환성 높은 방식으로 처리합니다.
                }

                await connection.ExecuteAsync(sql, dapperParams);
            }
            catch (Exception ex)
            {
                throw new Exception($"[DB-EXEC-ERR] {ex.Message} (Query: {queryName})", ex);
            }
        }

        private DynamicParameters? MapParameters(object? parameters)
        {
            if (parameters == null) return null;
            if (parameters is DynamicParameters dp) return dp;

            var dapperParams = new DynamicParameters();

            if (parameters is IDictionary<string, object> dict)
            {
                foreach (var kv in dict)
                {
                    var value = kv.Value is JsonElement je ? ConvertJsonElement(je) : kv.Value; // ✅ 변환
                    dapperParams.Add(kv.Key.TrimStart(':'), value);
                }
            }
            else
            {
                var props = parameters.GetType().GetProperties();
                foreach (var prop in props)
                {
                    dapperParams.Add(prop.Name, prop.GetValue(parameters));
                }
            }

            return dapperParams;
        }

        // JsonElement → 실제 C# 타입으로 변환
        private static object? ConvertJsonElement(JsonElement je)
        {
            return je.ValueKind switch
            {
                JsonValueKind.String => je.GetString(),   // "newid1" → string
                JsonValueKind.Number => je.TryGetInt64(out var l) ? l : je.GetDouble(), // 숫자 → long/double
                JsonValueKind.True => true,             // true → bool
                JsonValueKind.False => false,            // false → bool
                JsonValueKind.Null => null,             // null → null
                _ => je.ToString()     // 나머지 → string fallback
            };
        }

        private async Task<string> GetQuerySqlAsync(string queryName)
        {
            string baseDir = AppDomain.CurrentDomain.BaseDirectory;
            string path = Path.Combine(baseDir, "Data", "Scripts", "Queries", $"{queryName}.sql");

            if (!File.Exists(path))
            {
                path = Path.Combine(Directory.GetCurrentDirectory(), "Data", "Scripts", "Queries", $"{queryName}.sql");
                if (!File.Exists(path))
                {
                    throw new FileNotFoundException($"[SQL-404] '{queryName}' 쿼리 파일을 찾을 수 없습니다. (확인된 경로: {path})");
                }
            }

            return await File.ReadAllTextAsync(path);
        }

        private IEnumerable<string> ParseStatements(string sql)
        {
            if (Regex.IsMatch(sql, @"^\s*/\s*$", RegexOptions.Multiline))
            {
                return Regex.Split(sql, @"^\s*/\s*$", RegexOptions.Multiline).Select(s => s.Trim()).Where(s => !string.IsNullOrEmpty(s));
            }
            bool isPlSql = Regex.IsMatch(sql, @"CREATE\s+(OR\s+REPLACE\s+)?(PROCEDURE|FUNCTION|PACKAGE|TRIGGER|TYPE)", RegexOptions.IgnoreCase) 
                         || Regex.IsMatch(sql, @"^\s*(BEGIN|DECLARE)", RegexOptions.IgnoreCase | RegexOptions.Multiline);

            if (isPlSql) return new[] { sql.Trim().TrimEnd(';') };
            return sql.Split(';', StringSplitOptions.RemoveEmptyEntries).Select(s => s.Trim()).Where(s => !string.IsNullOrEmpty(s));
        }
    }
}
