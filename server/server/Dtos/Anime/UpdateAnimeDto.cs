namespace server.Dtos.Anime
{
    public class UpdateAnimeDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = "No title";
        public string? Description { get; set; }
        public int? Score { get; set; }
        public List<string> Genres { get; set; } = [];
        public string? Status { get; set; }
        public IFormFile? Image { get; set; }
        public int? Year { get; set; }
        public IFormFile? CoverImage { get; set; }
        public int? Episodes { get; set; }
        public string? MediaType { get; set; }
        public List<string> Studios { get; set; } = [];
    }
}
