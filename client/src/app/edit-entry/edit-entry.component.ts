import { Component, inject } from '@angular/core';
import { LibraryItemDto } from '../interfaces/libraryItemDto';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn } from '@angular/forms';
import { NgIf } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserLibraryService } from '../services/user-library.service';
import { UserLibraryDataService } from '../services/user-library-data.service';

@Component({
  selector: 'app-edit-entry',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './edit-entry.component.html',
  styleUrl: './edit-entry.component.css'
})
export class EditEntryComponent {
  libraryEntry = new BehaviorSubject<LibraryItemDto | undefined>(undefined);
  activeModal = inject(NgbActiveModal);
  userLibraryService = inject(UserLibraryService);
  userLibraryDataService = inject(UserLibraryDataService);
  form = new FormGroup({
    status: new FormControl('',[this.statusIsDifferentValidator()]),
    rating: new FormControl(0,[this.ratingIsDifferentValidator()]),
    progress: new FormControl(0, [this.progressIsDifferentValidator()])
  });

  initializeModalData(entry: LibraryItemDto) {
    debugger;
    this.libraryEntry.next(entry);
    this.form.patchValue({"status": entry.status});
    this.form.patchValue({"rating": entry.rating});
    this.form.patchValue({"progress": entry.episodesSeen});
  }

  closeModal() {
    this.activeModal.close()
  }

  saveChanges() {
    //get form stuff
    //validate more?
    //make api call
    //close modal
    //update library component? might have to move originalList$ to a service class or sum
    let entry = this.libraryEntry.value;
    this.userLibraryService.editStatus(entry?.libraryEntryId!, entry?.animeId!, this.status.value!, this.progress.value!, this.rating.value!)
      .subscribe({
        next: res => {
          let updatedCollection = this.userLibraryDataService.originalAnimeList$.value.
            map(item => {
              if(item.libraryEntryId === res.id) {
                item.rating = Number(res.rating);
                item.status = res.status;
                item.episodesSeen = res.episodesSeen
              }
              return item;
            });
          this.userLibraryDataService.originalAnimeList$.next(updatedCollection);
          this.activeModal.close();
        },
        error: err => {

        }
      })
  }

  removeEntry() {
    this.userLibraryService.deleteStatus(this.libraryEntry.value?.animeId!).subscribe(res => {
      let updatedCollection = this.userLibraryDataService.originalAnimeList$.value.filter(item => item.animeId !== this.libraryEntry.value?.animeId);
      this.userLibraryDataService.originalAnimeList$.next(updatedCollection);
      this.activeModal.close();
    })
  }

  //FORM GETTERS
  get status() {
    return this.form.controls["status"];
  }

  get rating() {
    return this.form.controls["rating"];
  }

  get progress() {
    return this.form.controls["progress"];
  }

  //FORM "VALIDATORS"
  statusIsDifferentValidator(): ValidatorFn {
    //validator creation function
    return (control: AbstractControl): ValidationErrors | null => {
      if(control.value === this.libraryEntry.value?.status) {
        return null;
      }
      return {statusIsDifferent:true}
    }
  }

  ratingIsDifferentValidator(): ValidatorFn {
    //validator creation function
    return (control: AbstractControl): ValidationErrors | null => {
      //control values are strings. needs to be converted to number
      debugger;
      let controlVal = control.value === "" || control.value === null ? null : Number(control.value);
      if(controlVal === this.libraryEntry.value?.rating) {
        return null;
      }
      return {ratingIsDifferent:true}
    }
  }

  progressIsDifferentValidator(): ValidatorFn {
    //validator creation function
    return (control: AbstractControl): ValidationErrors | null => {
      if(control.value === this.libraryEntry.value?.episodesSeen) {
        return null;
      }
      return {progressIsDifferent:true}
    }
  }

}
