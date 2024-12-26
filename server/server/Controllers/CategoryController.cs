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
        public async Task<IActionResult> Get([FromRoute] string name) 
        {
            if (string.IsNullOrEmpty(name)) return BadRequest();
            var category = await _categoryService.GetCategoryByName(name);
            if (category == null) return NotFound();
            return Ok(category.ToCategoryDto());
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            var categories = await _categoryService.GetAll();
            var categoriesDto = categories.Select(c => c.ToCategoryDto()).ToList();
            return Ok(categoriesDto);
        }
    }
}
