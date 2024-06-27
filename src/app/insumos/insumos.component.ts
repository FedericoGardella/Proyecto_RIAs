import { Component, OnInit } from '@angular/core';
import { InsumoService } from '../services/insumo.service';
import { Insumo } from '../model/insumo';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

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

  // Variables para los modales de éxito y error
  showSuccessModal: boolean = false;
  showErrorModal: boolean = false;

  showConfirmModal: boolean = false;
  insumoIdToDelete: number | null = null;
  
  constructor(
    private insumoService: InsumoService,
    private router: Router
  ) {}

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
    this.insumoIdToDelete = id;
    this.showConfirmModal = true;
  }

  confirmDelete(): void {
    if (this.insumoIdToDelete !== null) {
      this.insumoService.delete(this.insumoIdToDelete).subscribe({
        next: () => {
          this.showSuccessModal = true;
          this.showConfirmModal = false;
        },
        error: (error) => {
          console.error('Error al eliminar el insumo', error);
          this.showErrorModal = true;
          this.showConfirmModal = false;
        }
      });
    }
  }

  cancelDelete(): void {
    this.showConfirmModal = false;
    this.insumoIdToDelete = null;
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
    this.loadInsumos(); // Recargar la lista de insumos
  }

  closeErrorModal() {
    this.showErrorModal = false;
  }

}
