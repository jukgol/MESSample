using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using WAS.Proxies;
using WAS.Services.PLC;

namespace WAS.Extensions
{
    public static class ServiceCollectionPlcExtensions
    {
        public static IServiceCollection AddPlcServices(this IServiceCollection services)
        {
            services.AddScoped<PlcProcessMasterService>();
            services.AddScoped<IPlcProcessMasterService>(sp => LoggingProxy<IPlcProcessMasterService>.Create(
                sp.GetRequiredService<PlcProcessMasterService>(),
                sp.GetRequiredService<ILogger<PlcProcessMasterService>>()));

            return services;
        }
    }
}
