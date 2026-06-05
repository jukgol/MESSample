using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shared.Models.Admin;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using WAS.Services.App;

namespace WAS.Controllers.App
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "ADMIN")] // 최고 관리자만 접근 및 조작 가능
    public class RoleController : ControllerBase
    {
        private readonly IRolePermissionService _rolePermissionService;

        public RoleController(IRolePermissionService rolePermissionService)
        {
            _rolePermissionService = rolePermissionService;
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<RoleDto>), 200)]
        [ProducesResponseType(401)]
        public async Task<ActionResult<IEnumerable<RoleDto>>> GetRoles()
        {
            try
            {
                var roles = await _rolePermissionService.GetAllRolesAsync();
                return Ok(roles);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"역할 목록 조회 중 오류 발생: {ex.Message}" });
            }
        }

        [HttpPut("{roleCode}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> UpdateRolePermissions(string roleCode, [FromBody] RolePermissionsUpdateDto dto)
        {
            try
            {
                if (dto == null)
                {
                    return BadRequest(new { Message = "요청 본문이 올바르지 않습니다." });
                }

                var success = await _rolePermissionService.UpdateRolePermissionsAsync(roleCode, dto.Permissions);
                if (success)
                {
                    return Ok(new { Message = $"{roleCode} 역할의 권한 매핑이 성공적으로 수정되었으며, 실시간으로 반영되었습니다." });
                }

                return BadRequest(new { Message = "권한 정보 변경을 완료하지 못했습니다. 직책 코드가 올바르지 않거나 변경 사항이 없을 수 있습니다." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"권한 매핑 수정 중 오류 발생: {ex.Message}" });
            }
        }
    }
}
