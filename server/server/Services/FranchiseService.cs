using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;

namespace server.Services
{
    public interface IFranchiseService
    {
        Task AddFranchise(Franchise franchise);
        Task<IReadOnlyCollection<Franchise>> GetFranchisesByKeyword(string keyword);
        Task<IReadOnlyCollection<Franchise>> GetAll();
    }
    public class FranchiseService : IFranchiseService
    {
        private readonly AppDbContext _context;
        public FranchiseService(AppDbContext context)
        {
            _context = context;
        }
        public async Task AddFranchise(Franchise franchise)
        {
            await _context.Franchises.AddAsync(franchise);
            await _context.SaveChangesAsync();
        }
        public async Task<IReadOnlyCollection<Franchise>> GetFranchisesByKeyword(string keyword)
        {
            return await _context.Franchises.AsNoTracking().Where(f => f.Name.Contains(keyword)).Take(4).ToListAsync();
        }
        public async Task<IReadOnlyCollection<Franchise>> GetAll()
        {
            return await _context.Franchises.AsNoTracking().ToListAsync();
        }
    }
}
