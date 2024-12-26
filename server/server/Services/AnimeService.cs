using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Dtos.Category;
using server.Models;

namespace server.Services
{
    public interface IAnimeService
    {
        Task<Anime?> Get(int id);
        Task<List<Anime>> GetAll();
        Task<IReadOnlyList<Anime>> GetByCategoryId(int categoryId);
        Task AddAnime(Anime anime);
        Task UpdateAnime(Anime anime);
        Task<List<Anime>> MiniSearch(string term);
        Task<List<Anime>> AdvancedSearch(
            string? term, int? minYear, int? maxYear, int? minEpisodes, int? maxEpisodes, int? minRating, int? maxRating, string[]? mediaType);
        Task AddCategories(List<int> categories, int animeId);
        Task UpdateCategories(Anime anime, List<int> newCategories);
    }
    public class AnimeService(AppDbContext context) : IAnimeService
    {
        private readonly AppDbContext _context = context;

        public async Task<Anime?> Get(int id)
        {
            return await _context.Animes.Include(a => a.Categories).Include(a => a.Franchise).SingleOrDefaultAsync(a => a.Id == id);
        }
        public async Task<List<Anime>> GetAll()
        {
            return await _context.Animes.ToListAsync();
        }
        public async Task<IReadOnlyList<Anime>> GetByCategoryId(int categoryId)
        {
            return await _context.AnimeCategories.Where(ac => ac.CategoryId == categoryId)
                .Join(_context.Animes, join => join.AnimeId, anime => anime.Id, (join, anime) => new Anime()
                {
                    Id = anime.Id,
                    Title = anime.Title,
                    ImageUrl = anime.ImageUrl
                })
                .ToListAsync();
        }
        public async Task AddAnime(Anime anime)
        {
            await _context.Animes.AddAsync(anime);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAnime(Anime anime)
        {
             await _context.SaveChangesAsync();
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
                    ((a.EpisodeCount >= minEpisodes || minEpisodes == null) && (a.EpisodeCount <= maxEpisodes || maxEpisodes == null)) && 
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

        public async Task AddCategories(List<int> categories, int animeId)
        {
            var results = await _context.Categories.Where(x => categories.Contains(x.Id)).ToListAsync(); //wtf, use id?
            foreach (var category in results) 
            {
                var newInstance = new AnimeCategory
                {
                    AnimeId = animeId,
                    CategoryId = category.Id,
                };
                await _context.AnimeCategories.AddAsync(newInstance);
            }
            await _context.SaveChangesAsync();
        }

        public async Task UpdateCategories(Anime anime, List<int> newCategories)
        {
            //#Todo: See if this can be optimized. 
            //remove categories from Anime not in update list
            //ToList() may seem redundant, but it's not allowed to iterate the same list we are modifying 
            var currentCateogies = anime.Categories.ToList();
            foreach (var existingCategory in currentCateogies)
            {
                if(!newCategories.Contains(existingCategory.Id))
                {
                     anime.Categories.Remove(existingCategory);
                }
            }

            //add new categories not yet in Anime record
            foreach (var newCategory in newCategories)
            {
                if(!anime.Categories.Select(c => c.Id).ToList().Contains(newCategory))
                {
                    var newInstance = new AnimeCategory
                    {
                        AnimeId = anime.Id,
                        CategoryId = newCategory
                    };
                    await _context.AnimeCategories.AddAsync(newInstance);
                }
            }

            await _context.SaveChangesAsync();
        }
    }
}
