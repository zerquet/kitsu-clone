import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LibraryEntry } from '../models/libraryEntry';
import { LibraryEntryWithAnimeInfo } from '../models/libraryEntryWithAnimeInfo';
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

  updateLibraryEntry(data: any): Observable<LibraryEntry> {
    return this.http
      .put<LibraryEntry>(`${this.baseUrl}`, data);
  }

  deleteLibraryEntry(animeId: number): Observable<LibraryEntry> {
    return this.http
      .delete<LibraryEntry>(`${this.baseUrl}/${animeId}`);
  }

}
