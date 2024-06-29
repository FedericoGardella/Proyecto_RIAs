import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Usuario } from '../model/usuario';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  user = Usuario;

  errorMessage: string = '';
  email: string = '';
  password: string = '';
  linkResetPassword: string = '';

  forgotPasswordEmail!: string;
  forgotPasswordErrorMessage!: string;
  isForgotPasswordModalActive: boolean = false;

  constructor(private router: Router, public authService: AuthService) {}

  login() {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        setTimeout(() => {
          window.location.reload();
        }, 100);
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.errorMessage = 'Usuario y/o contraseña incorrectos';
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  openForgotPasswordModal() {
    this.isForgotPasswordModalActive = true;
  }

  closeForgotPasswordModal() {
    this.isForgotPasswordModalActive = false;
    this.forgotPasswordEmail = '';
    this.forgotPasswordErrorMessage = '';
  }

  sendResetPasswordEmail() {
    if (this.forgotPasswordEmail) {
      this.authService.forgotPassword(this.forgotPasswordEmail).subscribe(
        (response) => {
          this.linkResetPassword = response.resetLink;
          this.closeForgotPasswordModal();
        },
        (error) => {
          this.forgotPasswordErrorMessage = 'Error sending reset password email';
        }
      );
    }
  }
  
}

