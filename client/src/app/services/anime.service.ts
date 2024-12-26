import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { Anime } from '../interfaces/anime';

@Injectable({
  providedIn: 'root',
})
export class AnimeService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'https://localhost:7009/api/Anime';

  getAnimes(): Observable<Anime[]> {
    return this.http
      .get<Anime[]>(`${this.baseUrl}/GetAll`)
      .pipe(shareReplay(1));
  }

  getAnime(id: number): Observable<Anime> {
    return this.http
      .get<Anime>(`${this.baseUrl}/${id}`)
      .pipe(shareReplay(1));
  }

  getAnimesByCategory(category: string): Observable<Anime[]> {
    return this.http
      .get<Anime[]>(`${this.baseUrl}/GetByCategory/${category}`)
      .pipe(shareReplay(1));
  }

  addAnime(data: FormData): Observable<void> {
    return this.http
      .post<void>(this.baseUrl, data);
  }

  updateAnime(data: FormData): Observable<void> {
    return this.http
      .put<void>(this.baseUrl, data);
  }

  miniSearch(term: string): Observable<Anime[]> {
    return this.http
      .get<Anime[]>(`${this.baseUrl}/MiniSearch?term=${term}`);
  }

  advancedSearch(
    term?: string,
    minYear?: string | null,
    maxYear?: string | null,
    minRating?: string | null,
    maxRating?: string | null,
    minEpisodes?: string | null,
    maxEpisodes?: string | null,
    showTv?: boolean,
    showMovie?: boolean
  ): Observable<Anime[]> {
    let queryString = '/AdvancedSearch?';
    queryString += `term=${term}`;
    if(minYear != null) queryString += `&minYear=${minYear}`;
    if(maxYear != null) queryString += `&maxYear=${maxYear}`;
    if(minRating != null) queryString += `&minRating=${minRating}`;
    if(maxRating != null) queryString += `&maxRating=${maxRating}`;
    if(minEpisodes != null) queryString += `&minEpisodes=${minEpisodes}`;
    if(maxEpisodes != null && maxEpisodes !== "100") queryString += `&maxEpisodes=${maxEpisodes}`;
    if(showTv == true || showMovie == true) {
      let mediaTypeString = "&mediaType=";
      let types = [];
      if(showTv == true) types.push("TV");
      if(showMovie == true) types.push("Movie");

      if(types.length > 1) mediaTypeString += types.join(',');
      if(types.length == 1) mediaTypeString += types[0];
      queryString += mediaTypeString;
    }

    return this.http
      .get<Anime[]>(`${this.baseUrl}${queryString}`);
  }
}
