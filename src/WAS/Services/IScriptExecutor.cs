using System.Collections.Generic;
using System.Threading.Tasks;

namespace WAS.Services
{
    public interface IScriptExecutor
    {
        // 원시 SQL 문 실행 (여러 문장 포함 가능)
        Task<(bool Success, string Message)> ExecuteSqlAsync(string sql);

        // 쿼리 이름으로 데이터 조회
        Task<IEnumerable<T>> ExecuteQueryAsync<T>(string queryName, object? parameters = null);

        // 단일 SQL 문 실행 (Dapper 기반)
        Task ExecuteNonQueryAsync(string sql, object? parameters = null);
    }
}
