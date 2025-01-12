import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, filter, Observable, of, Subject, switchMap, takeUntil } from 'rxjs';
import { Franchise } from '../../../shared/models/franchise';
import { FranchiseService } from '../../../shared/services/franchise.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteAnimeModalComponent } from '../delete-anime-modal/delete-anime-modal.component';

@Component({
  selector: 'app-franchise-list',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, AsyncPipe],
  templateUrl: './franchise-list.component.html',
  styleUrl: './franchise-list.component.css'
})
export class FranchiseListComponent {
  private router = inject(Router);
  private franchiseService = inject(FranchiseService);
  private modalService = inject(NgbModal);
  private destroy$ = new Subject<void>();
  form = new FormGroup({ searchControl: new FormControl('') });
  searchTerm$ = new BehaviorSubject<string>('');
  searchList$: Observable<Franchise[]> = this.franchiseService.getFranchises(); //get recent animes if no search query.
  filteredSearchList$: Observable<Franchise[]> = combineLatest([this.searchList$, this.searchTerm$])
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

  addFranchise = () => this.router.navigate(['/admin/franchise/add']);

  editFranchise = (id: number) => this.router.navigate(['/admin/franchise/edit/' + id]);

  deleteFranchise(id: number) {
    const modal = this.modalService.open(DeleteAnimeModalComponent, { size: 'sm', centered: true }); //TODO look into.
    modal.componentInstance.initializeModalData(id);
  }

  private filterList = (term: string, list: Franchise[]) => list.filter(a => a.name!.toLowerCase().includes(term.toLowerCase()));
  
}
