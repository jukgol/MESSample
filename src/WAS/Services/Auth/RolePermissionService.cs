using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace WAS.Services.Auth
{
    public interface IRolePermissionService
    {
        Task<List<string>> GetPermissionsForRoleAsync(string roleCode);
        void ClearCache();
    }

    public class RolePermissionService : IRolePermissionService
    {
        private readonly IScriptExecutor _scriptExecutor;
        private readonly ConcurrentDictionary<string, List<string>> _cache = new ConcurrentDictionary<string, List<string>>();

        public RolePermissionService(IScriptExecutor scriptExecutor)
        {
            _scriptExecutor = scriptExecutor;
        }

        public async Task<List<string>> GetPermissionsForRoleAsync(string roleCode)
        {
            if (string.IsNullOrEmpty(roleCode))
            {
                return new List<string>();
            }

            // 캐시에 정보가 있으면 즉시 반환
            if (_cache.TryGetValue(roleCode, out var cachedPermissions))
            {
                return cachedPermissions;
            }

            // DB에서 해당 역할의 PERMISSIONS 컬럼 조회
            var roles = await _scriptExecutor.ExecuteQueryAsync<dynamic>(
                "SELECT ROLE_CODE, PERMISSIONS FROM USER_ROLE WHERE ROLE_CODE = :roleCode",
                new { roleCode }
            );

            var role = roles.FirstOrDefault();
            var permissions = new List<string>();

            if (role != null)
            {
                var roleDict = role as IDictionary<string, object>;
                if (roleDict != null && roleDict.TryGetValue("PERMISSIONS", out var permissionsObj) && permissionsObj != null)
                {
                    string permissionsJson = permissionsObj.ToString()!;
                    try
                    {
                        var parsed = JsonSerializer.Deserialize<List<string>>(permissionsJson);
                        if (parsed != null)
                        {
                            permissions = parsed;
                        }
                    }
                    catch
                    {
                        // JSON 파싱 실패 시 빈 리스트
                    }
                }
            }

            // 캐시에 저장
            _cache[roleCode] = permissions;

            return permissions;
        }

        public void ClearCache()
        {
            _cache.Clear();
        }
    }
}
