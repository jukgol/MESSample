using System.Collections.Generic;
using System.Threading.Tasks;
using Shared.Models;

namespace WAS.Services.Admin.Table
{
    public interface ITableDataService
    {
        // 테이블 목록 조회
        Task<IEnumerable<string>> GetTablesAsync(string schemaName);

        // 특정 테이블의 실제 데이터 조회
        Task<IEnumerable<dynamic>> GetTableDataAsync(string schemaName, string tableName);

        // 특정 테이블의 메타데이터(컬럼 정보) 조회
        Task<IEnumerable<ColumnMetadata>> GetTableMetadataAsync(string schemaName, string tableName);

        // 테이블에 신규 행 삽입
        Task InsertRowAsync(string schemaName, string tableName, Dictionary<string, object> data);

        // 테이블 데이터를 CSV 파일로 서버 로컬 디렉토리에 저장
        Task<string> SaveTableDataAsCsvAsync(string schemaName, string tableName);
    }
}
