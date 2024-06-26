import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../services/carrito.service';
import { AuthService } from '../services/auth.service';
import { ProductoEnCarrito } from '../model/producto-en-carrito';
import { Producto } from '../model/producto';
import { ProductoService } from '../services/producto.service';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrito.component.html',
})

export class CarritoComponent implements OnInit {

  productos: ProductoEnCarrito[] = [];
  prods: Producto[] = [];

  email: string = '';

  total: number = 0;

  constructor(
    private carritoService: CarritoService,
    private authService: AuthService,
    private productoService: ProductoService
  ) {}

  ngOnInit(): void {
    this.email = this.authService.getEmail()!;
    this.loadCarrito();
  }

  loadCarrito() {
    this.carritoService.get(this.email).subscribe((productos) => {
      this.productos = productos;
      this.total = 0;  
      const requests = productos.map(producto => 
        this.productoService.getProductoById(producto.idProd).toPromise()
      );
      Promise.all(requests).then(productosObtenidos => {
        this.prods = productosObtenidos.filter(prod => prod !== undefined) as Producto[];
        this.prods.forEach((prod, index) => {
          this.total += this.productos[index].cantidad * prod.precio;
        });
      }).catch(error => {
        console.error('Error al obtener los productos:', error);
      });
    });
  }
}
