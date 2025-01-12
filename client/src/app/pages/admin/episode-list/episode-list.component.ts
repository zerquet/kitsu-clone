import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { EpisodeService } from '../../../shared/services/episode.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, filter, Observable, of, Subject, switchMap, takeUntil } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Episode } from '../../../shared/models/episode';
import { DeleteAnimeModalComponent } from '../delete-anime-modal/delete-anime-modal.component';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-episode-list',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, AsyncPipe],
  templateUrl: './episode-list.component.html',
  styleUrl: './episode-list.component.css'
})
export class EpisodeListComponent {
  private router = inject(Router);
  private episodeService = inject(EpisodeService);
  private modalService = inject(NgbModal);
  private destroy$ = new Subject<void>();
  form = new FormGroup({ searchControl: new FormControl('') });
  searchTerm$ = new BehaviorSubject<string>('');
  searchList$: Observable<Episode[]> = this.episodeService.getEpisodes(); //get recent animes if no search query.
  filteredSearchList$: Observable<Episode[]> = combineLatest([this.searchList$, this.searchTerm$])
    .pipe(
      switchMap(([list, term]) => {
        if (term === '') {
          return of(list);
        }
        return of(this.filterList(term, list));
      }),
      takeUntil(this.destroy$)
    )

  ngOnInit() {
    this.form.controls['searchControl'].valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter((value) => value !== null),
        takeUntil(this.destroy$))
      .subscribe( (value) => this.searchTerm$.next(value) );
  }

  addEpisode = () => this.router.navigate(['/admin/episode/add']);

  editEpisode = (id: number) => this.router.navigate(['/admin/episode/edit/' + id]);

  deleteEpisode(id: number) {
    const modal = this.modalService.open(DeleteAnimeModalComponent, { size: 'sm', centered: true }); //TODO look into.
    modal.componentInstance.initializeModalData(id);
  }

  private filterList = (term: string, list: Episode[]) => list.filter(a => a.title!.toLowerCase().includes(term.toLowerCase()));
  
}
