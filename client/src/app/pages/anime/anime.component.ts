import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AnimeService } from '../../shared/services/anime.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BehaviorSubject, catchError, combineLatest, distinctUntilChanged, map, mergeMap, Observable, of, Subject, switchMap, take, takeUntil, tap } from 'rxjs';
import { Anime } from '../../shared/models/anime';
import { AsyncPipe, CommonModule, NgClass, NgIf } from '@angular/common';
import { UserLibraryService } from '../../shared/services/user-library.service';
import { LibraryEntry } from '../../shared/models/libraryEntry';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AnimeSummaryComponent } from './anime-summary/anime-summary.component';
import { AnimeEpisodesComponent } from './anime-episodes/anime-episodes.component';
import { AnimeFranchiseComponent } from './anime-franchise/anime-franchise.component';
import { AuthService } from '../../auth/services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SignUpComponent } from '../../auth/components/sign-up/sign-up.component';
import { FavoriteAnime } from '../../shared/models/favoriteAnime';

@Component({
  selector: 'app-anime',
  standalone: true,
  imports: [AsyncPipe, CommonModule, ReactiveFormsModule, AnimeSummaryComponent, AnimeEpisodesComponent, AnimeFranchiseComponent],
  templateUrl: './anime.component.html',
  styleUrl: './anime.component.css'
})
export class AnimeComponent implements OnInit, OnDestroy {
  private animeService = inject(AnimeService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private userLibraryService = inject(UserLibraryService);
  private destroy$ = new Subject<void>();
  public authService = inject(AuthService);
  private modalService = inject(NgbModal);
  libraryEntry$ = new BehaviorSubject<LibraryEntry | null>(null);
  anime$: Observable<Anime> = this.route.params
    .pipe(
      distinctUntilChanged(),
      mergeMap(params => this.animeService.getAnime(params['id'])),
      takeUntil(this.destroy$));
  currentTab$: Observable<string> = this.route.params
    .pipe(
      distinctUntilChanged(),
      map(params => params['tab'] || "summary"),
      takeUntil(this.destroy$));
  form = new FormGroup({
    episodeProgress: new FormControl(),
    rating: new FormControl(),
    status: new FormControl(),
  });
  favoriteAnime$ = new BehaviorSubject<boolean | null>(null);

  ngOnInit() {
    this.authService.currentUser$
      .pipe(
        switchMap(isLoggedIn => {
          if(isLoggedIn !== null) {
            return this.route.params.pipe(distinctUntilChanged());
          }
          return of(null);
        }),
        switchMap(params => {
          if(params !== null) {
            return this.userLibraryService.getLibraryEntry(params['id'])
          }
          return of(null);
        }),
        takeUntil(this.destroy$))
      .subscribe(res => this.populateFormFields(res));

    this.authService.currentUser$
      .pipe(
        switchMap(isLoggedIn => {
          if(isLoggedIn !== null) {
            return this.route.params.pipe(distinctUntilChanged());
          }
          return of(null);
        }),
        switchMap(params => {
          if(params !== null) {
            return this.userLibraryService.getFavoriteAnime(params['id'])
          }
          return of(null);
        }),
        takeUntil(this.destroy$))
      .subscribe((favoriteAnime) => {
        this.favoriteAnime$.next(favoriteAnime !== null);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private populateFormFields(res: LibraryEntry | null) {
    console.log(res);
    
    if(res === null) {
      this.libraryEntry$.next(null);
      return;
    }
    this.libraryEntry$.next(res);
    this.form.patchValue({"episodeProgress": res.episodesWatched});
    this.form.patchValue({"status": res.watchStatus});
    this.form.patchValue({"rating": res.userRating});
  }

  //Use Case: Watched all episodes, status = "completed"
  setAsCompleted = (anime: Anime) => {
    if(this.authService.currentUser$.value === null) {
      const signUpModalRef = this.modalService.open(SignUpComponent)
      signUpModalRef.componentInstance.name = "Sign In";
    }
    else {
      this.userLibraryService
        .createLibraryEntry(anime.id, "completed", anime.episodeCount!)
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => this.populateFormFields(res));
    }
  } 

  //Use Case: 0 episodes
  setAsPlanning = (anime: Anime) => {
    if(this.authService.currentUser$.value === null) {
      const signUpModalRef = this.modalService.open(SignUpComponent) //move to service?
      signUpModalRef.componentInstance.name = "Sign In";
    }
    else {
      this.userLibraryService
        .createLibraryEntry(anime.id, "planning", 0)
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => this.populateFormFields(res));
    }  
  } 

  //Use Case: 0 episodes. Don't assume user immediately watched the first episode.
  setAsWatching = (anime: Anime) => {
    if(this.authService.currentUser$.value === null) {
      const signUpModalRef = this.modalService.open(SignUpComponent)
      signUpModalRef.componentInstance.name = "Sign In";
    }
    else {
      this.userLibraryService
       .createLibraryEntry(anime.id, "watching", 0)
       .pipe(takeUntil(this.destroy$))
       .subscribe(res => this.populateFormFields(res));
    }
  } 

  onIncrementProgressClick(anime: Anime) {
    var currentProgress = this.episodeProgress?.value;
    if(currentProgress + 1 <= anime.episodeCount!) {
      this.episodeProgress?.patchValue(currentProgress + 1);
    }
  }

  saveLibraryEntryUpdates(anime: Anime) {
    const data = { //prolly need a dto for this
      id: this.libraryEntry$.value!.id,
      animeId: anime.id,
      episodesWatched: this.episodeProgress?.value,
      userRating: this.rating?.value,
      watchStatus: this.status?.value
    }

    this.userLibraryService.updateLibraryEntry(data).pipe(takeUntil(this.destroy$)).subscribe(res => this.libraryEntry$.next(res));
  }

  deleteEntry = (anime: Anime) => this.userLibraryService.deleteLibraryEntry(anime.id).pipe(takeUntil(this.destroy$)).subscribe(() => this.libraryEntry$.next(null));

  updateTab = (tab: string, animeId: number) => this.router.navigate([`/anime/${animeId}/${tab}`]);

  addToFavorites(anime: Anime) {
    if(this.authService.currentUser$.value === null) {
      const signUpModalRef = this.modalService.open(SignUpComponent)
      signUpModalRef.componentInstance.name = "Sign In";
    }
    else {
      this.userLibraryService.addToFavorites(anime);
      this.favoriteAnime$.next(true);
    }
  }

  removeFromFavorites(anime: Anime) {
    this.userLibraryService.removeAnimeFromFavorites(anime);
    this.favoriteAnime$.next(false);
  }

  /**FORM GETTERS */
  get episodeProgress() { return this.form.get("episodeProgress"); }

  get rating() { return this.form.get("rating"); }

  get status() { return this.form.get("status"); }

}
