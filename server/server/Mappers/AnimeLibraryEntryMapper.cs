using server.Dtos.UserLibrary;
using server.Models;

namespace server.Mappers
{
    public static class AnimeLibraryEntryMapper
    {
        public static AnimeLibraryEntryDto ToAnimeLibraryEntryDto(this AnimeLibraryEntry animeLibraryEntry)
        {
            return new AnimeLibraryEntryDto
            {
                Id = animeLibraryEntry.Id,
                EpisodesSeen = animeLibraryEntry.EpisodesSeen,
                Rating = animeLibraryEntry.Rating,
                Status = animeLibraryEntry.Status,
            };
        }

        public static void ToAnimeLibraryEntryFromEdit(this EditStatusDto dto, AnimeLibraryEntry libraryEntry)
        {
            libraryEntry.Status = dto.Status;
            libraryEntry.Rating = dto.Rating;
            libraryEntry.EpisodesSeen = dto.EpisodesSeen;
        }

        public static LibraryItemDto ToLibraryItemDto(this AnimeLibraryEntry animeLibraryEntry, Anime anime, string? imageBase64)
        {
            return new LibraryItemDto
            {
                AnimeId = anime.Id,
                Title = anime.Title,
                AnimeTotalEpisodes = anime.Episodes,
                ImageBase64 = imageBase64,
                LibraryEntryId = animeLibraryEntry.Id,
                Status = animeLibraryEntry.Status,
                Rating = animeLibraryEntry.Rating,
                EpisodesSeen = animeLibraryEntry.EpisodesSeen
            };
        }
    }
}
