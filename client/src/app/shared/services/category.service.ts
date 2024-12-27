import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Category } from '../models/category';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'https://localhost:7009/api/Category';

  getCategory(name: string): Observable<Category> {
    return this.http
      .get<Category>(`${this.baseUrl}/${name}`);
  }

  getAvailableCategories(): Observable<Category[]> {
    return this.http
      .get<Category[]>(`${this.baseUrl}/GetAll`);
  }
}
