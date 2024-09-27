using server.Models.Identity;

namespace server.Models
{
    public class Anime : BaseEntity
    {
        public string Title { get; set; } = "No title";
        public string? Description { get; set; }
        public int? Score { get; set; }
        public List<string> Genres { get; set; } = [];
        public List<string> Status { get; set; } = [];
        public string? ImageUrl { get; set; }
        public List<KitsuUser> KitsuUsers { get; } = [];
        public List<AnimeLibraryEntry> AnimeLibraryEntries { get; } = [];
    }
}
