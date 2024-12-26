namespace server.Dtos.LibraryEntry
{
    //Used for the Anime component in Angular.
    //Compared to LibraryEntryWithAnimeInfoDto, Anime component already has the Anime info, so we send a smaller Dto instead.
    public class LibraryEntryDto
    {
        public int Id { get; set; }
        public string? WatchStatus { get; set; }
        public int? UserRating { get; set; }
        public int EpisodesWatched { get; set; }
    }
}
