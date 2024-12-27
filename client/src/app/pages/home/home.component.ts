import { Component, inject, OnInit } from '@angular/core';
import { AnimeService } from '../../shared/services/anime.service';
import { BehaviorSubject, debounceTime, distinctUntilChanged, filter, map, mergeMap, Observable, of, OperatorFunction, Subject, switchMap, takeLast, tap } from 'rxjs';
import { Anime } from '../../shared/models/anime';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Form, FormControl, FormGroup, FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoryService } from '../../shared/services/category.service';
import { Category } from '../../shared/models/category';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private animeService: AnimeService = inject(AnimeService);
  private route = inject(ActivatedRoute);
  categoryWasGiven$ = new BehaviorSubject<boolean>(false);
  currCategory$ = new BehaviorSubject<Category | undefined>(undefined);
  categories$: Observable<Category[]> = this.categoryService.getAvailableCategories();
  animes$: Observable<Anime[]> = this.route.params
    .pipe(
      distinctUntilChanged(),
      mergeMap(params => {
        if(params["category"]){
          this.categoryWasGiven$.next(true);
          return this.animeService.getAnimesByCategory(params["category"]);
        }
        else {
          this.categoryWasGiven$.next(false);
          return this.animeService.getAnimes();
        } 
      })
    );
  activeAnimeId = 0;
  searchResults: Anime[] = [];
  shown = false;
  form = new FormGroup({
    searchControl: new FormControl()
  });

  ngOnInit(): void {
    this.form.controls['searchControl'].valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        tap(value => {
          if (!value || value.trim().length === 0) {
            // Directly clear results if input is empty or whitespace
            this.searchResults = [];
            this.shown = false;
          }
        }),
        filter(term => term && term.trim().length > 2),
        switchMap(term => {
          if(term && term.trim().length > 2)
            return this.animeService.miniSearch(term)
          else 
            return of([]);
        }))
      .subscribe(res => {
        this.searchResults = res;
        this.shown = res.length > 0 ? true : false;
      }); 

    this.route.params
      .pipe(
        distinctUntilChanged(),
        mergeMap(params => this.categoryService.getCategory(params["category"])))
      .subscribe(res => this.currCategory$.next(res));
  }

  search(term: string): Observable<Anime[]> {
    term = term.toLowerCase().trim();
    if(term === "" || term === null || term === undefined) {
      this.shown = false;
      return new Observable<Anime[]>()
    }
    else {
      return this.animeService.miniSearch(term);
    }
  }
}
