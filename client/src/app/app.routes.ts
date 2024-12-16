import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AnimeComponent } from './anime/anime.component';
import { AddAnimeComponent } from './add-anime/add-anime.component';
import { UpdateAnimeComponent } from './update-anime/update-anime.component';
import { SearchComponent } from './search/search.component';
import { LibraryComponent } from './library/library.component';
import { CategoryComponent } from './category/category.component';

export const routes: Routes = [
    {path: "home", component: HomeComponent},
    {path: "anime/:id", component: AnimeComponent},
    {path: "add-anime", component: AddAnimeComponent},
    {path: "update-anime/:id", component: UpdateAnimeComponent},
    {path: "search", component: SearchComponent},
    {path: "library", component: LibraryComponent},
    {path: "category/:category", component: CategoryComponent}
];
