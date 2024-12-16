using server.Models.Identity;

namespace server.Models
{
    //Join entity class for KitsUser_Anime
    public class AnimeLibraryEntry : BaseEntity
    {
        public string KitsuUserId { get; set; } = string.Empty;
        public int AnimeId { get; set; }
        public KitsuUser KitsuUser { get; set; } = null!;
        public Anime Anime { get; set; } = null!;
        public string? Status { get; set; }
        public int? Rating { get; set; } //null = no rating. 1-10 regular ratings. 0 not used. 
        public int EpisodesSeen { get; set; }
    }
}
