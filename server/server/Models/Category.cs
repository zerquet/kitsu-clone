namespace server.Models
{
    public class Category : BaseEntity
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public List<Anime> Animes { get; } = [];
        public List<AnimeCategory> AnimeCategories { get; } = [];
    }
}
