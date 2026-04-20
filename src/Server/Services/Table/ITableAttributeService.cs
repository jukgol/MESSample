using System.Collections.Generic;
using System.Threading.Tasks;

namespace Server.Services.Table
{
    public interface ITableAttributeService
    {
        Task<List<string>> GetAttribScriptsAsync();
        Task<(bool Success, string Message, string ExecutedSql)> ExecuteAttribScriptAsync(string fileName, string tableName, string columnName);
    }
}
