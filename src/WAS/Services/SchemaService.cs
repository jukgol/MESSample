using Oracle.ManagedDataAccess.Client;
using System.Data;
using WAS.Data;

namespace WAS.Services
{
    public class SchemaService : ISchemaService
    {
        private readonly IDbConnect _dbConnect;
        private readonly IScriptExecutor _scriptExecutor;

        public SchemaService(IDbConnect dbConnect, IScriptExecutor scriptExecutor)
        {
            _dbConnect = dbConnect;
            _scriptExecutor = scriptExecutor;
        }

        public async Task<IEnumerable<string>> GetSchemasAsync()
        {
            return await _scriptExecutor.ExecuteQueryAsync<string>("GET_SCHEMA_LIST");
        }

        public async Task<IEnumerable<object>> GetSchemaPrivilegesAsync(string schemaName)
        {
            var parameters = new OracleParameter[]
            {
                new OracleParameter("SchemaName", schemaName)
            };
            return await _scriptExecutor.ExecuteQueryAsync<object>("GET_SCHEMA_PRIVS", parameters);
        }

        public async Task<IEnumerable<string>> GetUsersAsync()
        {
            return await _scriptExecutor.ExecuteQueryAsync<string>("GET_DB_USERS");
        }
    }
}
