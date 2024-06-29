import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-pass',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './reset-pass.component.html',
  styleUrls: ['./reset-pass.component.css']
})
export class ResetPassComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  token!: string;
  errorMessage: string = ''; 

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParams['token'];
    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.resetPasswordForm.valid && this.resetPasswordForm.value.newPassword === this.resetPasswordForm.value.confirmNewPassword) {
      const newPassword = this.resetPasswordForm.value.newPassword;
      this.authService.resetPassword(this.token, newPassword)
        .subscribe(response => {
          console.log(response);
          this.router.navigate(['/login']); // Redirige al login después del restablecimiento
        }, error => {
          console.error(error);
        });
    } else {
      this.errorMessage = 'Las contraseñas no coinciden o no cumplen con los requisitos mínimos.';
      this.resetPasswordForm.reset();
    }
  }
}
