import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AnimeService } from '../../shared/services/anime.service';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, filter, map, mergeMap, Observable, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { Anime } from '../../shared/models/anime';
import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteAnimeModalComponent } from './delete-anime-modal/delete-anime-modal.component';
import { AnimeAddComponent } from './anime-add/anime-add.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AnimeEditComponent } from './anime-edit/anime-edit.component';
import { AuthService } from '../../auth/services/auth.service';
import { FranchiseAddComponent } from './franchise-add/franchise-add.component';
import { FranchiseListComponent } from "./franchise-list/franchise-list.component";
import { EpisodeAddComponent } from './episode-add/episode-add.component';
import { EpisodeListComponent } from './episode-list/episode-list.component';
import { User } from '../../auth/models/user';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [NgIf, AsyncPipe, AnimeAddComponent, AnimeEditComponent, ReactiveFormsModule, RouterLink, NgClass, FranchiseAddComponent, 
    FranchiseListComponent, EpisodeAddComponent, EpisodeListComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  private animeService = inject(AnimeService);
  private modalService = inject(NgbModal);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  public authService = inject(AuthService);
  private destroy$ = new Subject<void>();
  form = new FormGroup({ searchControl: new FormControl('') });
  searchTerm$ = new BehaviorSubject<string>('');
  searchList$: Observable<Anime[]> = this.animeService.getAnimes(); //get recent animes if no search query.
  filteredSearchList$: Observable<Anime[]> = combineLatest([this.searchList$, this.searchTerm$])
    .pipe(
      switchMap(([list, term]) => {
        if (term === '') {
          return of(list);
        }
        return of(this.filterList(term, list));
      }),
      takeUntil(this.destroy$)
    )
  currRoute = '/admin';
  currTab = 'anime';

  ngOnInit() { 
    this.form.controls['searchControl'].valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter((value) => value !== null),
        takeUntil(this.destroy$))
      .subscribe( (value) => this.searchTerm$.next(value) );

    this.route.params
      .pipe(
        distinctUntilChanged(), 
        takeUntil(this.destroy$))
      .subscribe(params => {
        var routeBuilder = '/admin';
        if (params['mediatype']) {
          routeBuilder += '/' + params['mediatype'];
          this.currTab = params['mediatype'];
          if(params['operation']) {
            routeBuilder += '/' + params['operation'];
            if(params['operation'] === 'edit' && params['id']) {
              routeBuilder += '/' + params['id'];
            }
          }
        }
        
        this.currRoute = routeBuilder;
      }); 
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addAnime = () => this.router.navigate(['/admin/anime/add']);

  editAnime = (id: number) => this.router.navigate(['/admin/anime/edit/' + id]);

  deleteAnime(id: number) {
    const modal = this.modalService.open(DeleteAnimeModalComponent, { size: 'sm', centered: true });
    modal.componentInstance.initializeModalData(id);
  }

  private filterList = (term: string, list: Anime[]) => list.filter(a => a.title.toLowerCase().includes(term.toLowerCase()));
}
