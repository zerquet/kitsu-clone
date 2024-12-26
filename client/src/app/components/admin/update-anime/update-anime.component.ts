import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AnimeService } from '../../../services/anime.service';
import { AppToastService } from '../../../services/app-toast.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, debounceTime, distinctUntilChanged, filter, mergeMap, Observable, of, switchMap, tap } from 'rxjs';
import { Anime } from '../../../interfaces/anime';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../interfaces/category';
import { Franchise } from '../../../interfaces/franchise';
import { FranchiseService } from '../../../services/franchise.service';
import { Utils } from '../../../utils';

@Component({
  selector: 'app-update-anime',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './update-anime.component.html',
  styleUrl: './update-anime.component.css'
})
export class UpdateAnimeComponent implements OnInit {
  private toastService = inject(AppToastService);
  private animeService = inject(AnimeService);
  private franchiseService = inject(FranchiseService);
  private categoryService = inject(CategoryService);
  private route = inject(ActivatedRoute);
  availableCategories$: Observable<Category[]> = this.categoryService.getAvailableCategories();
  selectedFranchise$ = new BehaviorSubject<Franchise | null>(null);
  form = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl(),
    image: new FormControl(),
    coverImage: new FormControl(),
    status: new FormControl(),
    categories: new FormControl(),
    episodes: new FormControl<number | null>(null, Validators.pattern("[0-9]*")),
    year: new FormControl<number | null>(null, Validators.pattern("[0-9]*")),
    mediaType: new FormControl(),
    score: new FormControl<number | null>(null, Validators.pattern("[0-9]*")),
    englishTitle: new FormControl(),
    japaneseTitle: new FormControl(),
    japaneseRomaji: new FormControl(),
    season: new FormControl(),
    startAirDate: new FormControl(),
    endAirDate: new FormControl(),
    rating: new FormControl(),
    episodeLength: new FormControl(),
    franchiseSearch: new FormControl(),
    franchiseId: new FormControl()
  });
  currentAnimeId: string = "";
  searchResults: Franchise[] = [];
  shown = false;
  currentFranchise: string | null = "";

  ngOnInit() {
    this.route.params
      .pipe(
        distinctUntilChanged(),
        mergeMap(params => this.animeService.getAnime(params['id'])))
      .subscribe(res => {
        this.currentAnimeId = res.id.toString();
        this.prefillform(res);
        this.currentFranchise = res.franchiseName;
      })

    this.form.controls['franchiseSearch'].valueChanges
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
            return this.franchiseService.getFranchises(term)
          else 
            return of([]);
        }))
      .subscribe(res => {
        this.searchResults = res;
        this.shown = res.length > 0 ? true : false;
      }); 
  }

  onSubmit() {
    const data = new FormData();
    data.append('id', this.currentAnimeId);
    data.append('title', this.title!.value!);
    if(!Utils.IsNullOrUndefined(this.description!.value)) data.append('description', this.description?.value); 
    if(!Utils.IsNullOrUndefined(this.image!.value)) data.append('image', this.image!.value);
    if(!Utils.IsNullOrUndefined(this.coverImage!.value)) data.append('coverImage', this.coverImage!.value);
    if(!Utils.IsNullOrUndefined(this.year!.value)) data.append('year', this.year!.value!.toString()!);
    if(!Utils.IsNullOrUndefined(this.episodes!.value)) data.append('episodeCount', this.episodes!.value!.toString()!);
    if(!Utils.IsNullOrUndefined(this.mediaType!.value)) data.append('mediaType', this.mediaType!.value);
    if(!Utils.IsNullOrUndefined(this.score!.value)) data.append('score', this.score!.value!.toString()!);
    if(!Utils.IsNullOrUndefined(this.status!.value)) data.append('releaseStatus', this.status!.value);
    if (!Utils.IsNullOrUndefined(this.categories!.value)) {
      for(let i = 0; i < this.categories!.value.length; i++) {
        data.append('categories', this.categories!.value[i])
      }
    }
    if(!Utils.IsNullOrUndefined(this.englishTitle!.value)) data.append('englishTitle', this.englishTitle!.value);
    if(!Utils.IsNullOrUndefined(this.japaneseTitle!.value)) data.append('japaneseTitle', this.japaneseTitle!.value);
    if(!Utils.IsNullOrUndefined(this.japaneseRomaji!.value)) data.append('japaneseTitleRomaji', this.japaneseRomaji?.value);
    if(!Utils.IsNullOrUndefined(this.season!.value)) data.append('season', this.season!.value);
    if(!Utils.IsNullOrUndefined(this.startAirDate!.value)) data.append('startAirDate', this.startAirDate!.value);
    if(!Utils.IsNullOrUndefined(this.endAirDate!.value)) data.append('endAirDate', this.endAirDate!.value);
    if(!Utils.IsNullOrUndefined(this.rating!.value)) data.append('tvRating', this.rating!.value);
    if(!Utils.IsNullOrUndefined(this.episodeLength!.value)) data.append('episodeLength', this.episodeLength!.value);
    if(!Utils.IsNullOrUndefined(this.franchiseId!.value)) data.append('franchiseId', this.franchiseId!.value)
  
    this.animeService
      .updateAnime(data)
      .subscribe({
        next: () => {
          this.toastService.show('Success', `Updated '${this.title?.value}'.`)
          this.form.reset();
          this.currentFranchise = this.selectedFranchise$.value?.name!;
        },
        error: () => {
          this.toastService.show('Error', 'Something went wrong. Check logs for more details.')
        }
      });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    this.form.patchValue({image: file});
  }

  onCoverImagePicked(event: Event) {
    const coverFile = (event.target as HTMLInputElement).files![0];
    this.form.patchValue({coverImage: coverFile});
  }

  clearStatus() {
    this.status?.reset();
  }
  
  clearCategories() {
    this.categories?.reset();
  }

  selectFranchise(franchise: Franchise) {
    this.selectedFranchise$.next(franchise);
    this.form.patchValue({ franchiseId: franchise.id });
    this.searchResults = [];
    this.shown = false;
  }

  deselectAnime() {
    this.selectedFranchise$.next(null);
    this.form.patchValue({ franchiseId: '' }); //keep replicating from []
  }

  private prefillform(res: Anime) {
    this.form.patchValue({
      title: res.title,
      description: res.description,
      status: res.releaseStatus,
      categories: res.categories.map(x => x.id), //might need to use Id instead. I assume it's comparing [value] to see which are selected
      episodes: res.episodeCount,
      year: res.year,
      mediaType: res.mediaType,
      score: res.score,
      englishTitle: res.englishTitle,
      japaneseTitle: res.japaneseTitle,
      japaneseRomaji: res.japaneseTitleRomaji,
      season: res.season,
      startAirDate: res.startAirDate === null ? null : new Date(res.startAirDate).toISOString().split('T')[0],
      endAirDate: res.endAirDate === null ? null : new Date(res.endAirDate).toISOString().split('T')[0],
      rating: res.tvRating !== "null" ? res.tvRating : null,
      episodeLength: res.episodeLength
    });
  }

  //getters so we can use in form control in template
  get title() {
    return this.form.get('title');
  }

  get description() {
    return this.form.get('description');
  }

  get image() {
    return this.form.get('image');
  }

  get status() {
    return this.form.get('status');
  }

  get categories() {
    return this.form.get('categories');
  }

  get coverImage() {
    return this.form.get('coverImage');
  }
  get episodes() {
    return this.form.get('episodes');
  }

  get mediaType() {
    return this.form.get('mediaType');
  }

  get year() {
    return this.form.get('year');
  }
  
  get score() {
    return this.form.get('score');
  }

  get englishTitle() {
    return this.form.get('englishTitle');
  }

  get japaneseTitle() {
    return this.form.get('japaneseTitle');
  }

  get japaneseRomaji() {
    return this.form.get('japaneseRomaji');
  }

  get season() {
    return this.form.get('season');
  }

  get startAirDate() {
    return this.form.get('startAirDate');
  }

  get endAirDate() {
    return this.form.get('endAirDate');
  }

  get rating() {
    return this.form.get('rating');
  }

  get episodeLength() {
    return this.form.get('episodeLength');
  }

  get franchiseId() {
    return this.form.get('franchiseId');
  }
}
