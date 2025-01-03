import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AnimeService } from '../../shared/services/anime.service';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, filter, map, mergeMap, Observable, of, OperatorFunction, Subject, switchMap, take, takeLast, takeUntil, tap } from 'rxjs';
import { Anime } from '../../shared/models/anime';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Form, FormControl, FormGroup, FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoryService } from '../../shared/services/category.service';
import { Category } from '../../shared/models/category';
import { SearchResultsComponent } from '../../shared/components/search-results/search-results.component';
import { AnimeTooltipComponent } from '../../shared/components/anime-tooltip/anime-tooltip.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule, SearchResultsComponent, AnimeTooltipComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private categoryService = inject(CategoryService);
  private animeService = inject(AnimeService);
  private route = inject(ActivatedRoute);
  categories$: Observable<Category[]> = this.categoryService.getAvailableCategories();
  term$ = new BehaviorSubject<string>("");
  activeAnimeId = 0;
  show = false;
  showTooltipCallback: any;
  form = new FormGroup({ searchControl: new FormControl() });

  currCategory$ = this.route.params
    .pipe(
      distinctUntilChanged(),
      switchMap(params => {
        if(params["category"])
          return this.categoryService.getCategory(params["category"]);
        else
          return of(undefined);
        }),
      takeUntil(this.destroy$));

  animes$: Observable<Anime[]> = this.route.params
    .pipe(
      distinctUntilChanged(),
      switchMap(params => {
        if(params["category"])
          return this.animeService.getAnimesByCategory(params["category"]);
        else
          return this.animeService.getAnimes();
      }),
      takeUntil(this.destroy$));

  //why cant i just use this.term$ here? why do i need to use combineLatest? this.term$ just returns the first char
  searchResults$: Observable<Anime[]> = combineLatest([this.term$]) 
    .pipe(
      map(([term]) => term),
      switchMap(term => this.search(term)),
      takeUntil(this.destroy$));

  ngOnInit(): void {
    this.form.controls['searchControl'].valueChanges
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap(term => {
          if(term && term.trim().length > 0)
            this.show = true;
          else 
            this.show = false;
        }),
        takeUntil(this.destroy$))
      .subscribe(term => this.term$.next(term));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private search(term: string): Observable<Anime[]> {
    term = term.toLowerCase().trim();
    if(term.length === 0)
      return of([]);
    return this.animeService.miniSearch(term);
  }

  onAnimePosterHover(id: number): void {
    this.showTooltipCallback = setTimeout(() => {
      this.activeAnimeId = id;
    }, 300);
  }

  onAnimePosterHoverOut(): void {
    if(this.showTooltipCallback) {
      clearTimeout(this.showTooltipCallback);
      this.activeAnimeId = 0;
    }
  }
}
