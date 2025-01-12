import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, filter, map, Observable, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { AnimeService } from '../../../shared/services/anime.service';
import { Router, RouterLink } from '@angular/router';
import { Anime } from '../../../shared/models/anime';
import { AppToastService } from '../../../shared/services/app-toast.service';
import { EpisodeService } from '../../../shared/services/episode.service';
import { Episode } from '../../../shared/models/episode';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-episode-add',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgClass, AsyncPipe, FloatLabelModule, InputTextModule, InputNumberModule, TextareaModule, DatePickerModule],
  templateUrl: './episode-add.component.html',
  styleUrl: './episode-add.component.css'
})
export class EpisodeAddComponent implements OnInit {
  private animeService = inject(AnimeService);
  private toastService = inject(AppToastService);
  private episodeService = inject(EpisodeService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();
  form: FormGroup = new FormGroup({
    animeId: new FormControl('', [Validators.required, Validators.pattern('[0-9]*')]),
    matchingAnime: new FormControl(),
    epNumber: new FormControl(null, Validators.pattern('[0-9]*')),
    title: new FormControl(),
    description: new FormControl(),
    airDate: new FormControl(),
    japaneseTitle: new FormControl(),
  });
  animeSearchTerm$ = new BehaviorSubject<string>("");
  animeResults$ = combineLatest([this.animeSearchTerm$])
  .pipe(
    distinctUntilChanged(),
    map(([term]) => term),
    switchMap(term => this.searchAnimes(term)),
    takeUntil(this.destroy$))
  selectedAnime: Anime | null = null;
  show = false;

  ngOnInit(): void {
    this.form.controls['matchingAnime'].valueChanges
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
      .subscribe(res => this.animeSearchTerm$.next(res));
  }
  

  onSubmit() {
    const dto = {
      id: null,
      animeId: this.animeId?.value,
      number: this.epNumber?.value,
      title: this.title?.value,
      description: this.description?.value,
      airDate: null,
      airDate2: new Date(this.airDate?.value),
      japaneseTitle: this.japaneseTitle?.value,
      //Create another dto to create episode? Setting to 0 but API will ignore. 
    }

    this.episodeService.addEpisode(dto).subscribe({
      next: () => {
        this.toastService.show('Success', `Added episode '${this.epNumber?.value}' for '${this.selectedAnime!.title}' to the database.`);
        this.form.reset();
        this.deselectAnime();
        this.goToParentPage();
      },
      error: () => {
        this.toastService.show('Failed to add episode', 'Something went wrong');
      }
    });
  }

  private searchAnimes(term: string): Observable<Anime[]> {
    term = term.toLowerCase().trim();
    if(term.length === 0)
      return of([]);
    return this.animeService.miniSearch(term);
  }

  selectAnimeForEpisodeAddition(anime: Anime) {
    this.selectedAnime = anime;
    this.form.patchValue({ animeId: anime.id });
    this.show = false;
    this.animeSearchTerm$.next("");
    
  }

  deselectAnime() {
    this.selectedAnime = null;
    this.form.patchValue({ animeId: '' });
  }

  goToParentPage = () => this.router.navigate(['/admin/episode'])


  //FORM GETTERS 
  get animeId() { return this.form.get('animeId'); }

  get epNumber() { return this.form.get('epNumber'); }

  get title() { return this.form.get('title'); }

  get description() { return this.form.get('description'); }

  get airDate() { return this.form.get('airDate'); }

  get japaneseTitle() { return this.form.get('japaneseTitle'); }
}
