import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Anime } from '../../interfaces/anime';
import { AnimeService } from '../../services/anime.service';
import { BehaviorSubject, debounceTime, distinctUntilChanged, filter, mergeMap, Observable, of, switchMap, tap } from 'rxjs';
import { CategoryService } from '../../services/category.service';
import { CategoryDto } from '../../interfaces/categoryDto';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, RouterLink, AsyncPipe, NgIf],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css',
})
export class CategoryComponent {
  private animeService = inject(AnimeService);
  private categoryService = inject(CategoryService);
  categories$ = this.categoryService.getAvailableCategories(); //#Todo: Add list to data service class to reduce API calls? think about
  private route = inject(ActivatedRoute);
  animes$ = this.route.params.pipe(
    distinctUntilChanged(),
    mergeMap(params => this.animeService.getAnimesByCategory(params["category"]))
  );
  form = new FormGroup({
    searchControl: new FormControl(),
  });
  showCardTitle = 0;
  list: Anime[] = [];
  shown = false;
  currCategory$ = new BehaviorSubject<CategoryDto | undefined>(undefined);

  ngOnInit(): void {
    this.form.controls['searchControl'].valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        tap((value) => {
          if (!value || value.trim().length === 0) {
            // Directly clear results if input is empty or whitespace
            this.list = [];
            this.shown = false;
          }
        }),
        filter((term) => term && term.trim().length > 2),
        switchMap((term) => {
          if (term && term.trim().length > 2) {
            return this.animeService.miniSearch(term);
          } else {
            return of([]);
          }
        })
      )
      .subscribe((res) => {
        this.list = res;
        this.shown = res.length > 0 ? true : false;
      });
    
    this.route.params.pipe(
      distinctUntilChanged(),
      mergeMap(params => this.categoryService.getCategory(params["category"]))
    ).subscribe(res => this.currCategory$.next(res))
  }

  search(term: string): Observable<Anime[]> {
    term = term.toLowerCase().trim();
    if (term === '' || term === null || term === undefined) {
      this.shown = false;
      return new Observable<Anime[]>();
    } else {
      return this.animeService.miniSearch(term);
    }
  }
}
