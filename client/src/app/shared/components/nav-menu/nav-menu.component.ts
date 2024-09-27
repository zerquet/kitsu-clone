import { Component } from "@angular/core";

@Component({
  selector: "app-nav-menu",
  templateUrl: "nav-menu.component.html",
  styleUrls: ["nav-menu.component.css"],
})
export class NavMenuComponent {
  constructor() {
    document.addEventListener("DOMContentLoaded", () => {
      let browseLink = document.getElementById("kitsu-browse-link");
      if (browseLink !== null) {
        browseLink.addEventListener("click", () => {
          let browseContent = document.querySelector(".kitsu-browse-dropdown");
          if (browseContent !== null) {
            if (browseContent.classList.contains("kitsu-browse-dropdown-show")) {
              browseContent.classList.remove("kitsu-browse-dropdown-show");
            } else {
              browseContent.classList.add("kitsu-browse-dropdown-show");
            }
          }
        });
      }

      let accountLink = document.querySelector(".kitsu-avatar");
      if (accountLink !== null) {
        accountLink.addEventListener("click", () => {
          let accountContent = document.querySelector(".kitsu-account-dropdown");
          if (accountContent !== null) {
            if (accountContent.classList.contains("kitsu-account-dropdown-show")) {
              accountContent.classList.remove("kitsu-account-dropdown-show");
            } else {
              accountContent.classList.add("kitsu-account-dropdown-show");
            }
          }
        });
      }
    });
    //
  }
}
