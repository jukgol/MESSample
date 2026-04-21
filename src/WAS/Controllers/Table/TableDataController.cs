using Microsoft.AspNetCore.Mvc;
using WAS.Services.Table;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace WAS.Controllers.Table
{
    [ApiController]
    [Route("api/[controller]")]
    public class TableDataController : ControllerBase
    {
        private readonly ITableDataService _tableDataService;

        public TableDataController(ITableDataService tableDataService)
        {
            _tableDataService = tableDataService;
        }

        [HttpGet]
        public async Task<IActionResult> GetTables()
        {
            try
            {
                var tables = await _tableDataService.GetTablesAsync();
                return Ok(tables);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"?åÏù¥Î∏?Ï°∞Ìöå ?§Ìå®: {ex.Message}" });
            }
        }

        [HttpGet("{tableName}/data")]
        public async Task<IActionResult> GetTableData([FromRoute] string tableName)
        {
            if (string.IsNullOrEmpty(tableName)) return BadRequest();

            try
            {
                var dtTask = _tableDataService.GetTableDataAsync(tableName);
                var metaTask = _tableDataService.GetTableMetadataAsync(tableName);
                
                await Task.WhenAll(dtTask, metaTask);
                
                var dt = dtTask.Result;
                var meta = metaTask.Result;

                var columns = dt.Columns.Cast<DataColumn>().Select(c => c.ColumnName).ToList();
                var data = dt.AsEnumerable().Select(row => 
                    columns.ToDictionary(col => col, col => row[col] == DBNull.Value ? null : row[col])
                ).ToList();

                return Ok(new { 
                    columns = columns, 
                    rows = data, 
                    metadata = meta 
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"?∞Ïù¥??Ï°∞Ìöå ?§Ìå®: {ex.Message}" });
            }
        }

        [HttpPost("{tableName}/row")]
        public async Task<IActionResult> InsertRow([FromRoute] string tableName, [FromBody] Dictionary<string, object> rowData)
        {
            if (string.IsNullOrEmpty(tableName) || rowData == null || rowData.Count == 0)
                return BadRequest(new { Message = "?†Ìö®?òÏ? ?äÏ? ?îÏ≤≠ ?∞Ïù¥?∞ÏûÖ?àÎã§." });

            try
            {
                var result = await _tableDataService.InsertRowAsync(tableName, rowData);
                if (result.Success) return Ok(new { Message = result.Message });
                else return BadRequest(new { Message = result.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"?úÎ≤Ñ ?§Î•ò: {ex.Message}" });
            }
        }
    }
}

