using Microsoft.AspNetCore.Mvc;
using server.Mappers;
using server.Services;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;
        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet("{name}")]
        public async Task<IActionResult> Get(string name) 
        {
            if (string.IsNullOrEmpty(name)) return BadRequest();
            var result = await _categoryService.GetCategoryByName(name);
            if (result == null) return NotFound();
            return Ok(result.ToCategoryDto());
        }

        //Authorize?
        [HttpGet("getAvailable")]
        public async Task<IActionResult> GetAvailableCategories()
        {
            var results = await _categoryService.GetAvailableGenresAsync();
            var model = results.Select(cat => cat.ToCategoryDto()).ToList();
            return Ok(model);
        }
    }
}
