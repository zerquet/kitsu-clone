import { HttpClient } from '@angular/common/http';
import { inject, Injectable, OnInit, signal } from '@angular/core';
import { User } from '../models/user';
import { LoginDto } from '../models/loginDto';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly baseUrl = "https://localhost:7009/api/Account";
  currentUser$ = new BehaviorSubject<User | null>(null);
  isAdminPage$ = new BehaviorSubject<boolean>(false);

  constructor() {
    this.getUser().subscribe(res => {
      this.currentUser$.next(res);
    })
  }

  login(request: LoginDto): Observable<User> {
    return this.http
      .post<User>(`${this.baseUrl}/login`, request)
  }

  getUser(): Observable<User | null> {
    return this.http
      .get<User | null>(`${this.baseUrl}/user`);
  }

  get isLoggedIn() {
    let loggedIn = this.currentUser$.value !== null;
    return of(loggedIn);
  }
}
