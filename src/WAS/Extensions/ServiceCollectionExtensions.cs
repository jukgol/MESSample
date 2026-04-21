using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using WAS.Data;
using WAS.Proxies;
using WAS.Services;
using WAS.Services.Table;

namespace WAS.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddOracleDbServices(this IServiceCollection services, IConfiguration configuration)
        {
            // DB ?°κ²°???µμ‹¬??DbProvider ?±λ΅
            services.AddSingleton<DbProvider>();

            // Scoped ?λΉ„??λ°??Έν„°?μ΄???±λ΅ (AOP λ΅κΉ… ?μ©)
            services.AddScoped<DbConnect>();
            services.AddScoped<IDbConnect>(sp => LoggingProxy<IDbConnect>.Create(sp.GetRequiredService<DbConnect>(), sp.GetRequiredService<ILogger<DbConnect>>()));

            services.AddScoped<TableDataService>();
            services.AddScoped<ITableDataService>(sp => LoggingProxy<ITableDataService>.Create(sp.GetRequiredService<TableDataService>(), sp.GetRequiredService<ILogger<TableDataService>>()));

            services.AddScoped<TableAttributeService>();
            services.AddScoped<ITableAttributeService>(sp => LoggingProxy<ITableAttributeService>.Create(sp.GetRequiredService<TableAttributeService>(), sp.GetRequiredService<ILogger<TableAttributeService>>()));

            services.AddScoped<SchemaService>();
            services.AddScoped<ISchemaService>(sp => LoggingProxy<ISchemaService>.Create(sp.GetRequiredService<SchemaService>(), sp.GetRequiredService<ILogger<SchemaService>>()));


            services.AddScoped<ProcedureRegistration>();
            services.AddScoped<IScriptExecutor, ScriptExecutor>();

            return services;
        }
    }
}

