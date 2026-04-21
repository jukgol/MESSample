using Microsoft.AspNetCore.Mvc;
using WAS.Services.Table;
using System;
using System.Threading.Tasks;

namespace WAS.Controllers.Table
{
    [ApiController]
    [Route("api/[controller]")]
    public class TableAttributeController : ControllerBase
    {
        private readonly ITableAttributeService _tableAttributeService;

        public TableAttributeController(ITableAttributeService tableAttributeService)
        {
            _tableAttributeService = tableAttributeService;
        }

        [HttpGet("scripts")]
        public async Task<IActionResult> GetAttribScripts()
        {
            try
            {
                var scripts = await _tableAttributeService.GetAttribScriptsAsync();
                return Ok(scripts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"?ì„± ?¤í¬ë¦½íŠ¸ ì¡°íšŒ ?¤íŒ¨: {ex.Message}" });
            }
        }

        [HttpPost("execute")]
        public async Task<IActionResult> ExecuteAttribScript([FromBody] ExecuteAttributeRequest request)
        {
            if (string.IsNullOrEmpty(request.FileName) || string.IsNullOrEmpty(request.TableName) || string.IsNullOrEmpty(request.ColumnName))
                return BadRequest(new { Message = "?Œì¼ëª? ?Œì´ë¸”ëª…, ì»¬ëŸ¼ëª…ì? ?„ìˆ˜?…ë‹ˆ??" });

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
                if (result.Success) return Ok(new { Message = result.Message, ExecutedSql = result.ExecutedSql });
                else return StatusCode(500, new { Message = result.Message, ExecutedSql = result.ExecutedSql });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"?ì„± ?¤í¬ë¦½íŠ¸ ?¤í–‰ ì¤??œë²„ ?¤ë¥˜: {ex.Message}" });
            }
        }

        [HttpPost("create-table")]
        public async Task<IActionResult> CreateTable([FromBody] CreateTableRequest request)
        {
            if (string.IsNullOrEmpty(request.TableName) || string.IsNullOrEmpty(request.Sql))
                return BadRequest(new { Message = "?Œì´ë¸”ëª…ê³?SQL ë¬¸ì¥?€ ?„ìˆ˜?…ë‹ˆ??" });

            try
            {
                var result = await _tableAttributeService.CreateTableAsync(request.TableName, request.Sql);
                if (result.Success) return Ok(new { Message = result.Message, ExecutedSql = result.ExecutedSql });
                else return StatusCode(500, new { Message = result.Message, ExecutedSql = result.ExecutedSql });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"?Œì´ë¸??ì„± ì¤??œë²„ ?¤ë¥˜: {ex.Message}" });
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
        
        // ì¶”ê? ?„ë“œ (??ì»¬ëŸ¼ ì¶”ê? ???¬ìš©)
        public string? NewColumnName { get; set; }
        public string? DataType { get; set; }
        public bool IsNotNull { get; set; }
        public bool IsUnique { get; set; }
    }
}

