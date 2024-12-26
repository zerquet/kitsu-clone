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
    }
}
