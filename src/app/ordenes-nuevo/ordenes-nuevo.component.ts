import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../services/producto.service';
import { CarritoService } from '../services/carrito.service';
import { Producto } from '../model/producto';
import { ProductoEnCarrito } from '../model/producto-en-carrito';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-ordenes-nuevo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ordenes-nuevo.component.html',
  styleUrls: ['./ordenes-nuevo.component.scss']
})
export class OrdenesNuevoComponent implements OnInit {
  productos: Producto[] = [];
  email: string = '';
  cantidades: { [key: number]: number } = {};
  mensajeError: string = '';
  mensajeExito: string = '';
  showErrorModal: boolean = false;
  showSuccessModal: boolean = false;

  constructor(
    private authService: AuthService,
    private productoService: ProductoService,
    private carroService: CarritoService,
  ) {}

  ngOnInit() {
    this.email = this.authService.getEmail()!;
    this.productoService.get().subscribe((data: Producto[]) => {
      this.productos = data;
      this.productos.forEach(producto => {
        this.cantidades[producto.id] = 0;
      });
    });
  }

  agregarAlCarrito(producto: Producto, cantidad: number) {
    if (cantidad === 0) {
      this.mensajeError = 'La cantidad no puede ser 0';
      this.showErrorModal = true;
      return;
    }

    const productoEnCarrito: ProductoEnCarrito = {
      email: this.email, // Debes definir cómo obtener el email del usuario
      idProd: producto.id,
      cantidad: cantidad
    };


    this.carroService.add(productoEnCarrito).subscribe((res) => {
      this.mensajeExito = 'Producto agregado al carrito exitosamente';
      this.showSuccessModal = true;
      // Reiniciar la cantidad del producto específico agregado
      this.cantidades[producto.id] = 0;
    });
  }

  cerrarModalError() {
    this.showErrorModal = false;
  }

  cerrarModalExito() {
    this.showSuccessModal = false;
  }
}
