using Microsoft.AspNetCore.Mvc;
using Server.Services;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SchemasController : ControllerBase
    {
        private readonly ISchemaService _schemaService;

        public SchemasController(ISchemaService schemaService)
        {
            _schemaService = schemaService;
        }

        [HttpGet]
        public async Task<IActionResult> GetSchemas()
        {
            try
            {
                var schemas = await _schemaService.GetSchemasAsync();
                return Ok(schemas);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"스키마 조회 실패: {ex.Message}" });
            }
        }

        [HttpGet("{schemaName}/privileges")]
        public async Task<IActionResult> GetSchemaPrivileges([FromRoute] string schemaName)
        {
            if (string.IsNullOrEmpty(schemaName)) return BadRequest();
            
            try
            {
                var privs = await _schemaService.GetSchemaPrivilegesAsync(schemaName);
                var result = privs.Select(p => new { p.Type, p.Name });
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"권한 조회 실패: {ex.Message}" });
            }
        }
    }
}
