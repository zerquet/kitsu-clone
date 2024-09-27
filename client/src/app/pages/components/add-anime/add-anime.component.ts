import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Anime } from 'src/app/models/anime.model';
import { AnimeService } from 'src/app/services/anime.service';

@Component({
  selector: 'app-add-anime',
  templateUrl: 'add-anime.component.html',
  styleUrls: ["add-anime.component.css"]
})
export class AddAnimeComponent {
  addForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl(),
    image: new FormControl(),
    status: new FormControl()
  }); //need to style template and hookup service, then add library UI?
  response: string = "";
  responseMsg: string = "";
  constructor(private animeService: AnimeService ) {
    
  }

  onSubmit() {
    debugger;
    const formData = new FormData();
    formData.append('title', this.title?.value!);
    formData.append('description', this.description?.value!); 
    formData.append('image', this.image?.value);
    for(let i = 0; i < this.status?.value.length; i++) {
      formData.append('status', this.status?.value[i]);
    }
    //ASP.NET Core (or any api that supports it) will read multiple assignments to the 'status' variable as an array of values, which is the expected data type. 
    //Ref: https://stackoverflow.com/a/9547490/20829897 & https://stackoverflow.com/a/28434829/20829897
    
    this.animeService.post(formData).subscribe({
      next: () => {
        this.responseMsg = "Successfully added anime.";
        this.response = "good";
        this.addForm.reset();
      },
      error: (error) => {
        this.responseMsg = "Sorry, something went wrong";
        this.response = "bad";
      }
    });

  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    this.addForm.patchValue({image: file});
  }

  clearStatus() {
    this.status?.reset();
  }

  //getters so we can use in form control in template
  get title() {
    return this.addForm.get('title');
  }

  get description() {
    return this.addForm.get('description');
  }

  get image() {
    return this.addForm.get('image');
  }

  get status() {
    return this.addForm.get('status');
  }

}
