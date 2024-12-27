import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavMenuComponent } from "./shared/components/nav-menu/nav-menu.component";
import { ToastsComponent } from "./shared/components/toasts/toasts.component";
import { AuthService } from './auth/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavMenuComponent, ToastsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'client';
  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    this.authService.getUser().subscribe({
      next: (res) => this.authService.currentUserSig.set(res),
      error: (err) => this.authService.currentUserSig.set(null)
    })

  }
}
