using System;
using System.ComponentModel.DataAnnotations;

namespace server.Dtos.LibraryEntry;

public class CreateLibraryItemDto
{
    public int AnimeId { get; set; }

    [RegularExpression("completed|planning|watching")]
    public string WatchStatus { get; set; }

    public int EpisodesWatched { get; set; }
}
