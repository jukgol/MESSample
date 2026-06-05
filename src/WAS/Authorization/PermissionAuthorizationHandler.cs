using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Threading.Tasks;
using WAS.Services.App;

namespace WAS.Authorization
{
    public class PermissionAuthorizationHandler : AuthorizationHandler<PermissionRequirement>
    {
        private readonly IRolePermissionService _rolePermissionService;

        public PermissionAuthorizationHandler(IRolePermissionService rolePermissionService)
        {
            _rolePermissionService = rolePermissionService;
        }

        protected override async Task HandleRequirementAsync(
            AuthorizationHandlerContext context, 
            PermissionRequirement requirement)
        {
            if (context.User == null)
            {
                return;
            }

            // 1. 유저의 역할(Role) 클레임 추출
            var roleCode = context.User.FindFirst(ClaimTypes.Role)?.Value;
            if (string.IsNullOrEmpty(roleCode))
            {
                return;
            }

            // 2. ADMIN 프리패스 규칙
            if (roleCode == "ADMIN")
            {
                context.Succeed(requirement);
                return;
            }

            // 3. 역할별 권한 매핑 조회
            var permissions = await _rolePermissionService.GetPermissionsForRoleAsync(roleCode);

            // 4. 와일드카드 권한("*")이 있거나, 요구하는 권한이 리스트에 포함되어 있다면 통과
            if (permissions.Contains("*") || permissions.Contains(requirement.Permission))
            {
                context.Succeed(requirement);
            }
        }
    }
}
