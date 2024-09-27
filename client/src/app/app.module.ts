import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './shared/components/nav-menu/nav-menu.component';
import { AddAnimeComponent } from './pages/components/add-anime/add-anime.component';
import { ExploreAnimeComponent } from './pages/components/explore-anime/explore-anime.component';
import { ModifyAnimeComponent } from './pages/components/modify-anime/modify-anime.component';
import { AnimeComponent } from './pages/components/anime/anime.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    AddAnimeComponent,
    ExploreAnimeComponent,
    ModifyAnimeComponent,
    AnimeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
