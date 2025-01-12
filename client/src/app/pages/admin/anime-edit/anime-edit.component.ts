import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AnimeService } from '../../../shared/services/anime.service';
import { AppToastService } from '../../../shared/services/app-toast.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, filter, map, mergeMap, Observable, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { Anime } from '../../../shared/models/anime';
import { CategoryService } from '../../../shared/services/category.service';
import { Category } from '../../../shared/models/category';
import { Franchise } from '../../../shared/models/franchise';
import { FranchiseService } from '../../../shared/services/franchise.service';
import { Utils } from '../../../utils';
import { FloatLabel } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { Select } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputNumber } from 'primeng/inputnumber';
import { DatePicker } from 'primeng/datepicker';

@Component({
  selector: 'app-anime-edit',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FloatLabel, InputTextModule, TextareaModule, Select, MultiSelectModule, InputNumber, DatePicker],
  templateUrl: './anime-edit.component.html',
  styleUrl: './anime-edit.component.css'
})
export class AnimeEditComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private animeService = inject(AnimeService);
  private toastService = inject(AppToastService);
  private franchiseService = inject(FranchiseService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroy$ = new Subject<void>();
  form = new FormGroup({
    animeId: new FormControl<number | null>(null),
    title: new FormControl('', Validators.required),
    description: new FormControl(),
    image: new FormControl(),
    coverImage: new FormControl(),
    releaseStatus: new FormControl(),
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
  availableCategories$: Observable<any[]> = this.categoryService.getAvailableCategories();
  franchiseSearchTerm$ = new BehaviorSubject<string>("");
  franchiseList$ = combineLatest([this.franchiseSearchTerm$])
    .pipe(
      distinctUntilChanged(),
      map(([term]) => term),
      switchMap(term => this.searchFranchises(term)),
      takeUntil(this.destroy$))

  selectedFranchise: Franchise | null = null;
  show = false;
  airingStatuses = ['Finished', 'Airing', 'Upcoming'];
  mediaTypes = ['TV', 'Movie', 'ONA'];
  maturityRatings = ['PG', 'R'];

  ngOnInit() {
    this.route.params
      .pipe(
        distinctUntilChanged(),
        switchMap(params => this.animeService.getAnime(params['id'])),
        takeUntil(this.destroy$))
      .subscribe(res => {
        this.prefillform(res);
        this.selectedFranchise = res.franchiseId !== null && res.franchiseName !== null ? {id: res.franchiseId, name: res.franchiseName} : null; //send dto from api and assign as Franchise 
      })

      this.form.controls['franchiseSearch'].valueChanges
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
      .subscribe(res => this.franchiseSearchTerm$.next(res));
  }

  onSubmit() {
    const data = new FormData();
    data.append('id', this.animeId!.value!.toString());
    data.append('title', this.title!.value!);
    if(!Utils.IsNullOrUndefined(this.description!.value)) data.append('description', this.description?.value); 
    if(!Utils.IsNullOrUndefined(this.image!.value)) data.append('image', this.image!.value);
    if(!Utils.IsNullOrUndefined(this.coverImage!.value)) data.append('coverImage', this.coverImage!.value);
    if(!Utils.IsNullOrUndefined(this.year!.value)) data.append('year', this.year!.value!.toString()!);
    if(!Utils.IsNullOrUndefined(this.episodes!.value)) data.append('episodeCount', this.episodes!.value!.toString()!);
    if(!Utils.IsNullOrUndefined(this.mediaType!.value)) data.append('mediaType', this.mediaType!.value);
    if(!Utils.IsNullOrUndefined(this.score!.value)) data.append('score', this.score!.value!.toString()!);
    if(!Utils.IsNullOrUndefined(this.releaseStatus!.value)) data.append('releaseStatus', this.releaseStatus!.value);
    if (!Utils.IsNullOrUndefined(this.categories!.value)) {
      for(let i = 0; i < this.categories!.value.length; i++) {
        data.append('categories', this.categories!.value[i])
      }
    }
    if(!Utils.IsNullOrUndefined(this.englishTitle!.value)) data.append('englishTitle', this.englishTitle!.value);
    if(!Utils.IsNullOrUndefined(this.japaneseTitle!.value)) data.append('japaneseTitle', this.japaneseTitle!.value);
    if(!Utils.IsNullOrUndefined(this.japaneseRomaji!.value)) data.append('japaneseTitleRomaji', this.japaneseRomaji?.value);
    if(!Utils.IsNullOrUndefined(this.season!.value)) data.append('season', this.season!.value);
    if(!Utils.IsNullOrUndefined(this.startAirDate!.value)) data.append('startAirDate', this.startAirDate!.value.toLocaleDateString());
    if(!Utils.IsNullOrUndefined(this.endAirDate!.value)) data.append('endAirDate', this.endAirDate!.value.toLocaleDateString());
    if(!Utils.IsNullOrUndefined(this.rating!.value)) data.append('tvRating', this.rating!.value);
    if(!Utils.IsNullOrUndefined(this.episodeLength!.value)) data.append('episodeLength', this.episodeLength!.value);
    if(!Utils.IsNullOrUndefined(this.franchiseId!.value)) data.append('franchiseId', this.franchiseId!.value)
  
    this.animeService
      .updateAnime(data)
      .subscribe({
        next: () => {
          this.toastService.show('Success', `Updated '${this.title?.value}'.`)
          this.form.reset();
          this.goToParentPage();
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

  private searchFranchises(term: string): Observable<Franchise[]> {
    term = term.toLowerCase().trim();
    if(term.length === 0)
      return of([]);
    return this.franchiseService.getFranchisesByKeyword(term);
  }

  selectFranchise(franchise: Franchise) {
    this.selectedFranchise = franchise;
    this.form.patchValue({ franchiseId: franchise.id });
    this.show = false;
    this.franchiseSearchTerm$.next("");
  }

  deselectAnime() {
    this.selectedFranchise = null;
    this.form.patchValue({ franchiseId: '' }); //keep replicating from []
  }

  goToParentPage = () => this.router.navigate(['/admin'])

  private prefillform(res: Anime) {
    this.form.patchValue({
      animeId: res.id,
      title: res.title,
      description: res.description,
      releaseStatus: res.releaseStatus,
      categories: res.categories.map(x => x.id), //might need to use Id instead. I assume it's comparing [value] to see which are selected
      episodes: res.episodeCount,
      year: res.year,
      mediaType: res.mediaType,
      score: res.score,
      englishTitle: res.englishTitle,
      japaneseTitle: res.japaneseTitle,
      japaneseRomaji: res.japaneseTitleRomaji,
      season: res.season,
      startAirDate: res.startAirDate === null ? null : new Date(res.startAirDate),
      endAirDate: res.endAirDate === null ? null : new Date(res.endAirDate),
      rating: res.tvRating !== "null" ? res.tvRating : null,
      episodeLength: res.episodeLength
    });
  }

  //FORM GETTERS
  get animeId() { return this.form.get('animeId'); }
  
  get title() { return this.form.get('title'); }

  get description() { return this.form.get('description'); }

  get image() { return this.form.get('image'); }

  get releaseStatus() { return this.form.get('releaseStatus'); }

  get categories() { return this.form.get('categories'); }

  get coverImage() { return this.form.get('coverImage'); }
  get episodes() { return this.form.get('episodes'); }

  get mediaType() { return this.form.get('mediaType'); }

  get year() { return this.form.get('year'); }
  
  get score() { return this.form.get('score'); }

  get englishTitle() { return this.form.get('englishTitle'); }

  get japaneseTitle() { return this.form.get('japaneseTitle'); }

  get japaneseRomaji() { return this.form.get('japaneseRomaji'); }

  get season() { return this.form.get('season'); }

  get startAirDate() { return this.form.get('startAirDate'); }

  get endAirDate() { return this.form.get('endAirDate'); }

  get rating() { return this.form.get('rating'); }

  get episodeLength() { return this.form.get('episodeLength'); }

  get franchiseId() { return this.form.get('franchiseId'); }
}
