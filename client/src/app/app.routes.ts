import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AnimeComponent } from './components/anime/anime.component';
import { AddAnimeComponent } from './components/admin/add-anime/add-anime.component';
import { UpdateAnimeComponent } from './components/admin/update-anime/update-anime.component';
import { SearchComponent } from './components/search/search.component';
import { LibraryComponent } from './components/library/library.component';
import { CategoryComponent } from './components/category/category.component';

export const routes: Routes = [
    {path: "home", component: HomeComponent},
    {path: "anime/:id", component: AnimeComponent},
    {path: "add-anime", component: AddAnimeComponent},
    {path: "update-anime/:id", component: UpdateAnimeComponent},
    {path: "search", component: SearchComponent},
    {path: "library", component: LibraryComponent},
    {path: "category/:category", component: CategoryComponent}
];
