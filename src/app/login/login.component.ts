import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  email: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router, public authService: AuthService) {}

  login() {
    this.http.post<{ token : string, role : string, nombre : string }>('http://localhost:3000/usuarios/login', { email: this.email, password: this.password })
      .subscribe(response => {
        this.authService.login(response.nombre, response.role);
        localStorage.setItem('authToken', response.token);
        this.router.navigate(['/productos']);
      }, error => {
        console.error('Login failed', error);
      });
  } 

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  
}

