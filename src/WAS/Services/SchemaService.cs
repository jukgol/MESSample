using WAS.Attributes;
using WAS.Data;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace WAS.Services
{
    public class SchemaService : ISchemaService
    {
        private readonly DbProvider _db;

        public SchemaService(DbProvider db)
        {
            _db = db;
        }

        [Log("DB ?§ÌÇ§Îß?Î™©Î°ù Ï°∞Ìöå")]
        public async Task<List<string>> GetSchemasAsync()
        {
            var schemas = new List<string>();
            using var connection = _db.CreateConnection();
            if (connection is System.Data.Common.DbConnection dbConn) await dbConn.OpenAsync();
            else connection.Open();

            string queryPath = Path.Combine(AppContext.BaseDirectory, "Data", "Scripts", "Queries", "GET_SCHEMA_LIST.sql");
            string sqlText = File.Exists(queryPath) ? await File.ReadAllTextAsync(queryPath) : "SELECT USERNAME FROM ALL_USERS ORDER BY USERNAME";

            using var command = connection.CreateCommand();
            command.CommandText = sqlText;

            using var reader = command.ExecuteReader();
            while (reader.Read()) schemas.Add(reader.GetString(0));
            return schemas;
        }

        [Log("?§ÌÇ§Îß?Í∂åÌïú Ï°∞Ìöå")]
        public async Task<List<(string Type, string Name)>> GetSchemaPrivilegesAsync(string schemaName)
        {
            var privs = new List<(string Type, string Name)>();
            using var connection = _db.CreateConnection();
            if (connection is System.Data.Common.DbConnection dbConn) await dbConn.OpenAsync();
            else connection.Open();

            string queryPath = Path.Combine(AppContext.BaseDirectory, "Data", "Scripts", "Queries", "GET_SCHEMA_PRIVS.sql");
            string sqlText = File.Exists(queryPath) ? await File.ReadAllTextAsync(queryPath) : "";

            using var command = connection.CreateCommand();
            command.CommandText = sqlText;
            
            var parameter = command.CreateParameter();
            parameter.ParameterName = "schemaName";
            parameter.Value = schemaName.ToUpper();
            command.Parameters.Add(parameter);

            using var reader = command.ExecuteReader();
            while (reader.Read()) privs.Add((reader.GetString(0), reader.GetString(1)));
            return privs;
        }

        [Log("?ÑÏû¨ DB ?†Ï? Ï°∞Ìöå")]
        public async Task<string> GetCurrentUserIdAsync()
        {
            using var connection = _db.CreateConnection();
            if (connection is System.Data.Common.DbConnection dbConn) await dbConn.OpenAsync();
            else connection.Open();

            using var command = connection.CreateCommand();
            command.CommandText = "SELECT USER FROM DUAL";
            var result = command.ExecuteScalar();
            return result?.ToString() ?? "Unknown";
        }
    }
}

