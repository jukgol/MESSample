using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Server.Data;
using Server.Proxies;
using Server.Services;
using Server.Services.Table;

namespace Server.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddOracleDbServices(this IServiceCollection services, IConfiguration configuration)
        {
            // DB 연결의 핵심인 DbProvider 등록
            services.AddSingleton<DbProvider>();

            // Scoped 서비스 및 인터페이스 등록 (AOP 로깅 적용)
            services.AddScoped<DbConnect>();
            services.AddScoped<IDbConnect>(sp => LoggingProxy<IDbConnect>.Create(sp.GetRequiredService<DbConnect>(), sp.GetRequiredService<ILogger<DbConnect>>()));

            services.AddScoped<TableDataService>();
            services.AddScoped<ITableDataService>(sp => LoggingProxy<ITableDataService>.Create(sp.GetRequiredService<TableDataService>(), sp.GetRequiredService<ILogger<TableDataService>>()));

            services.AddScoped<SchemaService>();
            services.AddScoped<ISchemaService>(sp => LoggingProxy<ISchemaService>.Create(sp.GetRequiredService<SchemaService>(), sp.GetRequiredService<ILogger<SchemaService>>()));


            services.AddScoped<ProcedureRegistration>();
            services.AddScoped<IScriptExecutor, ScriptExecutor>();

            return services;
        }
    }
}
