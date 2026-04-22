using WAS.Data;
using System;
using System.Data;
using System.Threading.Tasks;
using System.Collections.Generic;
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

                // 1. 세미콜론 기준으로 명령 분리
                var rawStatements = sql.Split(';', StringSplitOptions.RemoveEmptyEntries);

                int executedCount = 0;
                foreach (var rawStmt in rawStatements)
                {
                    var stmt = rawStmt.Trim();
                    if (string.IsNullOrWhiteSpace(stmt)) continue;

                    using var command = connection.CreateCommand();
                    command.CommandText = stmt;
                    await (command as System.Data.Common.DbCommand)!.ExecuteNonQueryAsync();
                    executedCount++;
                }

                return (true, $"{executedCount}개의 SQL 문이 성공적으로 실행되었습니다.");
            }
            catch (Exception ex)
            {
                return (false, $"SQL 실행 오류: {ex.Message}");
            }
        }

        public async Task<IEnumerable<T>> ExecuteQueryAsync<T>(string queryName, object? parameters = null)
        {
            // TODO: 실제 쿼리 파일을 읽어오는 로직 필요
            using var connection = _db.CreateConnection();
            return await connection.QueryAsync<T>(queryName, parameters);
        }

        public async Task ExecuteNonQueryAsync(string sql, object? parameters = null)
        {
            using var connection = _db.CreateConnection();
            await connection.ExecuteAsync(sql, parameters);
        }
    }
}
