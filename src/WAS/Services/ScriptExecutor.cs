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
            
            // {Key} 형태의 템플릿 치환 처리
            sql = ProcessTemplate(sql, parameters);
            
            // SQL 구문 정리 (슬래시나 세미콜론 등 구분자 제거)
            sql = ParseStatements(sql).FirstOrDefault() ?? sql;
            
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
            
            // {Key} 형태의 템플릿 치환 처리
            sql = ProcessTemplate(sql, parameters);

            // SQL 구문 정리 (슬래시나 세미콜론 등 구분자 제거)
            sql = ParseStatements(sql).FirstOrDefault() ?? sql;
            
            var dapperParams = MapParameters(parameters);
            
            try
            {
                // Oracle 연결인 경우 BindByName 설정을 위해 명시적으로 처리
                if (connection is OracleConnection oraConn)
                {
                    if (oraConn.State != ConnectionState.Open) oraConn.Open();
                }

                await connection.ExecuteAsync(sql, dapperParams);
            }
            catch (Exception ex)
            {
                throw new Exception($"[DB-EXEC-ERR] {ex.Message} (Query: {queryName})", ex);
            }
        }

        private string ProcessTemplate(string sql, object? parameters)
        {
            if (parameters == null) return sql;

            var result = sql;
            if (parameters is IEnumerable<OracleParameter> oracleParams)
            {
                foreach (var p in oracleParams)
                {
                    result = result.Replace($"{{{p.ParameterName.TrimStart(':')}}}", p.Value?.ToString(), StringComparison.OrdinalIgnoreCase);
                }
            }
            else if (parameters is IDictionary<string, object> dict)
            {
                foreach (var kv in dict)
                {
                    result = result.Replace($"{{{kv.Key.TrimStart(':')}}}", kv.Value?.ToString(), StringComparison.OrdinalIgnoreCase);
                }
            }
            else
            {
                var props = parameters.GetType().GetProperties();
                foreach (var prop in props)
                {
                    var val = prop.GetValue(parameters);
                    result = result.Replace($"{{{prop.Name}}}", val?.ToString(), StringComparison.OrdinalIgnoreCase);
                }
            }

            return result;
        }

        private DynamicParameters? MapParameters(object? parameters)
        {
            if (parameters == null) return null;
            if (parameters is DynamicParameters dp) return dp;

            var dapperParams = new DynamicParameters();

            // OracleParameter 컬렉션 처리 추가
            if (parameters is IEnumerable<OracleParameter> oracleParams)
            {
                foreach (var p in oracleParams)
                {
                    // 파라미터 이름에서 ':' 제거 (Dapper가 내부적으로 처리하지만 명시적으로 제거)
                    var name = p.ParameterName.TrimStart(':');
                    dapperParams.Add(name, p.Value, p.DbType, p.Direction, p.Size);
                }
                return dapperParams;
            }

            if (parameters is IDictionary<string, object> dict)
            {
                foreach (var kv in dict)
                {
                    var value = kv.Value is JsonElement je ? ConvertJsonElement(je) : kv.Value;
                    dapperParams.Add(kv.Key.TrimStart(':'), value);
                }
            }
            else
            {
                var props = parameters.GetType().GetProperties();
                foreach (var prop in props)
                {
                    var val = prop.GetValue(parameters);
                    // 만약 속성 값 자체가 OracleParameter인 경우에 대한 방어 코드
                    if (val is OracleParameter op)
                    {
                        dapperParams.Add(op.ParameterName.TrimStart(':'), op.Value, op.DbType, op.Direction, op.Size);
                    }
                    else
                    {
                        dapperParams.Add(prop.Name, val);
                    }
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
