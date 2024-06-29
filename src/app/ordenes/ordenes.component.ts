import { Component, OnInit } from '@angular/core';
import { Orden } from '../model/orden';
import { OrdenService } from '../services/orden.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FormatProductosPipe } from '../format-productos.pipe';
import e from 'express';
import { ProductoService } from '../services/producto.service';
import { FormatInsumosPipe } from "../format-insumos.pipe";


@Component({
    selector: 'app-ordenes',
    standalone: true,
    templateUrl: './ordenes.component.html',
    styleUrl: './ordenes.component.css',
    imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, FormatProductosPipe, FormatInsumosPipe]
})

export class OrdenesComponent implements OnInit{

  public ordenes: Orden[] = [];
  public displayedColumns: string[] = ['id', 'productos', 'fecha', 'cobro', 'estado'];
  currentPage: number = 1;
  itemsPerPage: number = 4;
  totalPages: number = 1;
  sortField: string = 'none';
  sortDirection: 'asc' | 'desc' = 'asc';
  filterEstado: string = 'todos';
  filterFechaInicio: Date | null = null;
  filterFechaFin: Date | null = null;
  insumosTotales: { id: number, cantidad: number }[] = [];

  showInsumosTotales: boolean = false;

  constructor(
    private ordenesService: OrdenService,
    private productoService: ProductoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOrdenes();
  }

  loadOrdenes(): void {
    this.ordenesService.get().subscribe((ordenes) => {
      this.ordenes = ordenes;
      //this.totalPages = Math.ceil(this.ordenes.length / this.itemsPerPage);
      this.sortAndPaginateOrdenes();
    });
  }

  get paginatedOrdenes(): Orden[] {
    const filteredOrdenes = this.ordenes.filter(orden => {
      const fechaOrden = new Date(orden.fecha);
      const fechaInicioValida = !this.filterFechaInicio || fechaOrden >= new Date(this.filterFechaInicio);
      const fechaFinValida = !this.filterFechaFin || fechaOrden <= new Date(this.filterFechaFin);
      const estadoValido = this.filterEstado === 'todos' || orden.estado === this.filterEstado;
  
      return fechaInicioValida && fechaFinValida && estadoValido;
    });    
    
    this.totalPages = Math.ceil(filteredOrdenes.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    // Ver ordenes filtradas
    console.log('Ordenes filtradas:', filteredOrdenes);

    return filteredOrdenes.slice(startIndex, startIndex + this.itemsPerPage);
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
    const selectedValue = (event.target as HTMLSelectElement).value;
    const [field, direction] = selectedValue.split('-');
    if (field && direction) {
      this.sortField = field;
      this.sortDirection = direction as 'asc' | 'desc';
      this.sortAndPaginateOrdenes();
    } else {
      this.loadOrdenes();
    }
  }

  onFilterEstadoChange(event: Event): void {
    this.filterEstado = (event.target as HTMLSelectElement).value;
    this.sortAndPaginateOrdenes();
  }

  onFilterFechaChange(event: Event, tipo: 'inicio' | 'fin'): void {
    const fechaSeleccionada = (event.target as HTMLInputElement).value;
    
    if (tipo === 'inicio') {
      this.filterFechaInicio = fechaSeleccionada ? new Date(fechaSeleccionada) : null;
    } else if (tipo === 'fin') {
      this.filterFechaFin = fechaSeleccionada ? new Date(fechaSeleccionada) : null;
    }
  
    this.sortAndPaginateOrdenes();
  }

  sortAndPaginateOrdenes(): void {
    this.ordenes.sort((a, b) => {
      const fechaA = new Date(a.fecha).getTime();
      const fechaB = new Date(b.fecha).getTime();
      
      if (fechaA !== fechaB) {
        return this.sortDirection === 'asc' ? fechaA - fechaB : fechaB - fechaA;
      }
  
      const estadoOrder: { [key: string]: number } = {
        'Pendiente': 1,
        'En Preparacion': 2,
        'Listo': 3
      };
  
      return estadoOrder[a.estado] - estadoOrder[b.estado];
    });
  
    this.totalPages = Math.ceil(this.ordenes.length / this.itemsPerPage);
    this.goToPage(1);
  }


  verOrden(orden: Orden): void {
    this.router.navigate(['/ordenes', orden.id]);
  }  

  editOrden(orden: Orden, estado : string): void {
    orden.estado = estado;
    this.ordenesService.edit(orden).subscribe({
      next: () => {
        this.loadOrdenes(); // Recargar la lista de ordenes
      },
      error: (error) => {
        console.error('Error al editar la orden', error);
        alert('Hubo un error al editar la orden');
      }
    });
  }

  // Calcular insumos totales, pero de las ordenes filtradas (no por pagina)
  calcularInsumosTotalesFiltrados(): void {
    this.insumosTotales = [];

    const ordenesFiltradas = this.ordenes.filter((orden) => {
      const fechaOrden = new Date(orden.fecha);
      const fechaInicioValida = !this.filterFechaInicio || fechaOrden >= new Date(this.filterFechaInicio);
      const fechaFinValida = !this.filterFechaFin || fechaOrden <= new Date(this.filterFechaFin);
      const estadoValido = this.filterEstado === 'todos' || orden.estado === this.filterEstado;

      return fechaInicioValida && fechaFinValida && estadoValido;
    });

    ordenesFiltradas.forEach((orden) => {
      orden.productos.forEach((productoEnOrden) => {
        this.productoService.getProductoById(productoEnOrden.id).subscribe((producto) => {
          producto.insumos.forEach((insumo: any) => {
            // Pasar id a number
            insumo.id = +insumo.id;
            const insumoExistente = this.insumosTotales.findIndex((i) => i.id === insumo.id);
            const cantidadNueva = Math.round((insumo.cantidad * productoEnOrden.cantidad) * 100) / 100; // Redondear a dos decimales

            if (insumoExistente !== -1) {
              this.insumosTotales[insumoExistente].cantidad += cantidadNueva;
            } else {
              this.insumosTotales.push({ id: insumo.id, cantidad: cantidadNueva });
            }
          });
        });
      });
    });
    // Ver insumos totales
    console.log('Insumos totales:', this.insumosTotales);
  }

  showModalInsumosTotales(): void {
    this.showInsumosTotales = true;
    this.calcularInsumosTotalesFiltrados();
  }

  closeModalInsumosTotales(): void {
    this.showInsumosTotales = false;
  }


  

}
