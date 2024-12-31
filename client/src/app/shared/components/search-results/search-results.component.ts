import { Component, Input } from '@angular/core';
import { Anime } from '../../models/anime';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.css'
})
export class SearchResultsComponent {
  @Input() results: Anime[] = [];

}
