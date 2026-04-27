using System.Collections.Generic;
using System.Threading.Tasks;

namespace WAS.Services.Admin.Table
{
    public interface ITableAttributeService
    {
        // 테이블 속성 설정용 스크립트 목록 조회
        Task<List<string>> GetAttribScriptsAsync();

        // 특정 스크립트 파일 내용 조회
        Task<string> GetScriptContentAsync(string scriptName);

        // 스크립트 적용 (Dapper 기반 실행)
        Task ApplyScriptAsync(string scriptName, Dictionary<string, object> parameters);

        // 속성 스크립트 실행
        Task<(bool Success, string Message, string ExecutedSql)> ExecuteAttribScriptAsync(string fileName, string tableName, string columnName, string? newColumnName, string? dataType, bool isNotNull, bool isUnique);

        // 테이블 생성
        Task<(bool Success, string Message, string ExecutedSql)> CreateTableAsync(string tableName, string sql);
    }
}
