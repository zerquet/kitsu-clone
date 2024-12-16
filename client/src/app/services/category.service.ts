import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CategoryDto } from '../interfaces/categoryDto';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  static url = "https://localhost:7009/api/Category"
  constructor(private http: HttpClient) { }

  getCategory(name: string) {
    return this.http.get<CategoryDto>(`${CategoryService.url}/${name}`);
  }

  getAvailableCategories() {
    return this.http.get<CategoryDto[]>(`${CategoryService.url}/getAvailable`);
  }
}
