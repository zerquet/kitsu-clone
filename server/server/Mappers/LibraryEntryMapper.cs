using server.Dtos.LibraryEntry;
using server.Models;

namespace server.Mappers
{
    public static class LibraryEntryMapper
    {
        public static LibraryEntryDto ToLibraryEntryDto(this LibraryEntry animeLibraryEntry)
        {
            return new LibraryEntryDto
            {
                Id = animeLibraryEntry.Id,
                EpisodesWatched = animeLibraryEntry.EpisodesWatched,
                UserRating = animeLibraryEntry.UserRating,
                WatchStatus = animeLibraryEntry.WatchStatus,
            };
        }

        public static void ToLibraryEntryFromUpdate(this UpdateLibraryEntryDto dto, LibraryEntry libraryEntry)
        {
            libraryEntry.WatchStatus = dto.WatchStatus;
            libraryEntry.UserRating = dto.UserRating;
            libraryEntry.EpisodesWatched = dto.EpisodesWatched;
        }

        public static LibraryEntryWithAnimeInfoDto ToLibraryEntryWithAnimeInfoDto(this LibraryEntry animeLibraryEntry, Anime anime, string? imageBase64)
        {
            return new LibraryEntryWithAnimeInfoDto
            {
                AnimeId = anime.Id,
                Title = anime.Title,
                AnimeTotalEpisodes = anime.EpisodeCount,
                ImageBase64 = imageBase64,
                LibraryEntryId = animeLibraryEntry.Id,
                WatchStatus = animeLibraryEntry.WatchStatus,
                UserRating = animeLibraryEntry.UserRating,
                EpisodesWatched = animeLibraryEntry.EpisodesWatched
            };
        }
    }
}
