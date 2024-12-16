using server.Models.Identity;

namespace server.Models
{
    public class Anime : BaseEntity
    {
        public string Title { get; set; } = "No title";
        public string? Description { get; set; }
        public int? Score { get; set; }
        public List<Category> Categories { get; } = [];
        public List<AnimeCategory> AnimeCategories { get; } = [];
        public string? Status { get; set; }
        public string? ImageUrl { get; set; }
        public List<KitsuUser> KitsuUsers { get; } = [];
        public List<AnimeLibraryEntry> AnimeLibraryEntries { get; } = [];
        public int? Year { get; set; }
        public string? CoverImageId { get; set; }
        public int? Episodes { get; set; }
        public string? MediaType { get; set; }
        public List<string> Studios { get; set; } = [];
        public string? EnglishTitle { get; set; }
        public string? JapaneseTitle { get; set; }
        public string? JapaneseTitleRomaji { get; set; }
        public string? Season { get; set; }
        public DateTime? StartAirDate { get; set; }
        public DateTime? EndAirDate { get; set; }
        public string? Rating { get; set; }
        public int? EpisodeLength { get; set; }
    }
}
