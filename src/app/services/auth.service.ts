import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../model/usuario';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private email: string | null = null;
  private role: string | null = null;

  constructor(private http: HttpClient) {}

  private apiUrl = 'http://localhost:3000/usuarios';

  login(email: string, role: string) {
    this.email = email;
    this.role = role;
  }

  logout() {
    this.email = null;
    this.role = null;
    localStorage.removeItem('authToken');
  }

  getEmail(): string | null {
    return this.email;
  }

  getRole(): string | null {
    return this.role;
  }

  isLoggedIn(): boolean {
    return !!this.email && !!this.role && !!localStorage.getItem('authToken');
  }

  register(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/register`, usuario);
  }
}
