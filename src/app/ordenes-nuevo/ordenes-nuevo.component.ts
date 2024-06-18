import { Component, OnInit, AfterViewInit } from '@angular/core';
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
export class OrdenesNuevoComponent implements OnInit, AfterViewInit {

  ordenForm: FormGroup;
  productos: Producto[] = [];
  cobro: number = 0;
  choices: any;

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
      const ids = selectedProductIds.map((id: any) => (parseInt(id, 10)));
      console.log('Productos seleccionados:', ids);
      this.calcularCobro(ids);
    });
  }

  ngOnInit(): void {
    this.cargarProductos();
  }

  ngAfterViewInit(): void {
    this.initializeChoices();
  }

  cargarProductos(): void {
    this.productoService.get().subscribe({
      next: (productos) => {
        console.log('Productos cargados:', productos);
        this.productos = productos;
        this.updateChoices();
      },
      error: (error) => {
        console.error('Error al cargar los productos', error);
      }
    });
  }

  initializeChoices(): void {
    const element = document.getElementById('productos');
    if (element) {
      this.choices = new Choices(element, {
        removeItemButton: true,
        noResultsText: 'No hay resultados',
        noChoicesText: 'No hay opciones disponibles',
        itemSelectText: 'Elegir',
        placeholderValue: 'Selecciona productos',
        allowHTML: true
      });
    }
  }

  updateChoices(): void {
    if (this.choices) {
      this.choices.clearStore();
      this.productos.forEach(producto => {
        this.choices.setChoices([{ value: producto.id.toString(), label: producto.nombre, selected: false, disabled: false }], 'value', 'label', false);
        console.log('Producto añadido a Choices:', { id: producto.id, nombre: producto.nombre });
      });
    }
    console.log('Estado actual de Choices:', this.choices._currentState);
    console.log('Opciones actuales de Choices:', this.choices._currentState.choices);
  }

  calcularCobro(selectedProductIds: number[]): void {
    console.log('Productos para calcular cobro:', selectedProductIds);
    this.cobro = selectedProductIds
      .map(id => this.productos.find(producto => producto.id === id)?.precio || 0)
      .reduce((total, precio) => total + precio, 0);
    console.log('Cobro calculado:', this.cobro);
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
