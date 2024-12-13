namespace server.Dtos.UserLibrary
{
    public class LibraryItemDto
    {
        public int AnimeId { get; set; }
        public string Title { get; set; } = "No title";
        public string? ImageBase64 { get; set; }
        public int? AnimeTotalEpisodes { get; set; }
        public int LibraryEntryId { get; set; }
        public string? Status { get; set; }
        public int? Rating { get; set; }
        public int EpisodesSeen { get; set; }
    }
}
