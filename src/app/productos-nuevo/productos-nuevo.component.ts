import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ProductoService } from '../services/producto.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { Producto } from '../model/producto';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Observable, map } from 'rxjs';

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
      nombre: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30)], [this.uniqueNameValidator()]],
      descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(150)]],
      imagen: ['', [Validators.required]],
      precio: ['', [Validators.required, Validators.min(0.01)]],
    });
  }

  // Chequear si el nombre es unico
  uniqueNameValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.productoService.get().pipe(
        map((productos) => {
          const producto = productos.find((p) => p.nombre === control.value);
          return producto ? { uniqueName: true } : null;
        })
      );
    };
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
