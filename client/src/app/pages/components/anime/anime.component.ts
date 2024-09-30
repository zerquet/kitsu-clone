import { Component, OnInit } from '@angular/core';
import { AnimeService } from 'src/app/services/anime.service';

@Component({
  selector: 'app-anime',
  templateUrl: 'anime.component.html',
  styleUrls: [ 'anime.component.css']
})
export class AnimeComponent implements OnInit {
  
  constructor(private animeService: AnimeService) {}
  
  ngOnInit(): void {

  }
}
