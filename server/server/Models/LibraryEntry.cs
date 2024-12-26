using server.Models.Identity;

namespace server.Models
{
    //Join entity class for KitsUser_Anime
    public class LibraryEntry : BaseEntity
    {
        public string KitsuUserId { get; set; } = string.Empty;
        public int AnimeId { get; set; }
        public KitsuUser KitsuUser { get; set; } = null!;
        public Anime Anime { get; set; } = null!;
        public string? WatchStatus { get; set; }
        public int? UserRating { get; set; } //null = no rating. 1-10 regular ratings. 0 not used. 
        public int EpisodesWatched { get; set; }
    }
}
