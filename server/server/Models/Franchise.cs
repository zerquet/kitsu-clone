namespace server.Models
{
    public class Franchise: BaseEntity
    {
        public string? Name { get; set; }
        public ICollection<Anime> Animes { get; } = [];
    }
}
