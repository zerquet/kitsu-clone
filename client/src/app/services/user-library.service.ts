import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AnimeLibraryEntry } from '../interfaces/animeLibraryEntry';
import { LibraryItemDto } from '../interfaces/libraryItemDto';

@Injectable({
  providedIn: 'root'
})
export class UserLibraryService {
  static url: string = "https://localhost:7009/api/AnimeLibraryEntry";
  constructor(private http: HttpClient) { }
  
  getStatus(animeId: number) {
    return this.http.get<AnimeLibraryEntry>(`${UserLibraryService.url}/getStatus/${animeId}`);
  }

  getLibrary() {
    return this.http.get<LibraryItemDto[]>(`${UserLibraryService.url}/getLibrary`);
  }

  setStatus(animeId: number, status: string, episodesSeen: number) {
    return this.http.post<AnimeLibraryEntry>(`${UserLibraryService.url}/setStatus`, 
      {
        AnimeId: animeId,
        Status: status,
        EpisodesSeen: episodesSeen
      });
  }

  editStatus(id: number, animeId: number, status: string, episodesSeen: number, rating: number) {
    return this.http.put<AnimeLibraryEntry>(`${UserLibraryService.url}/editStatus`, 
      {
        Id: id,
        AnimeId: animeId,
        Status: status,
        EpisodesSeen: episodesSeen,
        Rating: rating
      });
  }

  deleteStatus(animeId: number) {
    return this.http.delete<AnimeLibraryEntry>(`${UserLibraryService.url}/deleteStatus/${animeId}`);
  }

}
