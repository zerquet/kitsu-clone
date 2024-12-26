using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;

namespace server.Services
{
    public interface IEpisodeService
    {
        Task<IReadOnlyList<Episode>> GetEpisodesByAnime(int animeId);
        Task AddEpisode(Episode episode);
    }
    public class EpisodeService : IEpisodeService
    {
        private readonly AppDbContext _context;
        public EpisodeService(AppDbContext context)
        {
            _context = context;
        }
        public async Task AddEpisode(Episode episode)
        {
            await _context.Episodes.AddAsync(episode);
            await _context.SaveChangesAsync();
        }
        public async Task<IReadOnlyList<Episode>> GetEpisodesByAnime(int animeId)
        {
            return await _context.Episodes.Where(e => e.AnimeId == animeId).ToListAsync();
        }
    }
}
