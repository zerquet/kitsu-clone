import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { Component, ElementRef, inject, OnInit, Renderer2, viewChild, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LibraryEntryWithAnimeInfo } from '../../shared/models/libraryEntryWithAnimeInfo';
import { UserLibraryService } from '../../shared/services/user-library.service';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, map, Observable, Subject } from 'rxjs';
import { RouterLink } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LibraryEntryModalComponent } from './library-entry-modal/library-entry-modal.component';
import { UserLibraryDataService } from '../../shared/services/user-library-data.service';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, NgIf, AsyncPipe, RouterLink],
  templateUrl: './library.component.html',
  styleUrl: './library.component.css'
})
export class LibraryComponent implements OnInit {
  private userLibraryService = inject(UserLibraryService);
  private modalService = inject(NgbModal);
  private userLibraryDataService = inject(UserLibraryDataService);
  form: FormGroup = new FormGroup({ search: new FormControl() });
  sortDirection$ = new BehaviorSubject("asc");
  sortOption$ = new BehaviorSubject("Title");
  libraryType$ = new BehaviorSubject("all");
  searchTerm$ = new BehaviorSubject("");
  ratingCellMode = "read"; //not used. Remove?
  currAnimeIdForEditingRating = -1;
  progressCellMode = "read";
  currAnimeIdForEditingProgress = -1;
  potentialProgressUpdate: LibraryEntryWithAnimeInfo | undefined = undefined;
  //When behavior subject values are updated, the filteted list is too. 
  //https://chatgpt.com/share/675410d9-9a68-8003-9599-c495ff36fb9e
  filteredAnimeList$ = combineLatest([
    this.userLibraryDataService.originalAnimeList$,
    this.sortDirection$,
    this.sortOption$,
    this.libraryType$,
    this.searchTerm$
  ]).pipe(
    map(([list, sortDirection, sortOption, libraryType, searchTerm]) => 
      //similar methods as sorter() didnt need arguments passed (advanced, mini search). copy from to here? it's using the same behavior subject pattern..
      this.sorter(list, sortOption, sortDirection, libraryType, searchTerm)) 
  );
  @ViewChild("ratingEditMenu") ratingEditMenu!: ElementRef;
  @ViewChild("progressEditField") progressEditField!: ElementRef;
  private renderer = inject(Renderer2)
    .listen("window", "click", (e: Event) => {
      //when all dropdowns are not shown, ratingEditMenu will be undefined. Return since we don't need to do anything else.
      //Only run when the dropdown is not clicked. Otherwise, all clicks (including on the dropdown) get into this and the menu will never close
      if(this.ratingCellMode === "edit" && this.ratingEditMenu !== undefined && e.target !== this.ratingEditMenu.nativeElement) {
        this.ratingCellMode = "read";
        this.currAnimeIdForEditingRating = -1;
      }
      if(this.progressCellMode === "edit" && this.progressEditField !== undefined && e.target !== this.progressEditField.nativeElement) {
        this.progressCellMode = "read";
        this.currAnimeIdForEditingProgress = -1;
        //Save when user clicks out. 
        if(this.potentialProgressUpdate !== undefined) {
          this.updateProgress(this.potentialProgressUpdate as LibraryEntryWithAnimeInfo)
        }
      }
    })

  ngOnInit(): void {
    this.form.controls["search"].valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged())
      .subscribe(term => this.searchTerm$.next(term.toLowerCase())); //use (input) instead to avoid 

    this.userLibraryService.getLibrary().subscribe(res => this.userLibraryDataService.originalAnimeList$.next(res));
  }

  //FORM GETTERS
  get search() { return this.form.get('search'); }

  //COMPONENT METHODS
  changeLibraryType = (type: string) => this.libraryType$.next(type);

  toggleDirection() {
    const val = this.sortDirection$.value === "asc" ? "desc": "asc";
    this.sortDirection$.next(val);
  }

  changeSortOption = (option: string) => this.sortOption$.next(option);

  openEditModal(entry: LibraryEntryWithAnimeInfo) {
    const modal = this.modalService.open(LibraryEntryModalComponent,);
    modal.componentInstance.initializeModalData({...entry});
  }

  onRatingClick(animeId: number) {
    //edit = user edits rating
    //read = user is just reading the value/not editing
    this.ratingCellMode = this.ratingCellMode === "read" ? "edit": "read";
    this.currAnimeIdForEditingRating = animeId;
  }

  onProgressClick(animeId: number) {
    //edit and read have same definitions as onRatingClick
    this.progressCellMode = this.progressCellMode === "read" ? "edit": "read";
    this.currAnimeIdForEditingProgress = animeId;
  }

  onProgressChange(entry: LibraryEntryWithAnimeInfo, event: Event) {
    //Save changes when user updates progress by +/-'ing so the rendered event listener can have access to it. //TODO check if this comment is still accurate. belongs below?
    let potential = {...entry};
    potential.episodesWatched = Number((event.target as HTMLInputElement).value);
    this.potentialProgressUpdate = potential;
  }

  onIncrementProgressClick(currEntry: LibraryEntryWithAnimeInfo) {
    var copy = {...currEntry}
    copy.episodesWatched++;
    this.updateProgress(copy)
  }

  updateRating(currEntry: LibraryEntryWithAnimeInfo, newRating: string) {
    const data = {
      libraryEntryId: currEntry.libraryEntryId,
      animeId: currEntry.animeId,
      watchStatus: currEntry.watchStatus,
      episodesWatched: currEntry.episodesWatched,
      userRating: Number(newRating)
    }
    this.userLibraryService.updateLibraryEntry(data)
      .subscribe({
        next: res => {
          //update libraryItemDto in observable list with returned response. next. ONLY if status is 200
          //Hmm, perhaps use BehaviorSubject of type LibraryItemDto[] and update that instead. 
          //Then use combineLatest - add its subject and the filtered list will automatically update when we .next() the subject.
          //This will also conveniently update filteredList$. This may also conflict with the logic for having an originalList$
          let updatedCollection = this.userLibraryDataService.originalAnimeList$.value.
            map(item => {
              if(item.libraryEntryId === res.id) {
                item.userRating = Number(res.userRating)
              }
              return item;
            });
            this.userLibraryDataService.originalAnimeList$.next(updatedCollection);
        },
        error: e => {
        },
      })
  }

  updateProgress(currEntry: LibraryEntryWithAnimeInfo) {
    const data = {
      libraryEntryId: currEntry.libraryEntryId,
      animeId: currEntry.animeId,
      watchStatus: currEntry.watchStatus,
      episodesWatched: currEntry.episodesWatched,
      userRating: currEntry.userRating
    }
    this.userLibraryService.updateLibraryEntry(data)
      .subscribe({
        next: res => {
          let updatedCollection = this.userLibraryDataService.originalAnimeList$.value.
            map(item => {
              if(item.libraryEntryId === res.id) {
                item.episodesWatched = res.episodesWatched;
              }
              return item;
            });
            this.userLibraryDataService.originalAnimeList$.next(updatedCollection);
            this.potentialProgressUpdate = undefined;
        }
      })
  }

  private sorter(list: LibraryEntryWithAnimeInfo[] ,column: string, direction: string, library: string, searchTerm: string): LibraryEntryWithAnimeInfo[] {
    if(library !== "all")
      list = list.filter(i => i.watchStatus === library); 

    if(searchTerm !== "")
      list = list.filter(j => j.title.toLocaleLowerCase().includes(searchTerm));
    
    if(column === "Title") 
    {
      if(direction === "asc")
        list.sort((a, b) => a.title < b.title ? -1 : 1)
      else 
        list.sort((a, b) => a.title < b.title ? 1 : -1)
    }
    else if(column === "Length")
    {
      if(direction === "asc")
        list.sort((a, b) => a.animeTotalEpisodes! < b.animeTotalEpisodes! ? -1 : 1)
      else
        list.sort((a, b) => a.animeTotalEpisodes! < b.animeTotalEpisodes! ? 1 : -1)
    }
    else if(column === "Rating") 
    {
      if(direction === "asc")
        list.sort((a, b) => a.userRating! < b.userRating! ? -1 : 1)
      else
        list.sort((a, b) => a.userRating! < b.userRating! ? 1 : -1)
    }

    return list;
  }
}