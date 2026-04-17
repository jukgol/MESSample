using Oracle.ManagedDataAccess.Client;
using System.Data;

namespace Server.Data
{
    public class DbProvider
    {
        private readonly IConfiguration _configuration;

        public DbProvider(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public IDbConnection CreateConnection()
        {
            var connectionString = _configuration.GetConnectionString("OracleDb");
            return new OracleConnection(connectionString);
        }

        public IDbConnection CreateCustomConnection(string host, int port, string serviceName, string userId, string password)
        {
            var connectionString = $"Data Source=(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST={host})(PORT={port}))(CONNECT_DATA=(SERVICE_NAME={serviceName})));User Id={userId};Password={password};";
            return new OracleConnection(connectionString);
        }
    }
}
