namespace server.Dtos.Anime
{
    public class UpdateAnimeDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = "No title";
        public string? Description { get; set; }
        public int? Score { get; set; }
        public List<int> Categories { get; set; } = [];
        public string? ReleaseStatus { get; set; }
        public IFormFile? Image { get; set; }
        public int? Year { get; set; }
        public IFormFile? CoverImage { get; set; }
        public int? EpisodeCount { get; set; }
        public string? MediaType { get; set; }
        public List<string> Studios { get; set; } = [];
        public string? EnglishTitle { get; set; }
        public string? JapaneseTitle { get; set; }
        public string? JapaneseTitleRomaji { get; set; }
        public string? Season { get; set; }
        public DateOnly? StartAirDate { get; set; }
        public DateOnly? EndAirDate { get; set; }
        public string? TvRating { get; set; }
        public int? EpisodeLength { get; set; }
        public int? FranchiseId { get; set; }
    }
}
