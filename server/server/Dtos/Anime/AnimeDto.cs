using server.Dtos.Category;

namespace server.Dtos.Anime
{
    public class AnimeDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = "No title";
        public string? Description { get; set; }
        public int? Score { get; set; }
        public List<CategoryDto> Categories { get; set; } = [];
        public string? Status { get; set; }
        public string? ImageBase64 { get; set; }
        public int? Year { get; set; }
        public string? CoverImageBase64 { get; set; }
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
