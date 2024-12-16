using server.Dtos.Category;
using server.Models;

namespace server.Mappers
{
    public static class CategoryMapper
    {
        public static CategoryDto ToCategoryDto(this Category category)
        {
            return new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description,
            };
        }
    }
}
