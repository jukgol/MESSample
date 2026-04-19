using Microsoft.AspNetCore.Mvc;
using Server.Services;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TablesController : ControllerBase
    {
        private readonly ITableService _tableService;

        public TablesController(ITableService tableService)
        {
            _tableService = tableService;
        }

        [HttpGet]
        public async Task<IActionResult> GetTables()
        {
            try
            {
                var tables = await _tableService.GetTablesAsync();
                return Ok(tables);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"테이블 조회 실패: {ex.Message}" });
            }
        }

        [HttpGet("{tableName}/data")]
        public async Task<IActionResult> GetTableData([FromRoute] string tableName)
        {
            if (string.IsNullOrEmpty(tableName)) return BadRequest();

            try
            {
                var dt = await _tableService.GetTableDataAsync(tableName);
                
                var columns = dt.Columns.Cast<DataColumn>().Select(c => c.ColumnName).ToList();
                var data = dt.AsEnumerable().Select(row => 
                    columns.ToDictionary(col => col, col => row[col] == DBNull.Value ? null : row[col])
                ).ToList();

                return Ok(new { Columns = columns, Rows = data });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"데이터 조회 실패: {ex.Message}" });
            }
        }

        [HttpPost("{tableName}/row")]
        public async Task<IActionResult> InsertRow([FromRoute] string tableName, [FromBody] Dictionary<string, object> rowData)
        {
            if (string.IsNullOrEmpty(tableName) || rowData == null || rowData.Count == 0)
                return BadRequest(new { Message = "유효하지 않은 요청 데이터입니다." });

            try
            {
                var result = await _tableService.InsertRowAsync(tableName, rowData);
                if (result.Success) return Ok(new { Message = result.Message });
                else return BadRequest(new { Message = result.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"서버 오류: {ex.Message}" });
            }
        }
    }
}
