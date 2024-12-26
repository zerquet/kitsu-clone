using Microsoft.AspNetCore.Identity;

namespace server.Models.Identity
{
    public class KitsuUser : IdentityUser
    {
        public List<Anime> Animes { get; } = [];
        public List<LibraryEntry> AnimeLibraryEntries { get; } = [];
    }
}
