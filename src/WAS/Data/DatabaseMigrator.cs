using DbUp;
using DbUp.Oracle; // ??Î∂ÄÎ∂ÑÏù¥ ?µÏã¨?ÖÎãà??
using System.Reflection;
using Microsoft.Extensions.Logging;

namespace WAS.Data
{
    public static class DatabaseMigrator
    {
        public static void Run(IConfiguration configuration, IServiceProvider serviceProvider)
        {
            var connectionString = configuration.GetConnectionString("OracleDb");
            
            if (string.IsNullOrEmpty(connectionString))
            {
                return;
            }

            // DB ?ÖÍ∑∏?àÏù¥???îÏßÑ Íµ¨ÏÑ±
            var upgrader = DeployChanges.To
                .OracleDatabaseWithDefaultDelimiter(connectionString)
                .WithScriptsEmbeddedInAssembly(Assembly.GetExecutingAssembly())
                .LogToConsole()
                .Build();

            var result = upgrader.PerformUpgrade();

            if (!result.Successful)
            {
                // Î°úÍ±∞Î•?Í∞Ä?∏Ï????êÎü¨ Í∏∞Î°ù
                using var scope = serviceProvider.CreateScope();
                var logger = scope.ServiceProvider.GetRequiredService<ILogger<DbProvider>>();
                logger.LogError(result.Error, "Database migration failed.");
            }
        }
    }
}

