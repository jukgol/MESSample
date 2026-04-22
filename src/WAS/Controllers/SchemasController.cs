using Microsoft.AspNetCore.Mvc;
using WAS.Services;

namespace WAS.Controllers
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
        public async Task<IActionResult> GetSchemaPrivileges(string schemaName)
        {
            try
            {
                var privileges = await _schemaService.GetSchemaPrivilegesAsync(schemaName);
                return Ok(privileges);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"스키마 권한 조회 실패: {ex.Message}" });
            }
        }
    }
}
