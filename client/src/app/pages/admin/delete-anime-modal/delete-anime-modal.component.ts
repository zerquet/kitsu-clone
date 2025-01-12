import { Component, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-delete-anime-modal',
  standalone: true,
  imports: [],
  templateUrl: './delete-anime-modal.component.html',
  styleUrl: './delete-anime-modal.component.css'
})
export class DeleteAnimeModalComponent {
  private activeModal = inject(NgbActiveModal);
  animeId: number = -1;

  initializeModalData(id: number) {
    //initialize modal data
    this.animeId = id;
  }

  closeModal = () => this.activeModal.close();

  deleteAnime() {
    //delete anime
    //close modal
  }
}
