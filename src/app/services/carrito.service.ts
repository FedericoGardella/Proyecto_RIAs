import { Injectable } from '@angular/core';
import { ProductoEnCarrito } from '../model/producto-en-carrito';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private apiUrl = 'http://localhost:3000/carrito';

  constructor(private http: HttpClient) { }

  get(email : string): Observable<ProductoEnCarrito[]> {
    return this.http.get<ProductoEnCarrito[]>(`${this.apiUrl}/${email}`);
  }

  add(prod: ProductoEnCarrito): Observable<ProductoEnCarrito> {
    return this.http.post<ProductoEnCarrito>(this.apiUrl, prod);
  }

  deleteProducto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/producto/${id}`);
  }

  delete(email: string, idProd: number): Observable<any>  {
    return this.http.delete(`${this.apiUrl}/${email}/${idProd}`);
  }

  deleteAll(email: string): Observable<any>  {
    return this.http.delete(`${this.apiUrl}/${email}`);
  }

}
