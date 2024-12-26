using System;
using System.ComponentModel.DataAnnotations;

namespace server.Dtos.LibraryEntry;

public class UpdateLibraryEntryDto
{
    public int Id { get; set; }
    public int AnimeId { get; set; }

    [RegularExpression("completed|planning|watching")]
    public required string WatchStatus { get; set; }

    public int EpisodesWatched { get; set; }
    public int? UserRating { get; set; }
}
