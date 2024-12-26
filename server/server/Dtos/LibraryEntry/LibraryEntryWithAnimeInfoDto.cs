namespace server.Dtos.LibraryEntry
{
    //Used for the Library component in Angular. It needs related Anime info as well. 
    public class LibraryEntryWithAnimeInfoDto
    {
        public int AnimeId { get; set; }
        public string Title { get; set; } = "No title";
        public string? ImageBase64 { get; set; }
        public int? AnimeTotalEpisodes { get; set; }
        public int LibraryEntryId { get; set; }
        public string? WatchStatus { get; set; }
        public int? UserRating { get; set; }
        public int EpisodesWatched { get; set; }
    }
}
