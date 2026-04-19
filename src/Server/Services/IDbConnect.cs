using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace Server.Services
{
    public interface IDbConnect
    {
        Task<bool> TestDefaultConnectionAsync();
        Task<bool> TestCustomConnectionAsync(string host, int port, string serviceName, string userId, string password);
        (bool Success, string? Sysdate, string? Error) GetSysdate();
        Task<List<string>> GetTablesAsync();
        Task<List<string>> GetSchemasAsync();
        Task<List<(string Type, string Name)>> GetSchemaPrivilegesAsync(string schemaName);
        Task<string> GetCurrentUserIdAsync();
        Task<DataTable> GetTableDataAsync(string tableName);
    }
}
