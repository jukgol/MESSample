using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Shared.Models.Admin;

namespace WAS.Services.App
{
    public interface IRolePermissionService
    {
        Task<List<string>> GetPermissionsForRoleAsync(string roleCode);
        void ClearCache();
        Task InitializeCacheAsync();
        Task<IEnumerable<RoleDto>> GetAllRolesAsync();
        Task<bool> UpdateRolePermissionsAsync(string roleCode, List<string> permissions);
    }

    public class RolePermissionService : IRolePermissionService
    {
        private readonly IScriptExecutor _scriptExecutor;
        private static readonly ConcurrentDictionary<string, List<string>> _cache = new ConcurrentDictionary<string, List<string>>();

        public RolePermissionService(IScriptExecutor scriptExecutor)
        {
            _scriptExecutor = scriptExecutor;
        }

        public Task<List<string>> GetPermissionsForRoleAsync(string roleCode)
        {
            if (string.IsNullOrEmpty(roleCode))
            {
                return Task.FromResult(new List<string>());
            }

            // 캐시에 정보가 있으면 즉시 반환
            if (_cache.TryGetValue(roleCode, out var cachedPermissions))
            {
                return Task.FromResult(cachedPermissions);
            }

            // 서버 시작 시 이미 전체 캐싱이 되므로, 캐시에 없다면 권한이 없는 것으로 간주
            return Task.FromResult(new List<string>());
        }

        public async Task InitializeCacheAsync()
        {
            var roles = await GetAllRolesAsync();
            _cache.Clear();
            foreach (var role in roles)
            {
                if (!string.IsNullOrEmpty(role.RoleCode))
                {
                    _cache[role.RoleCode] = role.Permissions;
                }
            }
        }

        public void ClearCache()
        {
            _cache.Clear();
        }

        public async Task<IEnumerable<RoleDto>> GetAllRolesAsync()
        {
            var results = await _scriptExecutor.ExecuteQueryAsync<dynamic>(
                "App/Role/GET_ALL_ROLES",
                null
            );

            var roles = new List<RoleDto>();

            foreach (var row in results)
            {
                var dict = row as IDictionary<string, object>;
                if (dict == null) continue;

                var roleCode = dict.TryGetValue("ROLE_CODE", out var rc) ? rc?.ToString() ?? "" : "";
                var roleName = dict.TryGetValue("ROLE_NAME", out var rn) ? rn?.ToString() ?? "" : "";
                var description = dict.TryGetValue("DESCRIPTION", out var desc) ? desc?.ToString() : null;
                var permissions = new List<string>();

                if (dict.TryGetValue("PERMISSIONS", out var permObj) && permObj != null)
                {
                    try
                    {
                        var parsed = JsonSerializer.Deserialize<List<string>>(permObj.ToString()!);
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

                roles.Add(new RoleDto
                {
                    RoleCode = roleCode,
                    RoleName = roleName,
                    Description = description,
                    Permissions = permissions
                });
            }

            return roles;
        }

        public async Task<bool> UpdateRolePermissionsAsync(string roleCode, List<string> permissions)
        {
            if (string.IsNullOrEmpty(roleCode)) return false;

            var permissionsJson = JsonSerializer.Serialize(permissions);
            
            try
            {
                await _scriptExecutor.ExecuteNonQueryAsync(
                    "App/Role/UPDATE_ROLE_PERMISSIONS",
                    new
                    {
                        Permissions = permissionsJson,
                        RoleCode = roleCode
                    }
                );

                // 인메모리 캐시 갱신 (실시간 동기화)
                _cache[roleCode] = permissions;
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}
