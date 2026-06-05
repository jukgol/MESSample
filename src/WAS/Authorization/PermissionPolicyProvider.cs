using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;
using System.Threading.Tasks;

namespace WAS.Authorization
{
    public class PermissionPolicyProvider : DefaultAuthorizationPolicyProvider
    {
        public PermissionPolicyProvider(IOptions<AuthorizationOptions> options) : base(options)
        {
        }

        public override async Task<AuthorizationPolicy?> GetPolicyAsync(string policyName)
        {
            // 부모 클래스가 가지고 있는 기본 Policy가 먼저 매칭되는지 확인 (예: DefaultPolicy, Authenticated 등)
            var policy = await base.GetPolicyAsync(policyName);
            if (policy != null)
            {
                return policy;
            }

            // 매칭되지 않는 경우, policyName 자체를 하나의 기능 권한(Permission)으로 보고
            // 동적으로 PermissionRequirement를 담은 AuthorizationPolicy를 생성하여 반환합니다.
            return new AuthorizationPolicyBuilder()
                .AddRequirements(new PermissionRequirement(policyName))
                .Build();
        }
    }
}
