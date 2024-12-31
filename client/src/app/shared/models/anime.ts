import { Category } from "./category";

export interface Anime {
    id: number;
    title: string;
    description: string | null;
    score: number | null;
    categories: Category[] 
    releaseStatus: string | null;
    image: string; //post/put
    imageBase64: string; //get //TODO rename to imageUrl. No longer using imageBase64. It made api calls too large
    coverImage: string; //post/put
    coverImageBase64: string; //get //TODO rename to coverImageUrl. No longer using coverImageBase64. It made api calls too large
    year: number | null;
    episodeCount: number | null;
    mediaType: string | null;
    englishTitle: string | null;
    japaneseTitle: string | null;
    japaneseTitleRomaji: string | null;
    season: string | null;
    startAirDate: Date | null;
    endAirDate: Date | null;
    tvRating: string | null;
    episodeLength: number | null;
    franchiseId: number | null;
    franchiseName: string | null;
}