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
  
  constructor(private insumoService: InsumoService) {}

  ngOnInit(): void {
    this.loadInsumos();
  }

  loadInsumos(): void {
    this.insumoService.get().subscribe((insumos) => {
      this.insumos = insumos;
      console.log('Insumos cargados', insumos);
    });
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
