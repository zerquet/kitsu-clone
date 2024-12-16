import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { Anime } from '../interfaces/anime';

@Injectable({
  providedIn: 'root',
})
export class AnimeService {
  static url: string = 'https://localhost:7009/api/Anime';
  constructor(private http: HttpClient) {}

  getAnimes() {
    return this.http.get<Anime[]>(AnimeService.url).pipe(shareReplay(1));
  }

  getAnime(id: number) {
    return this.http
      .get<Anime>(`${AnimeService.url}/${id}`)
      .pipe(shareReplay(1));
  }

  getAnimesByCategory(category: string) {
    return this.http.get<Anime[]>(`${AnimeService.url}/category/${category}`).pipe(shareReplay(1));
  }

  addAnime(formData: FormData) {
    return this.http.post<void>(AnimeService.url, formData);
  }

  updateAnime(formData: FormData) {
    return this.http.put<void>(AnimeService.url, formData);
  }

  miniSearch(term: string) {
    return this.http.get<Anime[]>(`${AnimeService.url}/search?term=${term}`);
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
  ) {
    let queryString = '/advancedSearch?';
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

    return this.http.get<Anime[]>(`${AnimeService.url}${queryString}`);
  }
}
