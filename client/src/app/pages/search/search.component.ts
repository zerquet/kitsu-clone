import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Anime } from '../../shared/models/anime';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, filter, Observable, of, Subject, switchMap, take, takeUntil, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AnimeService } from '../../shared/services/anime.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { MAT_RIPPLE_GLOBAL_OPTIONS, MatRippleModule } from '@angular/material/core';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, MatSliderModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
  providers: [{provide: MAT_RIPPLE_GLOBAL_OPTIONS, useValue: {disabled: true}}]
})
export class SearchComponent implements OnDestroy { //TODO add variables solely for displaying current filter values, separate from observables.
  private destroy$ = new Subject<void>();
  private animeService = inject(AnimeService);
  minRatingPillValue = "5";
  maxRatingPillValue = "100";
  minYearPillValue = "1975";
  maxYearPillValue = "2025";
  minEpisodesPillValue = "1";
  maxEpisodesPillValue = "100";
  form = new FormGroup({ searchControl: new FormControl() });
  minRating$ = new BehaviorSubject("5");
  maxRating$ = new BehaviorSubject("100");
  minYear$ = new BehaviorSubject("1975");
  maxYear$ = new BehaviorSubject("2025");
  minEpisodes$ = new BehaviorSubject("1");
  maxEpisodes$ = new BehaviorSubject("100");
  term$ = new BehaviorSubject("");
  tvChecked$ = new BehaviorSubject(false);
  movieChecked$ = new BehaviorSubject(false);
  results$: Observable<Anime[]> = combineLatest([
    this.minRating$,
    this.maxRating$,
    this.minYear$,
    this.maxYear$,
    this.minEpisodes$,
    this.maxEpisodes$,
    this.tvChecked$,
    this.movieChecked$,
    this.term$
  ]).pipe(
    switchMap(() => this.getAdvancedResults()),
    takeUntil(this.destroy$)
  );

  ngOnInit(): void {
    this.form.controls["searchControl"].valueChanges
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        takeUntil(this.destroy$))
      .subscribe(term => this.term$.next(term.toLowerCase())); //tried putting valueChanges in combineLatest, but didn't work. so im subscribing to update the term observable.
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  updateMinYearPillValue = (event: Event) => this.minYearPillValue = (event.target as HTMLInputElement).value;

  updateMaxYearPillValue = (event: Event) => this.maxYearPillValue = (event.target as HTMLInputElement).value;

  updateMinRatingPillValue = (event: Event) => this.minRatingPillValue = (event.target as HTMLInputElement).value;

  updateMaxRatingPillValue = (event: Event) => this.maxRatingPillValue = (event.target as HTMLInputElement).value;

  updateMinEpisodesPillValue = (event: Event) => this.minEpisodesPillValue = (event.target as HTMLInputElement).value;

  updateMaxEpisodesPillValue = (event: Event) => this.maxEpisodesPillValue = (event.target as HTMLInputElement).value;

  //One method. Pass name of variable. Use array index notation (e.g. this["minRating"]) and reduce duplication. Methods 6 down to 1.
  getMinRating = (event: Event) => this.minRating$.next((event.target as HTMLInputElement).value);

  getMaxRating = (event: Event) => this.maxRating$.next((event.target as HTMLInputElement).value);
  
  getMinYear = (event: Event) => this.minYear$.next((event.target as HTMLInputElement).value)

  getMaxYear = (event: Event) => this.maxYear$.next((event.target as HTMLInputElement).value);

  getMinEpisodes = (event: Event) => this.minEpisodes$.next((event.target as HTMLInputElement).value);

  getMaxEpisodes = (event: Event) => this.maxEpisodes$.next((event.target as HTMLInputElement).value);

  toggleTv = () => this.tvChecked$.next(!this.tvChecked$.value);
  
  toggleMovie = () => this.movieChecked$.next(!this.movieChecked$.value);
  
  private getAdvancedResults(): Observable<Anime[]> {
    return this.animeService
      .advancedSearch(
        this.term$.value, 
        this.minYear$.value, 
        this.maxYear$.value, 
        this.minRating$.value, 
        this.maxRating$.value, 
        this.minEpisodes$.value, 
        this.maxEpisodes$.value, 
        this.tvChecked$.value, 
        this.movieChecked$.value);
  }
}
