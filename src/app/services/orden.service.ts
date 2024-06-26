import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Orden } from '../model/orden';

@Injectable({
  providedIn: 'root'
})
export class OrdenService {

  private apiUrl = 'http://localhost:3000/ordenes';

  constructor(private http: HttpClient) { }

  get(): Observable<Orden[]> {
    return this.http.get<Orden[]>(this.apiUrl);
  }

  getOrdenById(id: number): Observable<Orden> {
    return this.http.get<Orden>(`${this.apiUrl}/${id}`);
  }

  // obtener ordenes por email del usuario
  getOrdenesByCliente(cliente: string): Observable<Orden[]> {
    return this.http.get<Orden[]>(`${this.apiUrl}/cliente/${cliente}`);
  }

  add(orden: any): Observable<Orden> {
    return this.http.post<Orden>(this.apiUrl, orden);
  }

  edit(orden: Orden): Observable<Orden> {
    return this.http.put<Orden>(`${this.apiUrl}/${orden.id}`, orden);
  }
}
