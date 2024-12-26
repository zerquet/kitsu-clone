import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FranchiseService } from '../../../services/franchise.service';
import { NgIf } from '@angular/common';
import { Franchise } from '../../../interfaces/franchise';
import { AppToastService } from '../../../services/app-toast.service';

@Component({
  selector: 'app-add-franchise',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './add-franchise.component.html',
  styleUrl: './add-franchise.component.css'
})
export class AddFranchiseComponent {
  private franchiseService = inject(FranchiseService);
  private toastService = inject(AppToastService);
  form: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required)
  });

  onSubmit() {
    const dto: Franchise = {
      name: this.name?.value
    }

    this.franchiseService.addFranchise(dto).subscribe({
      next: () => {
        this.toastService.show('Success', `Franchise '${this.name?.value}' added successfully`);
        this.form.reset();
      },
      error: () => {
        this.toastService.show('Error', 'Failed to add franchise');
      }
    });
  }

  //FORM GETTERS
  get name() {
    return this.form.get('name');
  }
}
