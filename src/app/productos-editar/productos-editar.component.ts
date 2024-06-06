import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService } from '../services/producto.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-productos-editar',
  standalone: true,
  imports: [ ReactiveFormsModule, HttpClientModule, CommonModule],
  templateUrl: './productos-editar.component.html',
  styleUrl: './productos-editar.component.css'
})
export class ProductosEditarComponent implements OnInit{

  productoForm: FormGroup;
  productoId: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productoService: ProductoService
  ) {
    //this.productoId = this.route.snapshot.params['get']('id') || '';
    this.productoId = +this.route.snapshot.params['id'];
    this.productoForm = this.fb.group({
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      imagen: ['', [Validators.required]],
      precio: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadProducto();
  }

  loadProducto(): void {
    this.productoService.getProductoById(this.productoId).subscribe({
      next: (data) => {
        this.productoForm.patchValue(data);
      },
      error: (error) => {
        console.error('Error al cargar producto', error);
      }
    });
  }

  onSubmit(): void {
    if (this.productoForm.valid) {
      const producto = this.productoForm.value;
      producto.id = this.productoId;
      
      this.productoService.edit(producto).subscribe({
        next: (data) => {
          //mostrar mensaje de exito
          console.log('Producto actualizado', data);
          this.router.navigate(['/productos']);
        },
        error: (error) => {
          console.error('Error al actualizar el hospital', error);
        }
      });
    }
  }
  

}
