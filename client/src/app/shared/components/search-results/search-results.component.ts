import { Component, Input } from '@angular/core';
import { Anime } from '../../models/anime';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [RouterLink, NgIf, AsyncPipe],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.css'
})
export class SearchResultsComponent {
  @Input() results$: Observable<Anime[]> | undefined = undefined;

}
