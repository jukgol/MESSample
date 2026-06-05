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

        public async Task<IEnumerable<RoleDto>> GetAllRolesAsync()
        {
            var results = await _scriptExecutor.ExecuteQueryAsync<dynamic>(
                "Admin/GET_ALL_ROLES",
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
                    "Admin/UPDATE_ROLE_PERMISSIONS",
                    new
                    {
                        Permissions = permissionsJson,
                        RoleCode = roleCode
                    }
                );

                // 인메모리 캐시 갱신 (실시간 동기화)
                _cache.TryRemove(roleCode, out _);
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}
