import { Component, inject, Input } from '@angular/core';
import { Anime } from '../../models/anime';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';
import { NavMenuSearchDataService } from '../../services/nav-menu-search-data.service';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [NgIf, AsyncPipe],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.css'
})
export class SearchResultsComponent {
  private router = inject(Router);
  private navMenuSearchDataService = inject(NavMenuSearchDataService);
  @Input() results$: Observable<Anime[]> | undefined = undefined;

  onResultClick(id: number) {
    this.navMenuSearchDataService.show$.next(false);
    this.navMenuSearchDataService.term$.next("");
    this.router.navigate(['/anime/' + id]);
  }
}
