using WAS.Services.App;
using WAS.Proxies;

namespace WAS.Extensions
{
    public static class ServiceCollectionAppExtensions
    {
        public static IServiceCollection AddAppServices(this IServiceCollection services)
        {
            // App 관련 서비스 등록
            services.AddScoped<ItemService>();
            services.AddScoped<IItemService>(sp => LoggingProxy<IItemService>.Create(sp.GetRequiredService<ItemService>(), sp.GetRequiredService<ILogger<ItemService>>()));

            services.AddScoped<LotService>();
            services.AddScoped<ILotService>(sp => LoggingProxy<ILotService>.Create(sp.GetRequiredService<LotService>(), sp.GetRequiredService<ILogger<LotService>>()));

            services.AddScoped<ProcessStepService>();
            services.AddScoped<IProcessStepService>(sp => LoggingProxy<IProcessStepService>.Create(sp.GetRequiredService<ProcessStepService>(), sp.GetRequiredService<ILogger<ProcessStepService>>()));

            services.AddScoped<ProcessMasterService>();
            services.AddScoped<IProcessMasterService>(sp => LoggingProxy<IProcessMasterService>.Create(sp.GetRequiredService<ProcessMasterService>(), sp.GetRequiredService<ILogger<ProcessMasterService>>()));

            services.AddScoped<BomService>();
            services.AddScoped<IBomService>(sp => LoggingProxy<IBomService>.Create(sp.GetRequiredService<BomService>(), sp.GetRequiredService<ILogger<BomService>>()));

            services.AddScoped<MrpService>();
            services.AddScoped<IMrpService>(sp => LoggingProxy<IMrpService>.Create(sp.GetRequiredService<MrpService>(), sp.GetRequiredService<ILogger<MrpService>>()));

            services.AddScoped<WorkOrderService>();
            services.AddScoped<IWorkOrderService>(sp => LoggingProxy<IWorkOrderService>.Create(sp.GetRequiredService<WorkOrderService>(), sp.GetRequiredService<ILogger<WorkOrderService>>()));

            services.AddSingleton<IProcessMonitoringStateStore, ProcessMonitoringStateStore>();
            services.AddScoped<ProcessMonitoringService>();
            services.AddScoped<IProcessMonitoringService>(sp => LoggingProxy<IProcessMonitoringService>.Create(sp.GetRequiredService<ProcessMonitoringService>(), sp.GetRequiredService<ILogger<ProcessMonitoringService>>()));

            services.AddScoped<ItemTypeService>();
            services.AddScoped<IItemTypeService>(sp => LoggingProxy<IItemTypeService>.Create(sp.GetRequiredService<ItemTypeService>(), sp.GetRequiredService<ILogger<ItemTypeService>>()));

            // Role / 권한 매핑 관련 서비스 등록
            services.AddScoped<RolePermissionService>();
            services.AddScoped<IRolePermissionService>(sp => LoggingProxy<IRolePermissionService>.Create(sp.GetRequiredService<RolePermissionService>(), sp.GetRequiredService<ILogger<RolePermissionService>>()));

            return services;
        }
    }
}
