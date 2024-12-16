import { CategoryDto } from "./categoryDto";

export interface Anime {
    id: number;
    title: string;
    description: string;
    categories: CategoryDto[] 
    image: string; //post/put
    imageBase64: string; //get
    coverImage: string; //post/put
    coverImageBase64: string; //get
    year: number;
    episodes: number;
    mediaType: string;
    score: number;
}