using server.Dtos.Anime;
using server.Models;

namespace server.Mappers
{
    public static class AnimeMapper
    {
        public static AnimeDto ToAnimeDto(this Anime animeModel, string? imageBase64, string? coverImageBase64)
        {
            return new AnimeDto
            {
                Id = animeModel.Id,
                Title = animeModel.Title,
                Description = animeModel.Description,
                Score = animeModel.Score,
                Categories = animeModel.Categories.Select(x => x.ToCategoryDto()).ToList(),
                Status = animeModel.Status,
                ImageBase64 = imageBase64,
                Year = animeModel.Year,
                Episodes = animeModel.Episodes,
                MediaType = animeModel.MediaType,
                Studios = animeModel.Studios,
                CoverImageBase64 = coverImageBase64,
                EnglishTitle = animeModel.EnglishTitle,
                JapaneseTitle = animeModel.JapaneseTitle,
                JapaneseTitleRomaji = animeModel.JapaneseTitleRomaji,
                Season = animeModel.Season,
                StartAirDate = animeModel.StartAirDate,
                EndAirDate = animeModel.EndAirDate,
                Rating = animeModel.Rating,
                EpisodeLength = animeModel.EpisodeLength
            };
        }
        public static Anime ToAnimeFromCreate(this CreateAnimeDto anime, string? imageId, string? coverImageId)
        {
            return new Anime
            {
                Title = anime.Title,
                Description = anime.Description == "null" ? null : anime.Description,
                Score = anime.Score,
                Status = anime.Status,
                ImageUrl = imageId,
                Year = anime.Year,
                Episodes = anime.Episodes,
                MediaType = anime.MediaType,
                Studios= anime.Studios,
                CoverImageId = coverImageId
            };
        }

        public static void ToAnimeFromUpdate(this UpdateAnimeDto animeDto, Anime anime, string? imageId, string? coverImageId)
        {
            anime.Id = animeDto.Id;
            anime.Title = animeDto.Title;
            anime.Description = animeDto.Description;
            anime.Score = animeDto.Score;
            anime.Status = animeDto.Status;
            anime.ImageUrl = imageId ?? anime.ImageUrl;
            anime.Year = animeDto.Year;
            anime.Episodes = animeDto.Episodes;
            anime.CoverImageId = coverImageId ?? anime.CoverImageId;
            anime.Studios = animeDto.Studios;
            anime.MediaType = animeDto.MediaType;
            anime.EnglishTitle = animeDto.EnglishTitle;
            anime.JapaneseTitle = animeDto.JapaneseTitle;
            anime.JapaneseTitleRomaji = animeDto.JapaneseTitleRomaji;
            anime.Season = animeDto.Season;
            anime.StartAirDate = animeDto.StartAirDate;
            anime.EndAirDate = animeDto.EndAirDate;
            anime.Rating = animeDto.Rating;
            anime.EpisodeLength = animeDto.EpisodeLength;
        }
    }
}
