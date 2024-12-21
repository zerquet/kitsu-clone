import { Component, Input } from '@angular/core';
import { Anime } from '../../../interfaces/anime';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-anime-summary',
  standalone: true,
  imports: [RouterLink, NgIf],
  templateUrl: './anime-summary.component.html',
  styleUrl: './anime-summary.component.css'
})
export class AnimeSummaryComponent {
  @Input() anime!: Anime;
}
