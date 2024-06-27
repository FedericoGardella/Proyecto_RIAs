import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../services/producto.service';
import { CarritoService } from '../services/carrito.service';
import { Producto } from '../model/producto';
import { ProductoEnCarrito } from '../model/producto-en-carrito';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-ordenes-nuevo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ordenes-nuevo.component.html',
  styleUrls: ['./ordenes-nuevo.component.scss']
})
export class OrdenesNuevoComponent implements OnInit {
  productos: Producto[] = [];
  filteredProductos: Producto[] = [];
  email: string = '';
  cantidades: { [key: number]: number } = {};
  mensajeError: string = '';
  mensajeExito: string = '';
  showErrorModal: boolean = false;
  showSuccessModal: boolean = false;
  currentPage: number = 1;
  itemsPerPage: number = 4;
  totalPages: number = 1;
  searchTerm: string = '';

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
      this.filterProductos();
    });
  }

  agregarAlCarrito(producto: Producto, cantidad: number) {
    console.log('Cantidad: ', cantidad);

    if (cantidad === 0) {
      this.mensajeError = 'La cantidad no puede ser 0';
      this.showErrorModal = true;
      return;
    }

    if (cantidad < 0) {
      this.mensajeError = 'La cantidad no puede ser negativa';
      this.showErrorModal = true;
      return;
    }

    // Verificar si cantidad es null
    if (cantidad === null) {
      this.mensajeError = 'La cantidad no puede ser nula y debe ser un número';
      this.showErrorModal = true;
      return;
    }

    // Verificar si cantidad es un entero
    if (!Number.isInteger(cantidad)) {
      this.mensajeError = 'La cantidad debe ser un número entero';
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

  filterProductos() {
    this.filteredProductos = this.productos.filter(producto => 
      producto.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.totalPages = Math.ceil(this.filteredProductos.length / this.itemsPerPage);
    this.goToPage(1);
  }

  get paginatedProductos(): Producto[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredProductos.slice(startIndex, startIndex + this.itemsPerPage);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  onPageNumberClick(event: Event, page: number): void {
    event.preventDefault();
    this.goToPage(page);
  }
}
