import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SignInComponent } from '../../../auth/components/sign-in/sign-in.component';
import { SignUpComponent } from '../../../auth/components/sign-up/sign-up.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, filter, map, Observable, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { AnimeService } from '../../services/anime.service';
import { Anime } from '../../models/anime';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth/services/auth.service';
import { SearchResultsComponent } from '../search-results/search-results.component';
import { NavMenuSearchDataService } from '../../services/nav-menu-search-data.service';

@Component({
  selector: 'app-nav-menu',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule, SearchResultsComponent],
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.css'
})
export class NavMenuComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private modalService = inject(NgbModal);
  private animeService = inject(AnimeService);
  public authService = inject(AuthService);
  private navMenuSearchDataService = inject(NavMenuSearchDataService);
  show$ = this.navMenuSearchDataService.show$;
  term$ = this.navMenuSearchDataService.term$;
  form = new FormGroup({ searchControl : new FormControl()});

  searchResults$: Observable<Anime[]> = combineLatest([this.term$]) 
    .pipe(
      map(([term]) => term),
      switchMap(term => this.search(term)),
      takeUntil(this.destroy$)); //TODO mini search logic is duplicate from home component. shared?

  ngOnInit(): void {
    this.form.controls['searchControl'].valueChanges
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap(term => {
          if(term && term.trim().length > 0)
            this.show$.next(true);
          else 
            this.show$.next(false);
        }),
        takeUntil(this.destroy$))
      .subscribe(term => this.term$.next(term));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private search(term: string): Observable<Anime[]> {
    term = term.toLowerCase().trim();
    if(term.length === 0)
      return of([]);
    return this.animeService.miniSearch(term);
  }

  openSignInModal() {
    const signInModalRef = this.modalService.open(SignInComponent)
    signInModalRef.componentInstance.name = "Sign In";
  }

  openSignUpModal() {
    const signUpModalRef = this.modalService.open(SignUpComponent);
    signUpModalRef.componentInstance.name = "Sign Up";
  }

  logout() {
    localStorage.setItem("access_token", "");
    this.authService.currentUser$.next(null);
  }
}
