using System;
using server.Models.Identity;

namespace server.Models;

public class FavoriteAnime
{
    public string KitsuUserId { get; set; } = string.Empty;
    public int AnimeId { get; set; }
    public KitsuUser KitsuUser { get; set; } = null!;
    public Anime Anime { get; set; } = null!;
    public DateTime DateAdded { get; set; }
}
