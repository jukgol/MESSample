using System.Collections.Generic;
using System.Threading.Tasks;
using WAS.Models;

namespace WAS.Services.Table
{
    public interface ITableDataService
    {
        // 특정 테이블의 실제 데이터 조회
        Task<IEnumerable<dynamic>> GetTableDataAsync(string schemaName, string tableName);

        // 특정 테이블의 메타데이터(컬럼 정보) 조회
        Task<IEnumerable<ColumnMetadata>> GetTableMetadataAsync(string schemaName, string tableName);

        // 테이블에 신규 행 삽입
        Task InsertRowAsync(string schemaName, string tableName, Dictionary<string, object> data);
    }
}
