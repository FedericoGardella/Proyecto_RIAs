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

  forgotPassword() {
    // Implement logic for forgotten password, e.g., navigate to a forgot password page or show a modal
    console.log('Forgot password clicked');
  }
  
}

