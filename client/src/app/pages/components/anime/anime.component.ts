import { Component, OnInit } from '@angular/core';
import { AnimeService } from 'src/app/services/anime.service'; 
import { ActivatedRoute } from '@angular/router';
import { Anime } from 'src/app/models/anime.model';

@Component({
  selector: 'app-anime',
  templateUrl: 'anime.component.html',
  styleUrls: [ 'anime.component.css']
})
export class AnimeComponent implements OnInit {
  id: string | null = "";
  anime: Anime | null = null;
  
  constructor(private animeService: AnimeService, private route: ActivatedRoute) {}
  
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.animeService.getById(Number(this.id))
    .subscribe(
      (response) => {
        this.anime = response;
      }
    );
  }
}
