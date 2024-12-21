import { Component, inject } from '@angular/core';
import { AnimeService } from '../../../services/anime.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { AppToastService } from '../../../services/app-toast.service';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-add-anime',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-anime.component.html',
  styleUrl: './add-anime.component.css'
})
export class AddAnimeComponent {
  categoryService = inject(CategoryService);
  availableCategories$ = this.categoryService.getAvailableCategories();
  form: FormGroup;

  constructor(private animeService: AnimeService, private toastService: AppToastService) {
    this.form = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl(),
      image: new FormControl('', Validators.required),
      coverImage: new FormControl(''),
      status: new FormControl(),
      genres: new FormControl(),
      episodes: new FormControl('', Validators.pattern("[0-9]*")),
      year: new FormControl('', Validators.pattern("[0-9]*")),
      mediaType: new FormControl(),
      score: new FormControl('', Validators.pattern("[0-9]*")),
      englishTitle: new FormControl(''),
      japaneseTitle: new FormControl(''),
      japaneseRomaji: new FormControl(''),
      season: new FormControl(''),
      startAirDate: new FormControl(),
      endAirDate: new FormControl(),
      rating: new FormControl(''),
      episodeLength: new FormControl(0)
    });
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('title', this.title?.value!);
    formData.append('description', this.description?.value!); 
    formData.append('image', this.image?.value);
    formData.append('coverImage', this.coverImage?.value);
    formData.append('year', this.year?.value);
    formData.append('episodes', this.episodes?.value);
    formData.append('mediaType', this.mediaType?.value);
    formData.append('score', this.score?.value);
    formData.append('status', this.status?.value);
    if (this.genres?.value != null) {
      for(let i = 0; i < this.genres?.value.length; i++) {
        formData.append('genres', this.genres?.value[i])
      }
    }
    formData.append('englishTitle', this.englishTitle?.value);
    formData.append('japaneseTitle', this.japaneseTitle?.value);
    formData.append('japaneseTitleRomaji', this.japaneseRomaji?.value);
    formData.append('season', this.season?.value);
    if(this.startAirDate?.value !== undefined)
      formData.append('startAirDate', this.startAirDate?.value);
    if(this.endAirDate?.value !== undefined)
      formData.append('endAirDate', this.endAirDate?.value);
    formData.append('rating', this.rating?.value);
    formData.append('episodeLength', this.episodeLength?.value);
    //ASP.NET Core (or any api that supports it) will read multiple assignments to the 'status' variable as an array of values, which is the expected data type. 
    //Ref: https://stackoverflow.com/a/9547490/20829897 & https://stackoverflow.com/a/28434829/20829897
    
    this.animeService.addAnime(formData).subscribe({
      next: () => {
        this.toastService.show('Success', `Added '${this.title?.value}' to the database.`)
        this.form.reset();
      },
      error: (error) => {
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
  clearGenres() {
    this.genres?.reset();
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

  get coverImage() {
    return this.form.get('coverImage');
  }

  get status() {
    return this.form.get('status');
  }

  get genres() {
    return this.form.get('genres');
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
}
