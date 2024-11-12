import { Component } from '@angular/core';
import { AnimeService } from '../services/anime.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { distinctUntilChanged, mergeMap, Observable } from 'rxjs';
import { Anime } from '../interfaces/anime';
import { AsyncPipe, CommonModule, NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-anime',
  standalone: true,
  imports: [AsyncPipe, CommonModule, RouterLink],
  templateUrl: './anime.component.html',
  styleUrl: './anime.component.css'
})
export class AnimeComponent {
  anime$: Observable<Anime>;
  completed: boolean;
  wantToWatch: boolean;
  startedWatching: boolean;
  constructor(private animeService: AnimeService, private route: ActivatedRoute) {
    this.anime$ = this.route.params.pipe(
      distinctUntilChanged(),
      mergeMap(params => this.animeService.getAnime(params['id']))
    )
    this.completed = false;
    this.wantToWatch = false;
    this.startedWatching = false;
  }

  markCompleted() {
    this.wantToWatch = false;
    this.startedWatching = false;
    this.completed = true;
  }

  markWantToWatch() {
    this.completed = false;
    this.startedWatching = false;
    this.wantToWatch = true;
  }

  markStartedWatching() {
    this.completed = false;
    this.wantToWatch = false;
    this.startedWatching = true;
  }

  clearStatus() {
    this.completed = false;
    this.wantToWatch = false;
    this.startedWatching = false;
  }

  //Rating will be calculated based on four overall ratings, then calculated like GPA and divide that by 4, that will be the percent rating of the anime. 
}
