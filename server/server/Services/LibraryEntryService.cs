using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;
using server.Models.Identity;

namespace server.Services
{
    public interface IAnimeLibraryEntryService
    {
        Task SaveChanges();
        Task SetStatus(LibraryEntry record);
        Task<LibraryEntry?> GetStatus(string userId, int animeId);
        Task<LibraryEntry?> GetStatusById(int id);
        Task<List<LibraryEntry>> GetLibrary(string userId); 
        Task DeleteStatus(string userId, int animeId);
        Task AddToFavorites(FavoriteAnime anime);
        Task<IReadOnlyCollection<Anime>> GetFavoriteAnimes(string userId);
        Task<FavoriteAnime?> GetFavoriteAnime(string userId, int animeId);
        Task DeleteFavoriteAnime(string userId, int animeId);
    }

    public class LibraryEntryService(AppDbContext context) : IAnimeLibraryEntryService
    {
        private readonly AppDbContext _context = context;

        public async Task SaveChanges() => await _context.SaveChangesAsync();
        public async Task SetStatus(LibraryEntry record)
        {
            await _context.LibraryEntries.AddAsync(record);
            await _context.SaveChangesAsync();
        }

        public async Task<LibraryEntry?> GetStatus(string userId, int animeId)
        {
            try
            {
                return await _context.LibraryEntries.SingleOrDefaultAsync(x => x.KitsuUserId == userId && x.AnimeId == animeId);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<LibraryEntry?> GetStatusById(int id) => await _context.LibraryEntries.FindAsync(id);

        public async Task<List<LibraryEntry>> GetLibrary(string userId) => await _context.LibraryEntries
            .Where(x => x.KitsuUserId == userId).ToListAsync();

        public async Task DeleteStatus(string userId, int animeId)
        {
            try
            {
                var found = await _context.LibraryEntries.SingleOrDefaultAsync(x => x.KitsuUserId == userId && x.AnimeId == animeId);
                if(found != null)
                {
                    _context.LibraryEntries.Remove(found);
                    await _context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task AddToFavorites(FavoriteAnime anime) {
            await _context.FavoriteAnimes.AddAsync(anime);
            await _context.SaveChangesAsync();
        }

        public async Task<IReadOnlyCollection<Anime>> GetFavoriteAnimes(string userId) {
            return await _context.FavoriteAnimes
                .Where(fa => fa.KitsuUserId == userId)
                .Include(fa => fa.Anime)
                .Select(fa => new Anime {
                    Id = fa.AnimeId,
                    Title = fa.Anime.Title,
                    ImageUrl = fa.Anime.ImageUrl
                })
                .ToListAsync(); //what about a join?
        }

        public async Task<FavoriteAnime?> GetFavoriteAnime(string userId, int animeId)
        {
            try
            {
                return await _context.FavoriteAnimes.SingleOrDefaultAsync(x => x.KitsuUserId == userId && x.AnimeId == animeId);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task DeleteFavoriteAnime(string userId, int animeId) {
            try
            {
                var found = await _context.FavoriteAnimes.SingleOrDefaultAsync(x => x.KitsuUserId == userId && x.AnimeId == animeId);
                if(found != null)
                {
                    _context.FavoriteAnimes.Remove(found);
                    await _context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
