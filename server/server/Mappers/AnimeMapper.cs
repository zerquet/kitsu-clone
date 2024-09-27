using server.Dtos.Anime;
using server.Models;

namespace server.Mappers
{
    public static class AnimeMapper
    {
        public static AnimeDto ToAnimeDto(this Anime animeModel, string? imageBase64)
        {
            return new AnimeDto
            {
                Id = animeModel.Id,
                Title = animeModel.Title,
                Description = animeModel.Description,
                Score = animeModel.Score,
                Genres = animeModel.Genres,
                Status = animeModel.Status,
                ImageBase64 = imageBase64
            };
        }
        public static Anime ToAnimeFromCreate(this CreateAnimeDto anime, string? imageId)
        {
            return new Anime
            {
                Title = anime.Title,
                Description = anime.Description == "null" ? null : anime.Description,
                Score = anime.Score,
                Genres = anime.Genres,
                Status = anime.Status,
                ImageUrl = imageId
            };
        }
    }
}
