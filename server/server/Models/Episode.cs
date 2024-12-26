namespace server.Models
{
    public class Episode : BaseEntity
    {
        //An Episode must belong to an Anime. It can't exist alone.
        public int AnimeId { get; set; }
        public Anime Anime { get; set; } = null!;
        public int? Number { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public DateOnly? AirDate { get; set; }
        public string? JapaneseTitle { get; set; }
    }
}
