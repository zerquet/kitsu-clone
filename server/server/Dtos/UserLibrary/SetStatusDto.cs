using System;
using System.ComponentModel.DataAnnotations;

namespace server.Dtos.UserLibrary;

public class SetStatusDto
{
    public int AnimeId {get; set;} 

    [RegularExpression("completed|planning|watching")]
    public string Status {get; set;}
    
    public int EpisodesSeen {get; set;}
}
