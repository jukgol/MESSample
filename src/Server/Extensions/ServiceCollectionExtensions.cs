using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Server.Data;
using Server.Proxies;
using Server.Services;

namespace Server.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddProjectServices(this IServiceCollection services)
        {
            // Singleton 서비스 등록
            services.AddSingleton<DbProvider>();
            services.AddSingleton<LocalData>();

            // Scoped 서비스 및 인터페이스 등록
            services.AddScoped<DbConnect>();
            services.AddScoped<IDbConnect>(sp => 
            {
                var target = sp.GetRequiredService<DbConnect>();
                var logger = sp.GetRequiredService<ILogger<DbConnect>>();
                return LoggingProxy<IDbConnect>.Create(target, logger);
            });

            services.AddScoped<ProcedureRegistration>();

            return services;
        }
    }
}
