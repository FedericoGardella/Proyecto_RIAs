import { Component, OnInit } from '@angular/core';
import { Producto } from '../model/producto';
import { ProductoService } from '../services/producto.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OrdenService } from '../services/orden.service';
import { CarritoService } from '../services/carrito.service';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  public productos: Producto[] = [];
  public filteredProductos: Producto[] = [];
  public displayedColumns: string[] = ['id', 'nombre', 'descripcion', 'imagen', 'precio', 'insumos'];
  router: any;
  currentPage: number = 1;
  itemsPerPage: number = 3;
  totalPages: number = 1;
  searchTerm: string = '';
  sortOption: string = 'none';

  // Variables para los modales de éxito y error
  showSuccessModal: boolean = false;
  showErrorModal: boolean = false;

  showConfirmModal: boolean = false;
  productoIdToDelete: number | null = null;
  precioToDelete: number | null = null;

  constructor(
    private productosService: ProductoService, 
    private ordenesService: OrdenService, 
    private carritoService: CarritoService

  ) {}

  ngOnInit(): void {
    this.loadProductos();
  }

  loadProductos(): void {
    this.productosService.get().subscribe((productos) => {
      this.productos = productos;
      this.filterProductos();
    });
  }

  filterProductos(): void {
    let productosFiltrados = this.productos.filter(producto =>
      producto.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    // Ordenar productos
    if (this.sortOption === 'asc') {
      productosFiltrados.sort((a, b) => a.precio - b.precio);
    } else if (this.sortOption === 'desc') {
      productosFiltrados.sort((a, b) => b.precio - a.precio);
    }

    this.filteredProductos = productosFiltrados;
    this.totalPages = Math.ceil(this.filteredProductos.length / this.itemsPerPage);
    this.goToPage(1); 
  }

  get paginatedProductos(): Producto[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredProductos.slice(startIndex, startIndex + this.itemsPerPage);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;  
    }    
  }

  onPageNumberClick(event: Event, page: number): void {
    event.preventDefault();
    this.goToPage(page);
  }

  onSortOptionChange(event: Event): void {
    this.sortOption = (event.target as HTMLSelectElement).value;
    this.filterProductos();
  }

  deleteProducto(id: number): void {
    this.productoIdToDelete = id;
    this.showConfirmModal = true;
  }

  confirmDelete(): void {
    if (this.productoIdToDelete !== null) {
      this.precioToDelete = this.productos.find(producto => producto.id == this.productoIdToDelete)!.precio;
      this.productosService.delete(this.productoIdToDelete).subscribe({
        next: () => {
          this.ordenesService.deleteProductoFromOrdenes(this.productoIdToDelete!,this.precioToDelete!).subscribe({
            next: () => {
              console.log('Producto eliminado de las ordenes');
            },
            error: (error) => {
              console.error('Error al eliminar el producto de las ordenes');
            }
          
          });
          this.carritoService.deleteProducto(this.productoIdToDelete!).subscribe({
            next: () => {
              console.log('Producto eliminado de los carritos');
            },
            error: (error) => {
              console.error('Error al eliminar el producto de los carritos');
            }
          });
          this.showSuccessModal = true;
          this.showConfirmModal = false;
        },
        error: (error) => {
          this.showErrorModal = true;
          this.showConfirmModal = false;
        }
      });
    }
  }

  cancelDelete(): void {
    this.showConfirmModal = false;
    this.productoIdToDelete = null;
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
    this.loadProductos();
  }

  closeErrorModal() {
    this.showErrorModal = false;
  }

}
