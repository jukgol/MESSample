using WAS.Services;
using WAS.Services.Admin;
using WAS.Services.Admin.Table;
using WAS.Services.Auth;
using WAS.Data;
using WAS.Proxies;

namespace WAS.Extensions
{
    public static class ServiceCollectionAdminExtensions
    {
        public static IServiceCollection AddAdminServices(this IServiceCollection services, IConfiguration configuration)
        {
            // DB 연결의 핵심인 DbProvider 등록
            services.AddSingleton<DbProvider>();

            // Scoped 서비스 및 인터페이스 등록 (AOP 로깅 적용)
            services.AddScoped<DbConnect>();
            services.AddScoped<IDbConnect>(sp => LoggingProxy<IDbConnect>.Create(sp.GetRequiredService<DbConnect>(), sp.GetRequiredService<ILogger<DbConnect>>()));

            services.AddScoped<TableDataService>();
            services.AddScoped<ITableDataService>(sp => LoggingProxy<ITableDataService>.Create(sp.GetRequiredService<TableDataService>(), sp.GetRequiredService<ILogger<TableDataService>>()));

            services.AddScoped<TableAttributeService>();
            services.AddScoped<ITableAttributeService>(sp => LoggingProxy<ITableAttributeService>.Create(sp.GetRequiredService<TableAttributeService>(), sp.GetRequiredService<ILogger<TableAttributeService>>()));

            services.AddScoped<SchemaService>();
            services.AddScoped<ISchemaService>(sp => LoggingProxy<ISchemaService>.Create(sp.GetRequiredService<SchemaService>(), sp.GetRequiredService<ILogger<SchemaService>>()));

            services.AddScoped<ScriptExecutor>();
            services.AddScoped<IScriptExecutor>(sp => LoggingProxy<IScriptExecutor>.Create(sp.GetRequiredService<ScriptExecutor>(), sp.GetRequiredService<ILogger<ScriptExecutor>>()));

            services.AddScoped<AuthService>();
            services.AddScoped<IAuthService>(sp => LoggingProxy<IAuthService>.Create(sp.GetRequiredService<AuthService>(), sp.GetRequiredService<ILogger<AuthService>>()));

            services.AddScoped<ProcedureRegistration>();

            return services;
        }
    }
}
