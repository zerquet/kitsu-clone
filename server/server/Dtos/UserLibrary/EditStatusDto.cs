using System;
using System.ComponentModel.DataAnnotations;

namespace server.Dtos.UserLibrary;

public class EditStatusDto
{
    public int Id { get; set; }
    public int AnimeId {get; set;} 

    [RegularExpression("completed|planning|watching")]
    public required string Status {get; set;}
    
    public int EpisodesSeen {get; set;}
    public int? Rating { get; set; }
}
