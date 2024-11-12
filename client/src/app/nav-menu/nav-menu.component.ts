import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SignInComponent } from '../sign-in/sign-in.component';
import { SignUpComponent } from '../sign-up/sign-up.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, of, switchMap, tap } from 'rxjs';
import { AnimeService } from '../services/anime.service';
import { Anime } from '../interfaces/anime';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-nav-menu',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.css'
})
export class NavMenuComponent implements OnInit {
  form: FormGroup;
  list: Anime[];
  shown = false;
  constructor(private modalService: NgbModal, private animeService: AnimeService, public authService: AuthService) {
    this.list = [];
    this.form = new FormGroup({
      searchControl : new FormControl()
    });
  }

  ngOnInit(): void {
    this.form.controls['searchControl'].valueChanges
    .pipe(
      debounceTime(400),
      distinctUntilChanged(),
      tap(value => {
        if (!value || value.trim().length === 0) {
          // Directly clear results if input is empty or whitespace
          this.list = [];
          this.shown = false;
        }
      }),
      filter(term => term && term.trim().length > 2),
      switchMap(term => {
        if(term && term.trim().length > 2) {
          return this.animeService.miniSearch(term)
        } 
        else {
          return of([]);
        }
      })
    )
    .subscribe(res => {
      this.list = res;
      this.shown = res.length > 0 ? true : false;
    }); 
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
    this.authService.currentUserSig.set(null);
  }
}
