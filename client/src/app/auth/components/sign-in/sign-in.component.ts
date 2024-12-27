import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginDto } from '../../models/loginDto';
import { AuthService } from '../../services/auth.service';
import { AppToastService } from '../../../shared/services/app-toast.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {
  //https://ng-bootstrap.github.io/#/components/modal/examples#component
  form: FormGroup;
  errMsg = "";
  constructor(public activeModal: NgbActiveModal, private authService: AuthService, private toastService: AppToastService) {
    this.name = "";
    this.form = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }

  @Input() name: string;

  get email() {
    return this.form.get("email");
  }

  get password() {
    return this.form.get("password");
  }

  onSubmit() {
    const loginDto: LoginDto = {
      email: this.email?.value,
      password: this.password?.value
    };
    
    this.authService.login(loginDto).subscribe({
      next: (res) => {
        localStorage.setItem("access_token", res.token);
        this.authService.currentUserSig.set(res);
        this.toastService.show("Success", `Welcome back ${res.username}!`);
        this.activeModal.close();
      },
      error: (err) => this.errMsg = err.error
    });
  }
}
