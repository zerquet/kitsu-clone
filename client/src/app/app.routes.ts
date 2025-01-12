import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AnimeComponent } from './pages/anime/anime.component';
import { SearchComponent } from './pages/search/search.component';
import { AdminComponent } from './pages/admin/admin.component';
import { AdminGuard } from './shared/guards/admin.guard';
import { ProfileComponent } from './pages/profile/profile.component';

export const routes: Routes = [
    {path: "home", component: HomeComponent},
    {path: "home/category/:category", component: HomeComponent},
    {path: "anime/:id", component: AnimeComponent},
    {path: "anime/:id/:tab", component: AnimeComponent},
    {path: "admin", component: AdminComponent, canActivate: [AdminGuard]},
    {path: "admin/:mediatype", component: AdminComponent, canActivate: [AdminGuard]},
    {path: "admin/:mediatype/:operation", component: AdminComponent, canActivate: [AdminGuard]},
    {path: "admin/:mediatype/:operation/:id", component: AdminComponent, canActivate: [AdminGuard]},
    {path: "search", component: SearchComponent},
    {path: "profile/:id", component: ProfileComponent},
    {path: "profile/:id/:tab", component: ProfileComponent},
    {path: "", redirectTo: "/home", pathMatch: "full"},
];
