namespace server.Dtos.Episode
{
    public class EpisodeDto
    {
        public int AnimeId { get; set; }
        public int? Number { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public DateOnly? AirDate { get; set; }
        public string? JapaneseTitle { get; set; }
    }
}
