using System.Collections.Generic;
using System.Threading.Tasks;

namespace WAS.Services.Admin
{
    public interface ISchemaService
    {
        // DB 스키마 목록 조회
        Task<IEnumerable<string>> GetSchemasAsync();

        // 특정 스키마의 권한 정보 조회
        Task<IEnumerable<object>> GetSchemaPrivilegesAsync(string schemaName);

        // DB 사용자 목록 조회
        Task<IEnumerable<string>> GetUsersAsync();
    }
}
