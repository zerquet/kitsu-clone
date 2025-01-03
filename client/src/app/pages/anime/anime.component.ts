import { Component, inject, OnInit } from '@angular/core';
import { AnimeService } from '../../shared/services/anime.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BehaviorSubject, distinctUntilChanged, map, mergeMap, Observable, of, tap } from 'rxjs';
import { Anime } from '../../shared/models/anime';
import { AsyncPipe, CommonModule, NgClass, NgIf } from '@angular/common';
import { UserLibraryService } from '../../shared/services/user-library.service';
import { LibraryEntry } from '../../shared/models/libraryEntry';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AnimeSummaryComponent } from './anime-summary/anime-summary.component';
import { AnimeEpisodesComponent } from './anime-episodes/anime-episodes.component';
import { AnimeFranchiseComponent } from './anime-franchise/anime-franchise.component';

@Component({
  selector: 'app-anime',
  standalone: true,
  imports: [AsyncPipe, CommonModule, ReactiveFormsModule, AnimeSummaryComponent, AnimeEpisodesComponent, AnimeFranchiseComponent],
  templateUrl: './anime.component.html',
  styleUrl: './anime.component.css'
})
export class AnimeComponent implements OnInit {
  private animeService = inject(AnimeService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private userLibraryService = inject(UserLibraryService);
  libraryEntry!: LibraryEntry;
  anime$: Observable<Anime> = this.route.params
    .pipe(
      distinctUntilChanged(),
      mergeMap(params => this.animeService.getAnime(params['id'])));
  currentTab$: Observable<string> = this.route.params
    .pipe(
      distinctUntilChanged(),
      map(params => params['tab'] || "summary"));
  form = new FormGroup({
    episodeProgress: new FormControl(),
    rating: new FormControl(),
    status: new FormControl(),
  });

  ngOnInit() {    
    this.route.params
      .pipe(
        distinctUntilChanged(),
        mergeMap(params => this.userLibraryService.getLibraryEntry(params['id'])),)
      .subscribe(res => this.populateFormFields(res));    
  }

  private populateFormFields(res: LibraryEntry) {
    this.libraryEntry = res; //make into observable or behavior subject?
    this.form.patchValue({"episodeProgress": res.episodesWatched});
    this.form.patchValue({"status": res.watchStatus});
    this.form.patchValue({"rating": res.userRating});
  }

  //Use Case: Watched all episodes, status = "completed"
  setAsCompleted = (anime: Anime) => this.userLibraryService.createLibraryEntry(anime.id, "completed", anime.episodeCount!).subscribe(res => this.populateFormFields(res));

  //Use Case: 0 episodes
  setAsPlanning = (anime: Anime) => this.userLibraryService.createLibraryEntry(anime.id, "planning", 0).subscribe(res => this.populateFormFields(res));

  //Use Case: 0 episodes. Don't assume user immediately watched the first episode.
  setAsWatching = (anime: Anime) => this.userLibraryService.createLibraryEntry(anime.id, "watching", 0).subscribe(res => this.populateFormFields(res));

  onIncrementProgressClick(anime: Anime) {
    var currentProgress = this.episodeProgress?.value;
    if(currentProgress + 1 <= anime.episodeCount!) {
      this.episodeProgress?.patchValue(currentProgress + 1);
    }
  }

  saveLibraryEntryUpdates(anime: Anime) {
    const data = {
      libraryEntryId: this.libraryEntry.id,
      animeId: anime.id,
      episodeProgress: this.episodeProgress?.value,
      rating: this.rating?.value,
      status: this.status?.value
    }

    this.userLibraryService.updateLibraryEntry(data).subscribe(res => this.libraryEntry = res);
  }

  deleteEntry = (anime: Anime) => this.userLibraryService.deleteLibraryEntry(anime.id).subscribe(res => this.populateFormFields(res));

  updateTab = (tab: string, animeId: number) => this.router.navigate([`/anime/${animeId}/${tab}`]);

  /**FORM GETTERS */
  get episodeProgress() { return this.form.get("episodeProgress"); }

  get rating() { return this.form.get("rating"); }

  get status() { return this.form.get("status"); }

}
