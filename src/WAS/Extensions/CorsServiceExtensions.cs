using Microsoft.Extensions.DependencyInjection;

namespace WAS.Extensions
{
    public static class CorsServiceExtensions
    {
        public static IServiceCollection AddCorsServices(this IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", policy =>
                {
                    policy.AllowAnyOrigin()
                          .WithMethods("GET", "POST", "OPTIONS")
                          .AllowAnyHeader();
                });
            });

            return services;
        }
    }
}
