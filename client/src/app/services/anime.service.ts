import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Anime } from '../models/anime.model';
import { Observable } from 'rxjs';
const api = 'https://localhost:7009/api/Anime';

@Injectable({
  providedIn: 'root'
})
export class AnimeService {

  constructor(private httpClient: HttpClient) { }
  
  getById(id: number): Observable<Anime> {
    return this.httpClient.get<Anime>(`${api}/${id}`);
  }
  getAll(): Observable<Anime[]> {
    return this.httpClient.get<Anime[]>(api);
  }
  post(formData: FormData): Observable<void> {
    return this.httpClient.post<void>(api, formData);
  }
}
