import { Component, OnInit } from '@angular/core';
import { Orden } from '../model/orden';
import { OrdenService } from '../services/orden.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FormatProductosPipe } from '../format-productos.pipe';


@Component({
  selector: 'app-ordenes',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, FormatProductosPipe],
  templateUrl: './ordenes.component.html',
  styleUrl: './ordenes.component.css'
})

export class OrdenesComponent implements OnInit{

  public ordenes: Orden[] = [];
  public displayedColumns: string[] = ['id', 'productos', 'fecha', 'cobro', 'estado'];


  constructor(
    private ordenesService: OrdenService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOrdenes();
  }

  loadOrdenes(): void {
    this.ordenesService.get().subscribe((ordenes) => {
      this.ordenes = ordenes;
    });
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

}
