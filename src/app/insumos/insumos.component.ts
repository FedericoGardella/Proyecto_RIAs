import { Component, OnInit } from '@angular/core';
import { InsumoService } from '../services/insumo.service';
import { Insumo } from '../model/insumo';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-insumos',
  standalone: true,
  imports: [ CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './insumos.component.html',
  styleUrl: './insumos.component.css'
})
export class InsumosComponent implements OnInit {

  public insumos: Insumo[] = [];
  filteredInsumos: Insumo[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 2;
  totalPages: number = 1;
  searchTerm: string = '';
  
  constructor(private insumoService: InsumoService) {}

  ngOnInit(): void {
    this.loadInsumos();
  }

  loadInsumos(): void {
    this.insumoService.get().subscribe((insumos) => {
      this.insumos = insumos;
      console.log('Insumos cargados', insumos);
      this.filterInsumos();
    });
  }

  filterInsumos(): void {
    this.filteredInsumos = this.insumos.filter(insumo =>
      insumo.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.totalPages = Math.ceil(this.filteredInsumos.length / this.itemsPerPage);
    this.goToPage(1);
  }

  get paginatedInsumos(): Insumo[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredInsumos.slice(startIndex, startIndex + this.itemsPerPage);
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

  deleteInsumo(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar este insumo?')) {
      this.insumoService.delete(id).subscribe({
        next: () => {
          alert('Insumo eliminado exitosamente');
          this.loadInsumos(); // Recargar la lista de insumos
        },
        error: (error) => {
          console.error('Error al eliminar el insumo', error);
          alert('Hubo un error al eliminar el insumo');
        }
      });
    }
  }

}
