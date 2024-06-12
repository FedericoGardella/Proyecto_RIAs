import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService } from '../services/producto.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Observable, map } from 'rxjs';

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
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productoService: ProductoService
  ) {
    this.productoId = +this.route.snapshot.params['id'];
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
          const producto = productos.find((p) => p.nombre === control.value && p.id !== this.productoId);
          return producto ? { uniqueName: true } : null;
        })
      );
    };
  }

  ngOnInit(): void {
    this.loadProducto();
  }

  loadProducto(): void {
    this.productoService.getProductoById(this.productoId).subscribe({
      next: (data) => {
        this.productoForm.patchValue(data);
        //this.productoForm.patchValue({ imagen: data.imagen });
        console.log('Producto cargado', data);
      },
      error: (error) => {
        console.error('Error al cargar producto', error);
      }
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.productoForm.patchValue({ imagen: this.selectedFile?.name });
    console.log('Archivo seleccionado:', this.selectedFile);
  }

  /* onSubmit(): void {
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
  } */
  
    onSubmit(): void {
      if (this.productoForm.valid) {
          const formData = new FormData();
          const producto = this.productoForm.value;
  
          // Añadir los datos del producto al FormData
          formData.append('nombre', producto.nombre);
          formData.append('descripcion', producto.descripcion);
          formData.append('precio', producto.precio.toString());

          // Añadir la imagen solo si se ha seleccionado una nueva
          if (this.selectedFile) {
            formData.append('imagen', this.selectedFile);
          } else {
              // Mantener la imagen existente si no se ha seleccionado una nueva
              formData.append('imagen', producto.imagen);
          }

          console.log('Formulario válido, enviando datos...');
          //mostrar datos en consola
          console.log('Datos del producto:', formData);          
  
          this.productoService.update(this.productoId, formData).subscribe({
              next: (data) => {
                  console.log('Producto actualizado', data);
                  alert('Producto actualizado');
                  this.router.navigate(['/productos']);
              },
              error: (error) => {
                  console.error('Error al actualizar el producto', error);
              }
          });
      }
      else {
        console.log('Formulario inválido');
      }
  }

}
