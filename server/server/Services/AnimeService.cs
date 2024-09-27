using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;

namespace server.Services
{
    public interface IAnimeService
    {
        Task<List<Anime>> GetAll();
        Task AddAnime(Anime anime);
    }
    public class AnimeService(AppDbContext context) : IAnimeService
    {
        private readonly AppDbContext _context = context;
        public async Task<List<Anime>> GetAll()
        {
            return await _context.Animes.ToListAsync();
        }
        public async Task AddAnime(Anime anime)
        {
            await _context.Animes.AddAsync(anime);
            await _context.SaveChangesAsync();
        }
    }
}
