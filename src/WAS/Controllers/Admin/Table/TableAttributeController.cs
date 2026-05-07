using Microsoft.AspNetCore.Mvc;
using WAS.Services.Admin.Table;
using System;
using System.Threading.Tasks;
using Shared.Models.Admin;

namespace WAS.Controllers.Admin.Table
{
    [ApiController]
    [Route("api/admin/[controller]")]
    public class TableAttributeController : ControllerBase
    {
        private readonly ITableAttributeService _tableAttributeService;

        public TableAttributeController(ITableAttributeService tableAttributeService)
        {
            _tableAttributeService = tableAttributeService;
        }

        [HttpGet("scripts")]
        [ProducesResponseType(typeof(IEnumerable<string>), 200)]
        public async Task<ActionResult<IEnumerable<string>>> GetAttribScripts()
        {
            try
            {
                var scripts = await _tableAttributeService.GetAttribScriptsAsync();
                return Ok(scripts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ActionResponse { Message = $"속성 스크립트 조회 실패: {ex.Message}" });
            }
        }

        [HttpPost("execute")]
        [ProducesResponseType(typeof(ActionResponse), 200)]
        public async Task<ActionResult<ActionResponse>> ExecuteAttribScript([FromBody] ExecuteAttributeRequest request)
        {
            if (string.IsNullOrEmpty(request.FileName) || string.IsNullOrEmpty(request.TableName) || string.IsNullOrEmpty(request.ColumnName))
                return BadRequest(new ActionResponse { Message = "파일명, 테이블명, 컬럼명은 필수입니다." });

            try
            {
                var result = await _tableAttributeService.ExecuteAttribScriptAsync(
                    request.FileName, 
                    request.TableName, 
                    request.ColumnName,
                    request.NewColumnName,
                    request.DataType,
                    request.IsNotNull,
                    request.IsUnique
                );
                
                var response = new ActionResponse { Message = result.Message, ExecutedSql = result.ExecutedSql };
                if (result.Success) return Ok(response);
                else return StatusCode(500, response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ActionResponse { Message = $"속성 스크립트 실행 중 서버 오류: {ex.Message}" });
            }
        }

        [HttpPost("create-table")]
        [ProducesResponseType(typeof(ActionResponse), 200)]
        public async Task<ActionResult<ActionResponse>> CreateTable([FromBody] CreateTableRequest request)
        {
            if (string.IsNullOrEmpty(request.TableName) || string.IsNullOrEmpty(request.Sql))
                return BadRequest(new ActionResponse { Message = "테이블명과 SQL 문장은 필수입니다." });

            try
            {
                var result = await _tableAttributeService.CreateTableAsync(request.TableName, request.Sql);
                var response = new ActionResponse { Message = result.Message, ExecutedSql = result.ExecutedSql };
                if (result.Success) return Ok(response);
                else return StatusCode(500, response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ActionResponse { Message = $"테이블 생성 중 서버 오류: {ex.Message}" });
            }
        }
    }

    public class CreateTableRequest
    {
        public string TableName { get; set; } = string.Empty;
        public string Sql { get; set; } = string.Empty;
    }

    public class ExecuteAttributeRequest
    {
        public string FileName { get; set; } = string.Empty;
        public string TableName { get; set; } = string.Empty;
        public string ColumnName { get; set; } = string.Empty;
        
        // 추가 필드 (새 컬럼 추가 시 사용)
        public string? NewColumnName { get; set; }
        public string? DataType { get; set; }
        public bool IsNotNull { get; set; }
        public bool IsUnique { get; set; }
    }
}
