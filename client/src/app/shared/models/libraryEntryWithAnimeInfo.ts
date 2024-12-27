export interface LibraryEntryWithAnimeInfo {
    animeId: number;
    title: string;
    imageBase64: string | null;
    animeTotalEpisodes: number | null;
    libraryEntryId: number;
    watchStatus: string | null;
    userRating: number | null;
    episodesWatched: number;
}