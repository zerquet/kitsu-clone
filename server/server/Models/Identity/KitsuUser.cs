using Microsoft.AspNetCore.Identity;

namespace server.Models.Identity
{
    public class KitsuUser : IdentityUser
    {
        public List<Anime> Animes { get; } = [];
        public List<LibraryEntry> AnimeLibraryEntries { get; } = [];
        public string? Location { get; set; }
        public string? Bio { get; set; }
        public DateOnly? Birthday { get; set; }
        public string? Gender { get; set; }
        public List<Anime> FavoriteAnimes { get; } = [];
        public List<FavoriteAnime> FavoriteAnimeEntries { get; } = [];
    }
}
