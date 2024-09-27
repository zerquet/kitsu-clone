export interface Anime {
    id?: number;
    title?: string;
    description?: string;
    image?: File; //when writing
    imageBase64?: string; //when reading
    genres: string[];
    status: string[];
}