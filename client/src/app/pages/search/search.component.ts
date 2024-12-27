import { Component, OnInit } from '@angular/core';
import { Anime } from '../../shared/models/anime';
import { debounceTime, distinctUntilChanged, filter, Observable, of, switchMap, tap } from 'rxjs';
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
export class SearchComponent implements OnInit {
  results: Observable<Anime[]>;
  allResults: Observable<Anime[]>;
  form: FormGroup;
  minRating = "5";
  maxRating = "100";
  minYear = "1975";
  maxYear = "2025";
  minEpisodes = "1";
  maxEpisodes = "100";
  term: string = "";
  tvChecked = false;
  movieChecked = false;

  constructor(private animeService: AnimeService) {
    this.results = this.animeService.getAnimes();
    this.allResults = this.results;
    this.form = new FormGroup({
      searchControl: new FormControl()
    });
  }

  ngOnInit(): void {
      this.form.controls["searchControl"].valueChanges.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap(term => {
          this.term = term;
          if (!term || term.trim().length === 0) {
            // Directly clear results if input is empty or whitespace
            //this.results = this.allResults;
            this.getAdvancedResults();
          }
        }),
        filter(term => term && term.trim().length > 2),
        switchMap(term => {
          if(term && term.trim().length > 2) {
            return this.animeService.miniSearch(term)
          } 
          else {
            return of([]);
          }
        })
      )
      .subscribe(res => this.results = of(res));
  }
  //One method. Pass name of variable. Use array index notation (e.g. this["minRating"]) and reduce duplication. Methods 6 down to 1.
  getMinRating(event: Event) {
    this.minRating = (event.target as HTMLInputElement).value;
  }

  getMaxRating(event: Event) {
    this.maxRating = (event.target as HTMLInputElement).value;
  }

  getMinYear(event: Event) {
    this.minYear = (event.target as HTMLInputElement).value;
  }

  getMaxYear(event: Event) {
    this.maxYear = (event.target as HTMLInputElement).value;
  }

  getMinEpisodes(event: Event) {
    this.minEpisodes = (event.target as HTMLInputElement).value;
  }

  getMaxEpisodes(event: Event) {
    this.maxEpisodes = (event.target as HTMLInputElement).value;
  }

  getAdvancedResults() {
    this.results = this.animeService.advancedSearch(
      this.term, this.minYear, this.maxYear, this.minRating, this.maxRating, this.minEpisodes, this.maxEpisodes, this.tvChecked, this.movieChecked);
  }

  toggleTv() {
    this.tvChecked = !this.tvChecked;
    this.getAdvancedResults();
  }

  toggleMovie() {
    this.movieChecked = !this.movieChecked;
    this.getAdvancedResults();
  }
}
