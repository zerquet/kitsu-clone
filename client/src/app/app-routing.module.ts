import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddAnimeComponent } from './pages/components/add-anime/add-anime.component';
import { ExploreAnimeComponent } from './pages/components/explore-anime/explore-anime.component';
import { ModifyAnimeComponent } from './pages/components/modify-anime/modify-anime.component';
import { AnimeComponent } from './pages/components/anime/anime.component';

const routes: Routes = [
  { path: "add/anime", component: AddAnimeComponent},
  { path: 'explore/anime', component: ExploreAnimeComponent},
  { path: 'modify/anime', component: ModifyAnimeComponent},
  { path: 'anime', component: AnimeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
