using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WAS.Services.App;

namespace WAS.Controllers.App
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // 모든 API 호출 시 JWT 토큰 필요
    public class ItemController : ControllerBase
    {
        private readonly IItemService _itemService;

        public ItemController(IItemService itemService)
        {
            _itemService = itemService;
        }

        [HttpGet]
        public async Task<IActionResult> GetItems()
        {
            try
            {
                var items = await _itemService.GetItemsAsync();
                return Ok(items);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"품목 조회 중 오류 발생: {ex.Message}" });
            }
        }
    }
}
