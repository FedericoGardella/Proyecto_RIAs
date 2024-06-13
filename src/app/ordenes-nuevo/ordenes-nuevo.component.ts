import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrdenService } from '../services/orden.service';
import { ProductoService } from '../services/producto.service';
import { Router } from '@angular/router';
import { Producto } from '../model/producto';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import Choices from 'choices.js';

@Component({
  selector: 'app-ordenes-nuevo',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule],
  templateUrl: './ordenes-nuevo.component.html',
  styleUrls: ['./ordenes-nuevo.component.css']
})
export class OrdenesNuevoComponent implements OnInit {

  ordenForm: FormGroup;
  productos: Producto[] = [];
  cobro: number = 0;

  constructor(
    private fb: FormBuilder,
    private ordenService: OrdenService,
    private productoService: ProductoService,
    private router: Router
  ) {
    this.ordenForm = this.fb.group({
      productos: [[], [Validators.required]], 
      fecha: ['', [Validators.required]],
    });

    this.ordenForm.get('productos')?.valueChanges.subscribe(selectedProductIds => {
      const ids = selectedProductIds.map((id: any) => parseInt(id, 10));
      this.calcularCobro(ids);
      console.log('Productos seleccionados:', ids);
    });
    
  }

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productoService.get().subscribe({
      next: (productos) => {
        console.log('Productos cargados:', productos);
        this.productos = productos;
        this.initializeChoices();
      },
      error: (error) => {
        console.error('Error al cargar los productos', error);
      }
    });
  }

  initializeChoices() {
    const element = document.getElementById('productos');
    const choices = new Choices(element!, {
      removeItemButton: true,
      noResultsText: 'No hay resultados',
      noChoicesText: 'No hay opciones disponibles',
      itemSelectText: 'Elegir',
      placeholderValue: 'Selecciona productos',
      allowHTML: true
    });

    choices.clearStore();

    this.productos.forEach(producto => {
      choices._addChoice({ value: producto.id.toString(), label: producto.nombre });
    });
  }
  

  calcularCobro(selectedProductIds: number[]): void {
    this.cobro = selectedProductIds
      .map(id => this.productos.find(producto => producto.id === id)?.precio || 0)
      .reduce((total, precio) => total + precio, 0);
  }

  onSubmit(): void {
    if (this.ordenForm.valid) {
      const nuevaOrden = {
        productos: this.ordenForm.get('productos')?.value,
        fecha: this.ordenForm.get('fecha')?.value,
        cobro: this.cobro,
        estado: 'Pendiente',
      };

      console.log('Formulario válido, enviando datos...');

      this.ordenService.add(nuevaOrden).subscribe({
        next: () => {
          alert('Orden añadida exitosamente');
          this.router.navigate(['/ordenes']);
        },
        error: (error) => {
          console.error('Error al añadir la orden', error);
          alert('Hubo un error al añadir la orden');
        }
      });
    } else {
      console.log('Formulario inválido');
    }
  }
}
