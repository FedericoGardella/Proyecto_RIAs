import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Insumo } from '../model/insumo';

@Injectable({
  providedIn: 'root'
})
export class InsumoService {

  private apiUrl = 'http://localhost:3000/insumos';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  get(): Observable<Insumo[]> {
    const token = localStorage.getItem('authToken');

    if (!token) {
      return new Observable<Insumo[]>(observer => {
        observer.error('No token found in localStorage');
      });
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Insumo[]>(this.apiUrl, { headers });
  }

  getInsumoById(id: number): Observable<Insumo> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Insumo>(`${this.apiUrl}/${id}`, { headers });
  }

  add(insumo: Insumo): Observable<Insumo> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<Insumo>(this.apiUrl, insumo, { headers });
  }

  update(id: number, insumo: Insumo): Observable<Insumo> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<Insumo>(`${this.apiUrl}/${id}`, insumo, { headers });
  }

  delete(id: number): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }
}
