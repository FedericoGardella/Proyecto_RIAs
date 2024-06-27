import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../model/usuario';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private email: string | null = null;
  private role: string | null = null;

  constructor(private http: HttpClient) {}

  private apiUrl = 'http://localhost:3000/usuarios';

  login(email: string, password: string) {
    this.http.post<{ token: string, role: string, nombre: string, userId: number }>(this.apiUrl + '/login', { email, password })
      .subscribe({
        next: (response) => {
          this.email = email;
          this.role = response.role;
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('email', email);
          localStorage.setItem('role', this.role);
          localStorage.setItem('userId', response.userId.toString());
        },
        error: (error) => {
          console.error('Login failed', error);
        }
      });
  }

  logout() {
    this.email = null;
    this.role = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('email');
    localStorage.removeItem('userId');
  }

  public getEmail(): string | null {
    return localStorage.getItem('email');
  }

  public getUserId(): number | null {
    const userId = localStorage.getItem('userId');
    return userId ? +userId : null;
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  register(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/register`, usuario);
  }
}
