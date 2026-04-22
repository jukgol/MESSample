using WAS.Data;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using System.Linq;
using System.IO;
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
            catch (Exception ex)
            {
                return (false, $"SQL 실행 오류: {ex.Message}");
            }
        }

        public async Task<IEnumerable<T>> ExecuteQueryAsync<T>(string queryName, object? parameters = null)
        {
            using var connection = _db.CreateConnection();
            string sql = await GetQuerySqlAsync(queryName);
            
            // 파라미터가 Dictionary 형태인 경우 (SchemaName, TableName 등 치환용)
            if (parameters is IEnumerable<KeyValuePair<string, object>> dict)
            {
                foreach (var kv in dict)
                {
                    sql = sql.Replace($"{{{kv.Key}}}", kv.Value?.ToString() ?? "");
                    // 대소문자 대응
                    sql = sql.Replace($":{kv.Key}", kv.Value?.ToString() ?? "");
                }
            }

            return await connection.QueryAsync<T>(sql, parameters);
        }

        public async Task ExecuteNonQueryAsync(string sql, object? parameters = null)
        {
            using var connection = _db.CreateConnection();
            await connection.ExecuteAsync(sql, parameters);
        }

        private async Task<string> GetQuerySqlAsync(string queryName)
        {
            // 1. 하드코딩된 기본 쿼리 처리 (파일이 없을 경우 대비)
            if (queryName == "GET_TABLE_DATA")
                return "SELECT * FROM {SchemaName}.{TableName} WHERE ROWNUM <= 100";
            
            if (queryName == "GET_TABLE_METADATA")
                return @"SELECT COLUMN_NAME as Name, DATA_TYPE as DataType, NULLABLE as IsNullable, 
                         IDENTITY_COLUMN as IsIdentity, DATA_DEFAULT as HasDefault
                         FROM ALL_TAB_COLUMNS 
                         WHERE OWNER = :SchemaName AND TABLE_NAME = :TableName
                         ORDER BY COLUMN_ID";

            // 2. 파일에서 읽기 시도
            string path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Data", "Scripts", "Queries", $"{queryName}.sql");
            if (!File.Exists(path))
            {
                string projectRoot = Directory.GetCurrentDirectory();
                path = Path.Combine(projectRoot, "Data", "Scripts", "Queries", $"{queryName}.sql");
                if (!File.Exists(path))
                    path = Path.Combine(projectRoot, "src", "WAS", "Data", "Scripts", "Queries", $"{queryName}.sql");
            }

            if (File.Exists(path))
                return await File.ReadAllTextAsync(path);

            // 3. 파일도 없고 하드코딩도 없으면 이름을 그대로 SQL로 간주
            return queryName;
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
