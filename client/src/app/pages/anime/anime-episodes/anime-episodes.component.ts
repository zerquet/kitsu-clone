import { Component, inject, input, Input } from '@angular/core';
import { Episode } from '../../../shared/models/episode';
import { BehaviorSubject } from 'rxjs';
import { EpisodeService } from '../../../shared/services/episode.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-anime-episodes',
  standalone: true,
  imports: [NgFor],
  templateUrl: './anime-episodes.component.html',
  styleUrl: './anime-episodes.component.css'
})
export class AnimeEpisodesComponent {
  //Everytime this tab is clicked an API call is made. Maybe get episodes in AnimeComponent (parent), or have them in a data service? 
  private episodeService = inject(EpisodeService);
  episodes$ = new BehaviorSubject<Episode[]>([]); //BehaviorSubject vs Observable? idk
  @Input() set id(id: number) {
    this.episodeService.getEpisodesByAnimeId(id).subscribe(res => this.episodes$.next(res));
  }

}
