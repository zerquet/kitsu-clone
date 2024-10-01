import { Component, OnInit } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Anime } from "src/app/models/anime.model";
import { AnimeService } from "src/app/services/anime.service";

@Component({
  selector: "app-explore-anime",
  templateUrl: "explore-anime.component.html",
  styleUrls: ["explore-anime.component.css"],
})
export class ExploreAnimeComponent implements OnInit {
  animes$ = new BehaviorSubject<Anime[]>([]);

  constructor(private animeService: AnimeService) {}

  ngOnInit(): void {
    this.animeService.getAll().subscribe((response: Anime[]) => {
      this.animes$.next(response);
    });

    document.addEventListener("DOMContentLoaded", () => {
      let posterItems = document.getElementsByClassName("kitsu-poster-item");
      console.log(posterItems);
      Array.from(posterItems).forEach((item) => {
        item.addEventListener("mouseover", () => {
          console.log("2");
        });
      });
    });
  }
}
