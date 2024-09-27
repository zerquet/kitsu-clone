import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Anime } from 'src/app/models/anime.model';
import { AnimeService } from 'src/app/services/anime.service';

@Component({
  selector: 'app-update-anime',
  templateUrl: 'modify-anime.component.html',
  styleUrls: ['modify-anime.component.css']
})
export class ModifyAnimeComponent implements OnInit {
  animes$ = new BehaviorSubject<Anime[]>([]);
  updateForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl(),
    image: new FormControl(),
    status: new FormControl()
  }); //need to style template and hookup service, then add library UI?
  response: string = "";
  responseMsg: string = "";
  constructor(private animeService: AnimeService ) {
    
  }
  ngOnInit(): void {
      this.animeService.getAll()
      .subscribe((response) => {
        this.animes$.next(response);
      });
  }

  onSubmit() {
    console.log(this.status?.value);
    return;
    const formData = new FormData();
    formData.append('title', this.title?.value!);
    formData.append('description', this.description?.value!); 
    formData.append('image', this.image?.value);
    for(let i = 0; i < this.status?.value.length; i++) {
      formData.append('status', this.status?.value[i]);
    }
    
    // this.animeService.post(formData).subscribe({
    //   next: () => {
    //     this.responseMsg = "Successfully updated anime.";
    //     this.response = "good";
    //     this.updateForm.reset();
    //   },
    //   error: (error) => {
    //     this.responseMsg = "Sorry, something went wrong";
    //     this.response = "bad";
    //   }
    // });

  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    this.updateForm.patchValue({image: file});
  }

  clearStatus() {
    this.status?.reset();
  }

  onAnimeClicked(details: Anime) {
    this.title?.setValue(details.title!);
    this.description?.setValue(details.description);
    this.status?.setValue(details.status);
  }

  //getters so we can use in form control in template
  get title() {
    return this.updateForm.get('title');
  }

  get description() {
    return this.updateForm.get('description');
  }

  get image() {
    return this.updateForm.get('image');
  }

  get status() {
    return this.updateForm.get('status');
  }
}
