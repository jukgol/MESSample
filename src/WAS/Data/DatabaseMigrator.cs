using DbUp;
using DbUp.Oracle; // ??遺遺꾩씠 ?듭떖?낅땲??
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

            // DB 留덉씠洹몃젅?댁뀡 ?붿쭊 援ъ꽦
            var upgrader = DeployChanges.To
                .OracleDatabaseWithDefaultDelimiter(connectionString)
                .WithScriptsEmbeddedInAssembly(Assembly.GetExecutingAssembly())
                .LogToConsole()
                .Build();

            var result = upgrader.PerformUpgrade();

            if (!result.Successful)
            {
                // 濡쒓굅瑜?媛?몄? 留덉씠洹몃젅?댁뀡 ?먮윭 湲곕줉
                using var scope = serviceProvider.CreateScope();
                var logger = scope.ServiceProvider.GetRequiredService<ILogger<DbProvider>>();
                logger.LogError(result.Error, "Database migration failed.");
            }
        }
    }
}
