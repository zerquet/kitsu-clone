import { Component, OnInit } from '@angular/core';
import { AnimeService } from '../services/anime.service';
import { debounceTime, distinctUntilChanged, filter, map, mergeMap, Observable, of, OperatorFunction, Subject, switchMap, takeLast, tap } from 'rxjs';
import { Anime } from '../interfaces/anime';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Form, FormControl, FormGroup, FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  animes: Observable<Anime[]>;
  showCardTitle: number;
  list: Anime[];
  form: FormGroup;
  shown = false;
  constructor(private animeService: AnimeService) {
    this.animes = this.animeService.getAnimes();
    this.showCardTitle = 0;
    this.list = [];
    this.form = new FormGroup(
      {
        searchControl:  new FormControl()
      }
    )
  }

  ngOnInit(): void {
    this.form.controls['searchControl'].valueChanges
    .pipe(
      debounceTime(400),
      distinctUntilChanged(),
      tap(value => {
        if (!value || value.trim().length === 0) {
          // Directly clear results if input is empty or whitespace
          this.list = [];
          this.shown = false;
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
    .subscribe(res => {
      this.list = res;
      this.shown = res.length > 0 ? true : false;
    }); 
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
