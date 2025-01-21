import { Component, inject } from '@angular/core';
import { UserLibraryService } from '../../../shared/services/user-library.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { Anime } from '../../../shared/models/anime';
import { of } from 'rxjs';

@Component({
  selector: 'app-favorites-tab',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe, RouterLink, NgbTooltipModule],
  templateUrl: './favorites-tab.component.html',
  styleUrl: './favorites-tab.component.css'
})
export class FavoritesTabComponent {
  private userLibraryService = inject(UserLibraryService);
  
  form = new FormGroup({
    favoriteSearch: new FormControl("")
  });
  
  favoriteAnimes$ = this.userLibraryService.getFavoriteAnimes();

  newList$ = this.favoriteAnimes$;

  removeFavorite(anime: Anime) {
    this.newList$.subscribe((animes) => {
      this.newList$ = of(animes.filter((item) => item.id !== anime.id));
    })
  }

  saveChanges() {
    this.newList$.subscribe((animes) => {
      this.userLibraryService.updateFavorites(animes);
    })
  }

}
