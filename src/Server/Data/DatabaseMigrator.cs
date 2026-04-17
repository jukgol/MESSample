using DbUp;
using DbUp.Oracle; // 이 부분이 핵심입니다.
using System.Reflection;
using Microsoft.Extensions.Logging;

namespace Server.Data
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

            // DB 업그레이드 엔진 구성
            var upgrader = DeployChanges.To
                .OracleDatabaseWithDefaultDelimiter(connectionString)
                .WithScriptsEmbeddedInAssembly(Assembly.GetExecutingAssembly())
                .LogToConsole()
                .Build();

            var result = upgrader.PerformUpgrade();

            if (!result.Successful)
            {
                // 로거를 가져와서 에러 기록
                using var scope = serviceProvider.CreateScope();
                var logger = scope.ServiceProvider.GetRequiredService<ILogger<DbProvider>>();
                logger.LogError(result.Error, "Database migration failed.");
            }
        }
    }
}
