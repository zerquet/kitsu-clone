import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { LibraryItemDto } from "../interfaces/libraryItemDto";

@Injectable({
    providedIn: "root"
})
export class LocalApiService {
    http = inject(HttpClient);
    getLibrary() {
        return this.http.get<LibraryItemDto[]>("../api/getLibrary.json");
    }
}