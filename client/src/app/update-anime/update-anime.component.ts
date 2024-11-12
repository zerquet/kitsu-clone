import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AnimeService } from '../services/anime.service';
import { AppToastService } from '../services/app-toast.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { distinctUntilChanged, mergeMap, Observable } from 'rxjs';
import { Anime } from '../interfaces/anime';

@Component({
  selector: 'app-update-anime',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './update-anime.component.html',
  styleUrl: './update-anime.component.css'
})
export class UpdateAnimeComponent {
  form: FormGroup;
  id: string = "";

  constructor(private animeService: AnimeService, private toastService: AppToastService, private route: ActivatedRoute) {
    this.form = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl(),
      image: new FormControl(),
      coverImage: new FormControl(),
      status: new FormControl(),
      genres: new FormControl(),
      episodes: new FormControl('', Validators.pattern("[0-9]*")),
      year: new FormControl('', Validators.pattern("[0-9]*")),
      mediaType: new FormControl(),
      score: new FormControl('', Validators.pattern("[0-9]*"))
    });
    this.route.params.pipe(
      distinctUntilChanged(),
      mergeMap(params => this.animeService.getAnime(params['id']))
    ).subscribe(anime => {
      this.id = anime.id.toString();
      this.form.patchValue({
        title: anime.title,
        description: anime.description,
        genres: anime.genres,
        episodes: anime.episodes,
        year: anime.year,
        mediaType: anime.mediaType,
        score: anime.score
      });
    })
    
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('id', this.id);
    formData.append('title', this.title?.value!);
    formData.append('description', this.description?.value!); 
    formData.append('image', this.image?.value);
    formData.append('coverImage', this.coverImage?.value);
    formData.append('year', this.year?.value);
    formData.append('episodes', this.episodes?.value);
    formData.append('mediaType', this.mediaType?.value);
    formData.append('score', this.score?.value);
    if (this.status?.value != null) {
      for(let i = 0; i < this.status?.value.length; i++) {
        formData.append('status', this.status?.value[i]);
      }
    }
    if (this.genres?.value != null) {
      for(let i = 0; i < this.genres?.value.length; i++) {
        formData.append('genres', this.genres?.value[i])
      }
    }
  
    this.animeService.updateAnime(formData).subscribe({
      next: () => {
        this.toastService.show('Success', `Updated '${this.title?.value}'.`)
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

  get status() {
    return this.form.get('status');
  }

  get genres() {
    return this.form.get('genres');
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
}
