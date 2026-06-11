namespace WAS.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddProjectServices(this IServiceCollection services, IConfiguration configuration)
        {
            // DB 및 어드민 관리 서비스 등록
            services.AddAdminServices(configuration);

            // 비즈니스 앱 서비스 등록
            services.AddAppServices();
            services.AddPlcServices();

            // CORS 정책 등록
            services.AddCorsServices();

            // Identity JWT 인증 등록
            services.AddIdentityServices(configuration);

            return services;
        }
    }
}
