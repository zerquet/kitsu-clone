using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;

namespace server.Services
{
    public interface IAnimeService
    {
        Task<Anime?> Get(int id);
        Task<List<Anime>> GetAll();
        Task AddAnime(Anime anime);
        void UpdateAnime(Anime anime);
        Task<List<Anime>> MiniSearch(string term);
        Task<List<Anime>> AdvancedSearch(
            string? term, int? minYear, int? maxYear, int? minEpisodes, int? maxEpisodes, int? minRating, int? maxRating, string[]? mediaType);
    }
    public class AnimeService(AppDbContext context) : IAnimeService
    {
        private readonly AppDbContext _context = context;

        public async Task<Anime?> Get(int id)
        {
            return await _context.Animes.FindAsync(id);
        }
        public async Task<List<Anime>> GetAll()
        {
            return await _context.Animes.ToListAsync();
        }
        public async Task AddAnime(Anime anime)
        {
            await _context.Animes.AddAsync(anime);
            await _context.SaveChangesAsync();
        }

        public void UpdateAnime(Anime anime)
        {
            _context.SaveChangesAsync();
        }

        public async Task<List<Anime>> MiniSearch(string term)
        {
            return await _context.Animes
                .AsNoTracking()
                .Where(a => a.Title.Contains(term))
                .Take(4)
                .Select(a => new Anime
                {
                    Id = a.Id,
                    Title = a.Title,
                    ImageUrl = a.ImageUrl,
                })
                .ToListAsync();
        }

        public async Task<List<Anime>> AdvancedSearch(
            string? term, int? minYear, int? maxYear, int? minEpisodes, int? maxEpisodes, int? minRating, int? maxRating, string[]? mediaType)
        {
            return await _context.Animes
                .AsNoTracking()
                .Where(a => 
                    (term == null || a.Title.Contains(term)) &&
                    ((a.Year >= minYear || minYear == null) && (a.Year <= maxYear || maxYear == null)) &&
                    ((a.Episodes >= minEpisodes || minEpisodes == null) && (a.Episodes <= maxEpisodes || maxEpisodes == null)) && 
                    ((a.Score >= minRating || minRating == null) && (a.Score <= maxRating || maxRating == null)) && 
                    (mediaType == null || mediaType.Contains(a.MediaType))
                    )
                .Select(a => new Anime
                {
                    Id= a.Id,
                    Title = a.Title,
                    ImageUrl= a.ImageUrl,
                })
                .ToListAsync();
        }
    }
}
