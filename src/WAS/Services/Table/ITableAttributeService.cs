using System.Collections.Generic;
using System.Threading.Tasks;

namespace WAS.Services.Table
{
    public interface ITableAttributeService
    {
        Task<List<string>> GetAttribScriptsAsync();
        Task<(bool Success, string Message, string ExecutedSql)> ExecuteAttribScriptAsync(
            string fileName, 
            string tableName, 
            string columnName,
            string? newColName = null,
            string? dataType = null,
            bool isNotNull = false,
            bool isUnique = false
        );
        Task<(bool Success, string Message, string ExecutedSql)> CreateTableAsync(string tableName, string sql);
    }
}

