using server.Data;
using server.Models;
using server.Models.Identity;

namespace server.Services
{
    public interface IAnimeLibraryEntryService
    {
        Task SetStatus(AnimeLibraryEntry record);
    }

    public class AnimeLibraryEntryService(AppDbContext context) : IAnimeLibraryEntryService
    {
        private readonly AppDbContext _context = context;
        public async Task SetStatus(AnimeLibraryEntry record)
        {
            await _context.AnimeLibraryEntries.AddAsync(record);
            await _context.SaveChangesAsync();
        }
    }
}
