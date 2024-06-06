import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Orden } from '../model/orden';

@Injectable({
  providedIn: 'root'
})
export class OrdenService {

  private apiUrl = 'http://localhost:3000/ordenes';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  get(): Observable<Orden[]> {

    const token = localStorage.getItem('authToken');

    if (!token) {
      return new Observable<Orden[]>(observer => {
        observer.error('No token found in localStorage');
      });
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<Orden[]>(this.apiUrl, { headers });
  }

  edit(orden: Orden, estado : string): Observable<Orden> {
    orden.estado = estado;
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<Orden>(`${this.apiUrl}/${orden.id}`, orden, { headers });
  }

}
