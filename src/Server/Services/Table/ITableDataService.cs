using Server.Models;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace Server.Services.Table
{
    public interface ITableDataService
    {
        Task<List<string>> GetTablesAsync();
        Task<DataTable> GetTableDataAsync(string tableName);
        Task<List<ColumnMetadata>> GetTableMetadataAsync(string tableName);
        Task<(bool Success, string Message)> InsertRowAsync(string tableName, Dictionary<string, object> rowData);
    }
}
