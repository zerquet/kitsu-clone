import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { LoggedInUser } from '../interfaces/loggedInUser';
import { LoginDto } from '../interfaces/loginDto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  static url: string = "https://localhost:7009/api/Account";
  currentUserSig = signal<LoggedInUser | undefined | null>(undefined);
  constructor(private http: HttpClient) { }

  login(loginDto: LoginDto): Observable<LoggedInUser> {
    return this.http.post<LoggedInUser>(`${AuthService.url}/login`, loginDto);
  }

  getUser() {
    return this.http.get<LoggedInUser>(`${AuthService.url}/user`);
  }
}
