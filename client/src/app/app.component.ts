import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavMenuComponent } from "./shared/components/nav-menu/nav-menu.component";
import { ToastsComponent } from "./shared/components/toasts/toasts.component";
import { AuthService } from './auth/services/auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavMenuComponent, ToastsComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'client';
  constructor(public authService: AuthService) {}
  ngOnInit(): void {
    // this.authService.getUser().subscribe(res => {
    //   this.authService.currentUser$.next(res);
    //   console.log("app")
    //   console.log(this.authService.currentUser$.value);
    // })
    
    if(window.location.pathname.includes('admin')) {
      this.authService.isAdminPage$.next(true);
    }
    else {
      this.authService.isAdminPage$.next(false);
    }

  }
}
