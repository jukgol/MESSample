using System.Collections.Generic;
using System.Threading.Tasks;

namespace Server.Services
{
    public interface ISchemaService
    {
        Task<List<string>> GetSchemasAsync();
        Task<List<(string Type, string Name)>> GetSchemaPrivilegesAsync(string schemaName);
        Task<string> GetCurrentUserIdAsync();
    }
}
