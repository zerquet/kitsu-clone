import { NgClass, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject, debounceTime, distinctUntilChanged, filter, of, switchMap, tap } from 'rxjs';
import { AnimeService } from '../../../services/anime.service';
import { RouterLink } from '@angular/router';
import { Anime } from '../../../interfaces/anime';
import { AppToastService } from '../../../services/app-toast.service';
import { EpisodeService } from '../../../services/episode.service';
import { Episode } from '../../../interfaces/episode';

@Component({
  selector: 'app-add-episode',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgClass, RouterLink],
  templateUrl: './add-episode.component.html',
  styleUrl: './add-episode.component.css'
})
export class AddEpisodeComponent implements OnInit {
  private animeService = inject(AnimeService);
  private toastService = inject(AppToastService);
  private episodeService = inject(EpisodeService);
  form: FormGroup = new FormGroup({
    animeId: new FormControl('', [Validators.required, Validators.pattern('[0-9]*')]),
    epNumber: new FormControl('', Validators.pattern('[0-9]*')),
    title: new FormControl(),
    description: new FormControl(),
    airDate: new FormControl(),
    japaneseTitle: new FormControl(),
    matchingAnime: new FormControl()
  });
  selectedAnime$ = new BehaviorSubject<Anime | null>(null);

  list: any[] = [];
  shown = false;

  ngOnInit(): void {
      this.form.controls['matchingAnime'].valueChanges
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
  

  onSubmit() {
    const dto: Episode = {
      animeId: this.animeId?.value,
      number: this.epNumber?.value,
      title: this.title?.value,
      description: this.description?.value,
      airDate: this.airDate?.value,
      japaneseTitle: this.japaneseTitle?.value,
       //Create another dto to create episode? Setting to 0 but API will ignore. 
    }

    this.episodeService.addEpisode(dto).subscribe({
      next: () => {
        this.toastService.show('Success', `Added episode '${this.epNumber?.value}' for '${this.selectedAnime$.value?.title}' to the database.`);
        this.form.reset();
        this.deselectAnime();
        //what else?
      },
      error: () => {
        this.toastService.show('Failed to add episode', 'Something went wrong');
      }
    });
  }

  selectAnimeForEpisodeAddition(anime: Anime) {
    this.selectedAnime$.next(anime);
    this.form.patchValue({ animeId: anime.id });
    this.list = [];
    this.shown = false;
    
  }

  deselectAnime() {
    this.selectedAnime$.next(null);
    this.form.patchValue({ animeId: '' });
  }

  //FORM GETTERS 

  get animeId() {
    return this.form.get('animeId');
  }

  get epNumber() {
    return this.form.get('epNumber');
  }

  get title() {
    return this.form.get('title');
  }

  get description() {
    return this.form.get('description');
  }

  get airDate() {
    return this.form.get('airDate');
  }

  get japaneseTitle() {
    return this.form.get('japaneseTitle');
  }
}
