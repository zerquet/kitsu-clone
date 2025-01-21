import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LibraryEntry } from '../models/libraryEntry';
import { LibraryEntryWithAnimeInfo } from '../models/libraryEntryWithAnimeInfo';
import { BehaviorSubject, Observable } from 'rxjs';
import { Anime } from '../models/anime';
import { FavoriteAnime } from '../models/favoriteAnime';

@Injectable({
  providedIn: 'root'
})
export class UserLibraryService {
  private http = inject(HttpClient);
  private readonly baseUrl = "https://localhost:7009/api/LibraryEntry";

  private _favoritedAnimes$ = new BehaviorSubject<Anime[]>([]);
  
  constructor() {
    this.http.get<Anime[]>(`${this.baseUrl}/favorites`).subscribe((animes) => {
      this._favoritedAnimes$.next(animes);
    })
  }

  getLibraryEntry(animeId: number): Observable<LibraryEntry | null> {
    return this.http
      .get<LibraryEntry>(`${this.baseUrl}/${animeId}`);
  }

  getLibrary(userId: number): Observable<LibraryEntryWithAnimeInfo[]> {
    return this.http
      .get<LibraryEntryWithAnimeInfo[]>(`${this.baseUrl}/GetAllByUser/${userId}`);
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

  addToFavorites(anime: Anime) {
    this.http.post<void>(`${this.baseUrl}/favorites/${anime.id}`, null).subscribe(() => {
      let animes = this._favoritedAnimes$.getValue();
      animes.push(anime);
      this._favoritedAnimes$.next(animes);
    })
  }

  getFavoriteAnimes(): Observable<Anime[]> {
    return this._favoritedAnimes$;
  }

  getFavoriteAnime(animeId: number): Observable<FavoriteAnime> {
    return this.http.get<FavoriteAnime>(`${this.baseUrl}/favorites/${animeId}`);
  }

  removeAnimeFromFavorites(anime: Anime) {
    this.http.delete<void>(`${this.baseUrl}/favorites/${anime.id}`).subscribe(() => {
      let animes = this._favoritedAnimes$.getValue();
      animes = animes.filter(x => x.id !== anime.id);
      this._favoritedAnimes$.next(animes);
    })
  }

  updateFavorites(animes: Anime[]) {
    this.http.put<void>(`${this.baseUrl}/favorites/bulk`, animes.map(anime => anime.id)).subscribe(() => {
      this._favoritedAnimes$.next(animes);
    })
  }
}
