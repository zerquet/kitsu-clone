import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { User } from '../models/user';
import { LoginDto } from '../models/loginDto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly baseUrl = "https://localhost:7009/api/Account";
  currentUserSig = signal<User | undefined | null>(undefined);

  login(request: LoginDto): Observable<User> {
    return this.http
      .post<User>(`${this.baseUrl}/login`, request);
  }

  getUser(): Observable<User> {
    return this.http
      .get<User>(`${this.baseUrl}/user`);
  }
}
