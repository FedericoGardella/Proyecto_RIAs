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
  selectedFile: File | null = null;

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

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.productoForm.patchValue({ imagen: this.selectedFile?.name });
    console.log('Archivo seleccionado:', this.selectedFile);
  }

  ngOnInit(): void {
  }

  /* onSubmit(): void {
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
  } */

  onSubmit(): void {
    if (this.productoForm.valid && this.selectedFile) {
      const formData = new FormData();
      formData.append('nombre', this.productoForm.get('nombre')?.value);
      formData.append('descripcion', this.productoForm.get('descripcion')?.value);
      formData.append('imagen', this.selectedFile);
      formData.append('precio', this.productoForm.get('precio')?.value);

      console.log('Formulario válido, enviando datos...');

      this.productoService.add(formData).subscribe({
        next: () => {
          alert('Producto añadido exitosamente');
          this.router.navigate(['/productos']);
        },
        error: (error) => {
          console.error('Error al añadir el producto', error);
          alert('Hubo un error al añadir el producto');
        }
      });
    }
    else {
      console.log('Formulario inválido o archivo no seleccionado'); // Añadir esta línea para verificar el estado del formulario
    }
  }

}
