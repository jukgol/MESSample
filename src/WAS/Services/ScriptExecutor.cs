using WAS.Data;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using System.Linq;
using System.IO;
using System.Reflection;
using System.Text.RegularExpressions;
using Oracle.ManagedDataAccess.Client;
using Dapper;

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
            
            var dapperParams = new DynamicParameters();
            var paramDict = new Dictionary<string, string>();

            if (parameters != null)
            {
                // 1. OracleParameter 배열/컬렉션인 경우
                if (parameters is IEnumerable<OracleParameter> oraParams)
                {
                    foreach (var p in oraParams)
                    {
                        var name = p.ParameterName.TrimStart(':');
                        paramDict[name] = p.Value?.ToString() ?? "";
                        dapperParams.Add(name, p.Value);
                    }
                }
                // 2. 익명 객체인 경우
                else if (parameters is not DynamicParameters)
                {
                    var props = parameters.GetType().GetProperties();
                    foreach (var prop in props)
                    {
                        var val = prop.GetValue(parameters);
                        paramDict[prop.Name] = val?.ToString() ?? "";
                        dapperParams.Add(prop.Name, val);
                    }
                }
                else
                {
                    dapperParams = (DynamicParameters)parameters;
                }
            }

            // SQL 내의 {Key} 형식 치환 (테이블명/스키마명 등 물리적 식별자용)
            foreach (var kv in paramDict)
            {
                sql = Regex.Replace(sql, $"\\{{{kv.Key}\\}}", kv.Value, RegexOptions.IgnoreCase);
            }

            // 최종 SQL에 미치환된 중괄호 체크
            if (Regex.IsMatch(sql, @"\{.+\}"))
            {
                throw new InvalidOperationException($"[SQL-501] 필수 매개변수가 치환되지 않았습니다. SQL: {sql}");
            }

            // 오라클 드라이버는 SQL 끝에 ';' 또는 '/'가 있으면 오류를 냅니다. 이를 제거합니다.
            sql = sql.Trim().TrimEnd(';').TrimEnd('/').Trim();

            try 
            {
                return await connection.QueryAsync<T>(sql, dapperParams);
            }
            catch (OracleException oex)
            {
                throw new Exception($"[DB-ERR] 쿼리 실행 실패 (코드: {oex.Number}): {oex.Message}\n실행된 SQL: {sql}");
            }
        }

        public async Task ExecuteNonQueryAsync(string sql, object? parameters = null)
        {
            using var connection = _db.CreateConnection();
            
            object? finalParams = parameters;
            if (parameters is IEnumerable<OracleParameter> oraParams)
            {
                var dapperParams = new DynamicParameters();
                foreach (var p in oraParams)
                {
                    dapperParams.Add(p.ParameterName.TrimStart(':'), p.Value);
                }
                finalParams = dapperParams;
            }
            
            await connection.ExecuteAsync(sql, finalParams);
        }

        private async Task<string> GetQuerySqlAsync(string queryName)
        {
            // 1. 기본 경로 설정 (애플리케이션 실행 디렉토리 기준)
            string baseDir = AppDomain.CurrentDomain.BaseDirectory;
            string path = Path.Combine(baseDir, "Data", "Scripts", "Queries", $"{queryName}.sql");

            // 2. 개발 환경을 고려한 대체 경로 확인 (현재 작업 디렉토리 기준)
            if (!File.Exists(path))
            {
                path = Path.Combine(Directory.GetCurrentDirectory(), "Data", "Scripts", "Queries", $"{queryName}.sql");
                if (!File.Exists(path))
                {
                    // 더 이상 찾을 수 없는 경우, 입력된 queryName 자체가 SQL인 경우(SELECT 포함)를 제외하고 예외 발생
                    if (!queryName.Contains("SELECT", StringComparison.OrdinalIgnoreCase))
                    {
                        throw new FileNotFoundException($"[SQL-404] '{queryName}' 쿼리 파일을 찾을 수 없습니다. (확인된 경로: {path})");
                    }
                    return queryName;
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
