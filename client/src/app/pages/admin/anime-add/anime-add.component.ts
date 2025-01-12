import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AnimeService } from '../../../shared/services/anime.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { AppToastService } from '../../../shared/services/app-toast.service';
import { CategoryService } from '../../../shared/services/category.service';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, filter, map, Observable, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { Category } from '../../../shared/models/category';
import { Utils } from '../../../utils';
import { Franchise } from '../../../shared/models/franchise';
import { FranchiseService } from '../../../shared/services/franchise.service';
import { FloatLabel } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { Select } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputNumber } from 'primeng/inputnumber';
import { DatePicker } from 'primeng/datepicker';
import { Router } from '@angular/router';

@Component({
  selector: 'app-anime-add',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FloatLabel, InputTextModule, TextareaModule, Select, MultiSelectModule, InputNumber, DatePicker],
  templateUrl: './anime-add.component.html',
  styleUrl: './anime-add.component.css'
})
export class AnimeAddComponent implements OnInit, OnDestroy {
  private categoryService = inject(CategoryService);
  private animeService = inject(AnimeService);
  private toastService = inject(AppToastService);
  private franchiseService = inject(FranchiseService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();
  form = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl(),
    image: new FormControl<File | null>(null, Validators.required),
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

  ngOnInit(): void {
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

  ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
  }

  onSubmit() {
    debugger;
    const data = new FormData();
    data.append('title', this.title!.value!);
    if(!Utils.IsNullOrUndefined(this.description!.value)) data.append('description', this.description!.value);
    //TODO see if I can upload image from frontend. Currently sends to server and server uploads to frontend folder. same with coverImage. check update-anime as well.
    data.append('image', this.image!.value!); 
    if(!Utils.IsNullOrUndefined(this.coverImage!.value)) data.append('coverImage', this.coverImage!.value);
    if(!Utils.IsNullOrUndefined(this.year!.value)) data.append('year', this.year!.value!.toString()!);
    if(!Utils.IsNullOrUndefined(this.episodes!.value)) data.append('episodeCount', this.episodes!.value!.toString()!);
    if(!Utils.IsNullOrUndefined(this.mediaType!.value)) data.append('mediaType', this.mediaType!.value);
    if(!Utils.IsNullOrUndefined(this.score!.value)) data.append('score', this.score!.value!.toString()!);
    if(!Utils.IsNullOrUndefined(this.releaseStatus!.value)) data.append('releaseStatus', this.releaseStatus!.value);
    if (!Utils.IsNullOrUndefined(this.categories!.value)) { //think about id vs name for categories in add-anime and update-anime. wtf use id???
      for(let i = 0; i < this.categories!.value.length; i++) {
        data.append('categories', this.categories!.value[i])
      }
    }
    if(!Utils.IsNullOrUndefined(this.englishTitle!.value)) data.append('englishTitle', this.englishTitle!.value);
    if(!Utils.IsNullOrUndefined(this.japaneseTitle!.value)) data.append('japaneseTitle', this.japaneseTitle!.value);
    if(!Utils.IsNullOrUndefined(this.japaneseRomaji!.value)) data.append('japaneseTitleRomaji', this.japaneseRomaji!.value);
    if(!Utils.IsNullOrUndefined(this.season!.value)) data.append('season', this.season!.value);
    if(!Utils.IsNullOrUndefined(this.startAirDate!.value)) data.append('startAirDate', this.startAirDate!.value.toLocaleDateString());
    if(!Utils.IsNullOrUndefined(this.endAirDate!.value)) data.append('endAirDate', this.endAirDate!.value.toLocaleDateString());
    if(!Utils.IsNullOrUndefined(this.rating!.value)) data.append('tvRating', this.rating!.value);
    if(!Utils.IsNullOrUndefined(this.episodeLength!.value)) data.append('episodeLength', this.episodeLength!.value.toString()!);
    if(!Utils.IsNullOrUndefined(this.franchiseId!.value)) data.append('franchiseId', this.franchiseId!.value)
    //ASP.NET Core (or any api that supports it) will read multiple assignments to the 'status' variable as an array of values, which is the expected data type. 
    //Ref: https://stackoverflow.com/a/9547490/20829897 & https://stackoverflow.com/a/28434829/20829897
    
    this.animeService
      .addAnime(data)
      .subscribe({
        next: () => {
          this.toastService.show('Success', `Added '${this.title?.value}' to the database.`)
          this.form.reset();
          this.goToParentPage();
        },
        error: () => {
          this.toastService.show('Error', 'Something went wrong. Check logs for more details.');
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

  //FORM GETTERS
  get title() { return this.form.get('title'); }

  get description() { return this.form.get('description'); }

  get image() { return this.form.get('image'); }

  get coverImage() { return this.form.get('coverImage'); }

  get releaseStatus() { return this.form.get('releaseStatus'); }

  get categories() { return this.form.get('categories'); }

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
