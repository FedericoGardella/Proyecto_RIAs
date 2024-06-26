import { Component, OnInit } from '@angular/core';
import { Producto } from '../model/producto';
import { ProductoService } from '../services/producto.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

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

  constructor(private productosService: ProductoService) {}

  ngOnInit(): void {
    this.loadProductos();
  }

  loadProductos(): void {
    this.productosService.get().subscribe((productos) => {
      console.log('Productos recibidos:', productos);
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
    if (confirm('¿Está seguro de que desea eliminar este producto?')) {
      this.productosService.delete(id).subscribe({
        next: () => {
          alert('Producto eliminado exitosamente');
          this.loadProductos(); // Recargar la lista de productos
        },
        error: (error) => {
          console.error('Error al eliminar el producto', error);
          alert('Hubo un error al eliminar el producto');
        }
      });
    }
  }
  
}
