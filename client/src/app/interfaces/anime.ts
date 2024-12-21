import { CategoryDto } from "./categoryDto";

export interface Anime {
    id: number;
    title: string;
    description: string;
    status: string;
    categories: CategoryDto[] 
    image: string; //post/put
    imageBase64: string; //get
    coverImage: string; //post/put
    coverImageBase64: string; //get
    year: number;
    episodes: number;
    mediaType: string;
    score: number;
    englishTitle: string;
    japaneseTitle: string;
    japaneseTitleRomaji: string;
    season: string;
    startAirDate: Date;
    endAirDate: Date;
    rating: string;
    episodeLength: number;
}