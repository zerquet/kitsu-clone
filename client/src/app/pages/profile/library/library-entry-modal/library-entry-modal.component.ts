import { Component, inject, Input, OnDestroy } from '@angular/core';
import { LibraryEntryWithAnimeInfo } from '../../../../shared/models/libraryEntryWithAnimeInfo';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn } from '@angular/forms';
import { NgIf } from '@angular/common';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserLibraryService } from '../../../../shared/services/user-library.service';
import { UserLibraryDataService } from '../../../../shared/services/user-library-data.service';

@Component({
  selector: 'app-edit-entry',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './library-entry-modal.component.html',
  styleUrl: './library-entry-modal.component.css'
})
export class LibraryEntryModalComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  libraryEntry$ = new BehaviorSubject<LibraryEntryWithAnimeInfo | undefined>(undefined);
  activeModal = inject(NgbActiveModal);
  userLibraryService = inject(UserLibraryService);
  userLibraryDataService = inject(UserLibraryDataService);
  form = new FormGroup({
    status: new FormControl('',[this.statusIsDifferentValidator()]),
    rating: new FormControl(0,[this.ratingIsDifferentValidator()]),
    progress: new FormControl(0, [this.progressIsDifferentValidator()])
  });
  canEdit$ = new BehaviorSubject(false);

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initializeModalData(entry: LibraryEntryWithAnimeInfo, canEdit: boolean) {
    this.libraryEntry$.next(entry);
    this.form.patchValue({"status": entry.watchStatus});
    this.form.patchValue({"rating": entry.userRating});
    this.form.patchValue({"progress": entry.episodesWatched});
    this.canEdit$.next(canEdit);

    if(!canEdit) {
      this.form.disable();
    }
  }

  closeModal = () => this.activeModal.close();

  saveChanges() {
    if(this.canEdit$.value === false) {
      return;
    } //just making sure
    //get form stuff
    //validate more?
    //make api call
    //close modal
    //update library component? might have to move originalList$ to a service class or sum
    let entry = this.libraryEntry$.value;
    const data = {
      Id: entry?.libraryEntryId,
      animeId: entry?.animeId,
      watchStatus: this.status.value,
      episodesWatched: this.progress.value,
      userRating: this.rating.value
    }
    this.userLibraryService
      .updateLibraryEntry(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        let updatedCollection = this.userLibraryDataService.originalAnimeList$.value
          .map(item => {
            if(item.libraryEntryId === res.id) {
              item.userRating = Number(res.userRating);
              item.watchStatus = res.watchStatus;
              item.episodesWatched = res.episodesWatched;
            }
            return item;});
          
        this.userLibraryDataService.originalAnimeList$.next(updatedCollection);
        this.activeModal.close();})
  }

  removeEntry() {
    this.userLibraryService
      .deleteLibraryEntry(this.libraryEntry$.value?.animeId!)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        let updatedCollection = this.userLibraryDataService.originalAnimeList$.value.filter(item => item.animeId !== this.libraryEntry$.value?.animeId);
        this.userLibraryDataService.originalAnimeList$.next(updatedCollection);
        this.activeModal.close();})
  }

  //FORM GETTERS
  get status() { return this.form.controls["status"]; }

  get rating() { return this.form.controls["rating"]; }

  get progress() { return this.form.controls["progress"]; }

  //FORM "VALIDATORS"
  statusIsDifferentValidator(): ValidatorFn {
    //validator creation function
    return (control: AbstractControl): ValidationErrors | null => {
      if(control.value === this.libraryEntry$.value?.watchStatus) {
        return null;
      }
      return {statusIsDifferent:true}
    }
  }

  ratingIsDifferentValidator(): ValidatorFn {
    //validator creation function
    return (control: AbstractControl): ValidationErrors | null => {
      //control values are strings. needs to be converted to number
      let controlVal = control.value === "" || control.value === null ? null : Number(control.value);
      if(controlVal === this.libraryEntry$.value?.userRating) {
        return null;
      }
      return {ratingIsDifferent:true}
    }
  }

  progressIsDifferentValidator(): ValidatorFn {
    //validator creation function
    return (control: AbstractControl): ValidationErrors | null => {
      if(control.value === this.libraryEntry$.value?.episodesWatched) {
        return null;
      }
      return {progressIsDifferent:true}
    }
  }

}
