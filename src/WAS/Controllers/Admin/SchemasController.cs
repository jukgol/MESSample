using Microsoft.AspNetCore.Mvc;
using WAS.Services.Admin;
using WAS.Models.Admin;

namespace WAS.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/[controller]")]
    public class SchemasController : ControllerBase
    {
        private readonly ISchemaService _schemaService;

        public SchemasController(ISchemaService schemaService)
        {
            _schemaService = schemaService;
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<string>), 200)]
        public async Task<ActionResult<IEnumerable<string>>> GetSchemas()
        {
            try
            {
                var schemas = await _schemaService.GetSchemasAsync();
                return Ok(schemas);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ActionResponse { Message = $"스키마 조회 실패: {ex.Message}" });
            }
        }

        [HttpGet("{schemaName}/privileges")]
        [ProducesResponseType(typeof(IEnumerable<SchemaPrivilegeDto>), 200)]
        public async Task<ActionResult<IEnumerable<SchemaPrivilegeDto>>> GetSchemaPrivileges(string schemaName)
        {
            try
            {
                var privileges = await _schemaService.GetSchemaPrivilegesAsync(schemaName);
                // 서비스에서 반환하는 익명 객체를 DTO로 매핑 (필요시 서비스 레이어 수정 검토)
                return Ok(privileges);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ActionResponse { Message = $"스키마 권한 조회 실패: {ex.Message}" });
            }
        }
    }
}
