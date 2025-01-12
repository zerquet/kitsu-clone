import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserProfile } from '../../../shared/models/userProfile';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { NgIf } from '@angular/common';
import { UserProfileService } from '../../../shared/services/user-profile.service';
import { AppToastService } from '../../../shared/services/app-toast.service';

@Component({
  selector: 'app-edit-profile-modal',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './edit-profile-modal.component.html',
  styleUrl: './edit-profile-modal.component.css'
})
export class EditProfileModalComponent {
  activeModal = inject(NgbActiveModal);
  private userProfileService = inject(UserProfileService);
  private toastService = inject(AppToastService);
  profileInfo$ = new BehaviorSubject<UserProfile | undefined>(undefined);
  form = new FormGroup({
    location: new FormControl(''),
    birthday: new FormControl<Date | null>(null),
    gender: new FormControl(''),
    bio: new FormControl('')
  });

  initializeModalData(profileInfo: UserProfile) {
    this.profileInfo$.next(profileInfo);
    this.form.patchValue({"location": profileInfo.location});
    this.form.patchValue({"birthday": profileInfo.birthday});
    this.form.patchValue({"gender": profileInfo.gender});
    this.form.patchValue({"bio": profileInfo.bio});
  }

  get location() { return this.form.get("location")}
  get birthday() { return this.form.get("birthday")}
  get gender() { return this.form.get("gender")}
  get bio() { return this.form.get("bio")}

  saveChanges() {
    debugger;
    const data: UserProfile = {
      id: this.profileInfo$.value?.id!,
      username: this.profileInfo$.value?.username!,
      location: this.location!.value!,
      bio: this.bio!.value!,
      birthday: this.birthday!.value!,
      gender: this.gender!.value!
    }  
    
    this.userProfileService.updateUserProfile(data)
      .subscribe({
        next: res => {
          this.profileInfo$.next(res);
          this.toastService.show("Success", "Profile successfully updated!");
          this.activeModal.close(); //gotta let other components know about the new updates. idk im too tired. 
        },
        error: () => {
          this.toastService.show("Error", "Updates could not be saved.");
        }
      })
  }

}
