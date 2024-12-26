using server.Dtos.Episode;
using server.Models;

namespace server.Mappers
{
    public static class EpisodeMapper
    {
        public static Episode ToEpisodeFromCreate(this EpisodeDto episodeDto)
        {
            return new Episode
            {
                AnimeId = episodeDto.AnimeId,
                Number = episodeDto.Number,
                Title = episodeDto.Title,
                Description = episodeDto.Description,
                AirDate = episodeDto.AirDate,
                JapaneseTitle = episodeDto.JapaneseTitle
            };
        }
    }
}
