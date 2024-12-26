import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LibraryEntry } from '../interfaces/libraryEntry';
import { LibraryEntryWithAnimeInfo } from '../interfaces/libraryEntryWithAnimeInfo';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserLibraryService {
  private http = inject(HttpClient);
  private readonly baseUrl = "https://localhost:7009/api/LibraryEntry";
  
  getLibraryEntry(animeId: number): Observable<LibraryEntry> {
    return this.http
      .get<LibraryEntry>(`${this.baseUrl}/${animeId}`);
  }

  getLibrary(): Observable<LibraryEntryWithAnimeInfo[]> {
    return this.http
      .get<LibraryEntryWithAnimeInfo[]>(`${this.baseUrl}/GetAllByUser`);
  }

  createLibraryEntry(animeId: number, status: string, episodesWatched: number): Observable<LibraryEntry> {
    return this.http
      .post<LibraryEntry>(`${this.baseUrl}`, 
        {
          AnimeId: animeId,
          WatchStatus: status,
          EpisodesWatched: episodesWatched
        });
  }

  updateLibraryEntry( //why not pass a dto or object? Inconsistency across codebase.
    libraryEntryId: number, 
    animeId: number, 
    status: string, 
    episodesWatched: number, 
    rating: number
  ): Observable<LibraryEntry> {
    return this.http
      .put<LibraryEntry>(`${this.baseUrl}`, 
        {
          Id: libraryEntryId,
          AnimeId: animeId,
          WatchStatus: status,
          EpisodesWatched: episodesWatched,
          UserRating: rating
        });
  }

  deleteLibraryEntry(animeId: number): Observable<LibraryEntry> {
    return this.http
      .delete<LibraryEntry>(`${this.baseUrl}/${animeId}`);
  }

}
