import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductoService } from '../services/producto.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { Producto } from '../model/producto';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-productos-nuevo',
  standalone: true,
  imports: [ ReactiveFormsModule, HttpClientModule, CommonModule],
  templateUrl: './productos-nuevo.component.html',
  styleUrl: './productos-nuevo.component.css'
})
export class ProductosNuevoComponent implements OnInit{

  productoForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private router: Router
  ) {

    this.productoForm = this.fb.group({
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      imagen: ['', [Validators.required]],
      precio: ['', [Validators.required]],
    });

  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.productoForm.valid) {
      this.productoService.add(this.productoForm.value).subscribe({
        next: () => {
          this.router.navigate(['/productos']);
        },
        error: (error) => {
          console.error('Error al añadir producto', error);
        }
      });
    }
  }

}
