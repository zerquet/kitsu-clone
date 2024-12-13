namespace server.Dtos.UserLibrary
{
    public class AnimeLibraryEntryDto
    {
        public int Id { get; set; }
        public string? Status { get; set; }
        public int? Rating { get; set; }
        public int EpisodesSeen { get; set; }
    }
}
