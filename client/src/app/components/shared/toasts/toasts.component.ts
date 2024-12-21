import { Component } from '@angular/core';
import { AppToastService } from '../../../services/app-toast.service';
import { NgbToast } from '@ng-bootstrap/ng-bootstrap';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-toasts',
  standalone: true,
  imports: [NgbToast, NgClass],
  templateUrl: './toasts.component.html',
  styleUrl: './toasts.component.css'
})
export class ToastsComponent {
  constructor(public toastService: AppToastService) {}
}
