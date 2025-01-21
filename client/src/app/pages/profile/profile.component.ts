import { Component, inject, OnInit } from '@angular/core';
import { LibraryComponent } from './library/library.component';
import { UserProfileService } from '../../shared/services/user-profile.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BehaviorSubject, distinctUntilChanged, map, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { UserProfile } from '../../shared/models/userProfile';
import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { AuthService } from '../../auth/services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditProfileModalComponent } from './edit-profile-modal/edit-profile-modal.component';
import { UserLibraryService } from '../../shared/services/user-library.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [LibraryComponent, NgIf, AsyncPipe, NgClass, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  private userProfileService = inject(UserProfileService);
  private route = inject(ActivatedRoute);
  private modalService = inject(NgbModal)
  public authService = inject(AuthService);
  private destroy$ = new Subject<void>();
  private userLibraryService = inject(UserLibraryService);

  favoriteAnimes$ = this.userLibraryService.getFavoriteAnimes();

  userProfile$: Observable<UserProfile> = this.route.params.pipe(
    switchMap(params => this.userProfileService.getUserProfileById(params['id'])),
    takeUntil(this.destroy$));
  currentTab$: Observable<string> = this.route.params
    .pipe(
      distinctUntilChanged(),
      map(params => params['tab'] || "activity"),
      takeUntil(this.destroy$));

  onEditProfileClick(profileInfo: UserProfile) {
    const modal = this.modalService.open(EditProfileModalComponent);
    modal.componentInstance.initializeModalData({...profileInfo});
  }
}
