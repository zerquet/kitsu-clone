import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserProfile } from '../models/userProfile';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'https://localhost:7009/api/Account';

  getUserProfileById(id: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.baseUrl}/GetUserProfileById/${id}`);
  }

  updateUserProfile(data: UserProfile): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.baseUrl}/UpdateUserProfile`, data);
  }
}
