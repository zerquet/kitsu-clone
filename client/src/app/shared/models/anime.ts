import { Category } from "./category";

export interface Anime {
    id: number;
    title: string;
    description: string | null;
    score: number | null;
    categories: Category[] 
    releaseStatus: string | null;
    image: string; //post/put
    imageBase64: string; //get
    coverImage: string; //post/put
    coverImageBase64: string; //get
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