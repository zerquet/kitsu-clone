using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;
using server.Models.Identity;

namespace server.Services
{
    public interface IAnimeLibraryEntryService
    {
        Task SaveChanges();
        Task SetStatus(AnimeLibraryEntry record);
        Task<AnimeLibraryEntry?> GetStatus(string userId, int animeId);
        Task<AnimeLibraryEntry?> GetStatusById(int id);
        Task<List<AnimeLibraryEntry>> GetLibrary(string userId); 
        Task DeleteStatus(string userId, int animeId);
    }

    public class AnimeLibraryEntryService(AppDbContext context) : IAnimeLibraryEntryService
    {
        private readonly AppDbContext _context = context;

        public async Task SaveChanges() => await _context.SaveChangesAsync();
        public async Task SetStatus(AnimeLibraryEntry record)
        {
            await _context.AnimeLibraryEntries.AddAsync(record);
            await _context.SaveChangesAsync();
        }

        public async Task<AnimeLibraryEntry?> GetStatus(string userId, int animeId)
        {
            try
            {
                return await _context.AnimeLibraryEntries.SingleOrDefaultAsync(x => x.KitsuUserId == userId && x.AnimeId == animeId);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<AnimeLibraryEntry?> GetStatusById(int id) => await _context.AnimeLibraryEntries.FindAsync(id);

        public async Task<List<AnimeLibraryEntry>> GetLibrary(string userId) => await _context.AnimeLibraryEntries
            .Where(x => x.KitsuUserId == userId).ToListAsync();

        public async Task DeleteStatus(string userId, int animeId)
        {
            try
            {
                var found = await _context.AnimeLibraryEntries.SingleOrDefaultAsync(x => x.KitsuUserId == userId && x.AnimeId == animeId);
                if(found != null)
                {
                    _context.AnimeLibraryEntries.Remove(found);
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
