using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace Server.Services
{
    public interface ITableService
    {
        Task<List<string>> GetTablesAsync();
        Task<DataTable> GetTableDataAsync(string tableName);
        Task<(bool Success, string Message)> InsertRowAsync(string tableName, Dictionary<string, object> rowData);
    }
}
