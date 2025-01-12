using server.Dtos.Episode;
using server.Models;

namespace server.Mappers
{
    public static class EpisodeMapper
    {
        public static Episode ToEpisodeFromCreate(this EpisodeDto episodeDto)
        {
            var episode = new Episode
            {
                AnimeId = episodeDto.AnimeId,
                Number = episodeDto.Number,
                Title = episodeDto.Title,
                Description = episodeDto.Description,
                JapaneseTitle = episodeDto.JapaneseTitle
            };
            var date = (DateTime)episodeDto.AirDate2!;
            episode.AirDate = new DateOnly(date.Year, date.Month, date.Day);
            return episode;
            
        }
    }
}
