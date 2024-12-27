import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { LibraryEntryWithAnimeInfo } from "../models/libraryEntryWithAnimeInfo";

@Injectable({
    providedIn: "root"
})
export class UserLibraryDataService {
    //This is just a service that holds the current anime library list for a user. The EditEntry and Library components both modify this list. 
    originalAnimeList$ = new BehaviorSubject<LibraryEntryWithAnimeInfo[]>([]);
    //I'm not sure if it makes more sense to populate this list here or in components that use this service.
}