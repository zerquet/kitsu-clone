using server.Models.Identity;

namespace server.Models
{
    public class AnimeCategory : BaseEntity
    {
        public int CategoryId { get; set; }
        public int AnimeId { get; set; }
        public Category Category { get; set; } = null!;
        public Anime Anime { get; set; } = null!;
    }
}
