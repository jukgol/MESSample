using Microsoft.AspNetCore.Mvc;
using WAS.Models.Admin;
using WAS.Services;

namespace WAS.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IScriptExecutor _scriptExecutor;

        public UsersController(IScriptExecutor scriptExecutor)
        {
            _scriptExecutor = scriptExecutor;
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<UserListDto>), 200)]
        public async Task<ActionResult<IEnumerable<UserListDto>>> GetUsers()
        {
            try
            {
                var users = await _scriptExecutor.ExecuteQueryAsync<UserListDto>("User/GET_USER_LIST", null);
                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ActionResponse { Message = $"사용자 목록 조회 실패: {ex.Message}" });
            }
        }

        [HttpGet("roles")]
        [ProducesResponseType(typeof(IEnumerable<RoleDto>), 200)]
        public async Task<ActionResult<IEnumerable<RoleDto>>> GetRoles()
        {
            try
            {
                var roles = await _scriptExecutor.ExecuteQueryAsync<RoleDto>("User/GET_ROLE_LIST", null);
                return Ok(roles);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ActionResponse { Message = $"권한 목록 조회 실패: {ex.Message}" });
            }
        }

        [HttpPost]
        [ProducesResponseType(typeof(ActionResponse), 200)]
        public async Task<ActionResult<ActionResponse>> CreateUser([FromBody] Dictionary<string, object> userData)
        {
            try
            {
                await _scriptExecutor.ExecuteNonQueryAsync("User/CREATE_USER", userData);
                return Ok(new ActionResponse { Message = "사용자가 생성되었습니다." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ActionResponse { Message = $"사용자 생성 실패: {ex.Message}" });
            }
        }

        [HttpPut("{userId}")]
        [ProducesResponseType(typeof(ActionResponse), 200)]
        public async Task<ActionResult<ActionResponse>> UpdateUser(int userId, [FromBody] Dictionary<string, object> userData)
        {
            try
            {
                var parameters = new Dictionary<string, object>(userData);
                parameters["UserId"] = userId;

                await _scriptExecutor.ExecuteNonQueryAsync("User/UPDATE_USER", parameters);
                return Ok(new ActionResponse { Message = "사용자 정보가 수정되었습니다." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ActionResponse { Message = $"사용자 수정 실패: {ex.Message}" });
            }
        }

        [HttpDelete("{userId}")]
        [ProducesResponseType(typeof(ActionResponse), 200)]
        public async Task<ActionResult<ActionResponse>> DeleteUser(int userId)
        {
            try
            {
                var parameters = new Dictionary<string, object> { { "UserId", userId } };
                await _scriptExecutor.ExecuteNonQueryAsync("User/DELETE_USER", parameters);
                return Ok(new ActionResponse { Message = "사용자가 삭제되었습니다." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ActionResponse { Message = $"사용자 삭제 실패: {ex.Message}" });
            }
        }
    }
}
