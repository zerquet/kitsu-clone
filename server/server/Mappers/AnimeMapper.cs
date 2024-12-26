using server.Dtos.Anime;
using server.Models;

namespace server.Mappers
{
    public static class AnimeMapper
    {
        //Does the 'this' make any sense here? It's not used an extension method.
        public static AnimeDto ToAnimeDto(this Anime animeModel, string? imageBase64, string? coverImageBase64)
        {
            return new AnimeDto
            {
                Id = animeModel.Id,
                Title = animeModel.Title,
                Description = animeModel.Description,
                Score = animeModel.Score,
                Categories = animeModel.Categories.Select(x => x.ToCategoryDto()).ToList(),
                ReleaseStatus = animeModel.ReleaseStatus,
                ImageBase64 = imageBase64,
                Year = animeModel.Year,
                EpisodeCount = animeModel.EpisodeCount,
                MediaType = animeModel.MediaType,
                Studios = animeModel.Studios,
                CoverImageBase64 = coverImageBase64,
                EnglishTitle = animeModel.EnglishTitle,
                JapaneseTitle = animeModel.JapaneseTitle,
                JapaneseTitleRomaji = animeModel.JapaneseTitleRomaji,
                Season = animeModel.Season,
                StartAirDate = animeModel.StartAirDate,
                EndAirDate = animeModel.EndAirDate,
                TvRating = animeModel.TvRating,
                EpisodeLength = animeModel.EpisodeLength,
                FranchiseId = animeModel.FranchiseId,
                FranchiseName = animeModel.Franchise?.Name
            };
        }
        public static Anime ToAnimeFromCreate(this CreateAnimeDto anime, string? imageId, string? coverImageId)
        {
            return new Anime
            {
                Title = anime.Title,
                Description = anime.Description = anime.Description,
                Score = anime.Score,
                ReleaseStatus = anime.Status,
                ImageUrl = imageId,
                Year = anime.Year,
                EpisodeCount = anime.EpisodeCount,
                MediaType = anime.MediaType,
                Studios= anime.Studios,
                CoverImageId = coverImageId,
                EnglishTitle = anime.EnglishTitle,
                JapaneseTitle = anime.JapaneseTitle,
                JapaneseTitleRomaji = anime.JapaneseTitleRomaji,
                Season = anime.Season,
                StartAirDate = anime.StartAirDate,
                EndAirDate = anime.EndAirDate,
                TvRating = anime.TvRating,
                EpisodeLength = anime.EpisodeLength,
                FranchiseId = anime.FranchiseId,
            };
        }

        public static void ToAnimeFromUpdate(this UpdateAnimeDto animeDto, Anime anime, string? imageId, string? coverImageId)
        {
            anime.Id = animeDto.Id;
            anime.Title = animeDto.Title;
            anime.Description = animeDto.Description;
            anime.Score = animeDto.Score;
            anime.ReleaseStatus = animeDto.ReleaseStatus;
            anime.ImageUrl = imageId ?? anime.ImageUrl;
            anime.Year = animeDto.Year;
            anime.EpisodeCount = animeDto.EpisodeCount;
            anime.CoverImageId = coverImageId ?? anime.CoverImageId;
            anime.Studios = animeDto.Studios;
            anime.MediaType = animeDto.MediaType;
            anime.EnglishTitle = animeDto.EnglishTitle;
            anime.JapaneseTitle = animeDto.JapaneseTitle;
            anime.JapaneseTitleRomaji = animeDto.JapaneseTitleRomaji;
            anime.Season = animeDto.Season;
            anime.StartAirDate = animeDto.StartAirDate;
            anime.EndAirDate = animeDto.EndAirDate;
            anime.TvRating = animeDto.TvRating;
            anime.EpisodeLength = animeDto.EpisodeLength;
            anime.FranchiseId = animeDto.FranchiseId;
        }
    }
}
