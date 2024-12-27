import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AnimeComponent } from './pages/anime/anime.component';
import { AddAnimeComponent } from './pages/admin/add-anime/add-anime.component';
import { UpdateAnimeComponent } from './pages/admin/update-anime/update-anime.component';
import { SearchComponent } from './pages/search/search.component';
import { LibraryComponent } from './pages/library/library.component';
import { AddEpisodeComponent } from './pages/admin/add-episode/add-episode.component';
import { AddFranchiseComponent } from './pages/admin/add-franchise/add-franchise.component';

export const routes: Routes = [
    {path: "home", component: HomeComponent},
    {path: "home/category/:category", component: HomeComponent},
    {path: "anime/:id", component: AnimeComponent},
    {path: "add-anime", component: AddAnimeComponent},
    {path: "update-anime/:id", component: UpdateAnimeComponent},
    {path: "search", component: SearchComponent},
    {path: "library", component: LibraryComponent},
    {path: "add-episode", component: AddEpisodeComponent},
    {path: "add-franchise", component: AddFranchiseComponent},
    {path: "", redirectTo: "/home", pathMatch: "full"}
];
