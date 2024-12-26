using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;

namespace server.Services
{
    public interface ICategoryService
    {
        Task<Category?> GetCategoryByName(string name);
        Task<IReadOnlyList<Category>> GetAll();
    }
    public class CategoryService : ICategoryService
    {
        private readonly AppDbContext _context;
        public CategoryService(AppDbContext context)
        {
            _context = context;
        }
        public async Task<IReadOnlyList<Category>> GetAll()
        {
            return await _context.Categories.Select(x => new Category { Id = x.Id, Name = x.Name }).ToListAsync();
        }
        public async Task<Category?> GetCategoryByName(string name)
        {
            return await _context.Categories.SingleOrDefaultAsync(c => c.Name == name);
        }
    }
}
