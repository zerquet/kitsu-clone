import { Component } from '@angular/core';
import { AnimeService } from '../../services/anime.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BehaviorSubject, distinctUntilChanged, map, mergeMap, Observable, tap } from 'rxjs';
import { Anime } from '../../interfaces/anime';
import { AsyncPipe, CommonModule, NgClass, NgIf } from '@angular/common';
import { UserLibraryService } from '../../services/user-library.service';
import { AnimeLibraryEntry } from '../../interfaces/animeLibraryEntry';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AnimeSummaryComponent } from './anime-summary/anime-summary.component';

@Component({
  selector: 'app-anime',
  standalone: true,
  imports: [AsyncPipe, CommonModule, RouterLink, ReactiveFormsModule, AnimeSummaryComponent],
  templateUrl: './anime.component.html',
  styleUrl: './anime.component.css'
})
export class AnimeComponent {
  anime$: Observable<Anime>;
  currentTab$ = new BehaviorSubject("summary");
  libraryEntry!: AnimeLibraryEntry;
  form: FormGroup;
  constructor(private animeService: AnimeService, private route: ActivatedRoute, private userLibraryService: UserLibraryService) {
    this.anime$ = this.route.params.pipe(
      distinctUntilChanged(),
      mergeMap(params => this.animeService.getAnime(params['id']))
    );
    
    this.route.params.pipe(
      distinctUntilChanged(),
      mergeMap(params => this.userLibraryService.getStatus(params['id'])),
    ).subscribe(res => this.updateFormOnSubscribe(res));

    this.form = new FormGroup({
      episodeProgress: new FormControl(),
      rating: new FormControl(),
      status: new FormControl(),
    });
  }

  private updateFormOnSubscribe(res: AnimeLibraryEntry) {
    this.libraryEntry = res;
    this.form.patchValue({"episodeProgress": res.episodesSeen});
    this.form.patchValue({"status": res.status});
    this.form.patchValue({"rating": res.rating})
  }

  setAsCompleted(anime: Anime) {
    //Use Case: Watched all episodes, status = "completed"
    this.userLibraryService.setStatus(anime.id, "completed", anime.episodes).subscribe(res => this.updateFormOnSubscribe(res));
  }

  setAsWantToWatch(anime: Anime) {
    //Use Case: 0 episodes
    this.userLibraryService.setStatus(anime.id, "planning", 0).subscribe(res => this.updateFormOnSubscribe(res));
  }

  setAsStartedWatching(anime: Anime) {
    //Use Case: 0 episodes. Don't assume user immediately watched the first episode.
    this.userLibraryService.setStatus(anime.id, "watching", 0).subscribe(res => this.updateFormOnSubscribe(res));
  }

  clearStatus(anime: Anime) {
    this.userLibraryService.deleteStatus(anime.id).subscribe(res => this.updateFormOnSubscribe(res));
  }

  onIncrementProgressClick(anime: Anime) {
    var currentProgress = this.episodeProgress?.value;
    if(currentProgress + 1 <= anime.episodes) {
      this.episodeProgress?.patchValue(currentProgress + 1);
    }
  }

  //Rating will be calculated based on four overall ratings, then calculated like GPA and divide that by 4, that will be the percent rating of the anime. 
  saveLibraryEntryUpdates(anime: Anime) {
    let episodeProgress = this.episodeProgress?.value;
    let rating = this.rating?.value;
    let status = this.status?.value;

    if(rating === null) rating === this.libraryEntry.rating;
    if(status === null) rating === this.libraryEntry.status;

    this.userLibraryService.editStatus(this.libraryEntry.id, anime.id, status, episodeProgress, rating).subscribe(res => this.libraryEntry = res);
    return;
  }
  //If user selects "Remove Status", that means remove it from their list. Delete record
  deleteEntry(anime: Anime) {
    this.userLibraryService.deleteStatus(anime.id).subscribe(res => this.updateFormOnSubscribe(res));
  }

  updateTab(tab: string) {
    this.currentTab$.next(tab);
  }

  /**FORM GETTERS */
  get episodeProgress() {
    return this.form.get("episodeProgress");
  }

  get rating() {
    return this.form.get("rating");
  }

  get status() {
    return this.form.get("status");
  }

}
