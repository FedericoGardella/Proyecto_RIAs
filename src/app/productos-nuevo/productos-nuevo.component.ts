import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormArray, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ProductoService } from '../services/producto.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { Producto } from '../model/producto';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Observable, map } from 'rxjs';
import { Insumo } from '../model/insumo';
import { InsumoService } from '../services/insumo.service';

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
  insumos: Insumo[] = [];
  selectedInsumos: any[] = [];
  availableInsumos: Insumo[] = [];

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private insumoService: InsumoService,
    private router: Router
  ) {

    this.productoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30)], [this.uniqueNameValidator()]],
      descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(150)]],
      imagen: ['', [Validators.required]],
      precio: ['', [Validators.required, Validators.min(0.01)]],
      insumos: this.fb.array([])
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
    this.loadInsumos();
  }

  loadInsumos(): void {
    this.insumoService.get().subscribe((insumos) => {
      this.insumos = insumos;
      this.updateAvailableInsumos();
    });
  }

  get insumosControls() {
    return (this.productoForm.get('insumos') as FormArray).controls;
  }

  getInsumoNombre(insumoId: number): string {
    const insumo = this.insumos.find(i => i.id === insumoId);
    return insumo ? insumo.nombre : 'Insumo no encontrado';
  }  

  addInsumo(insumoId: number): void {
    const selectedInsumo = this.insumos.find(insumo => insumo.id === insumoId);
    if (selectedInsumo) {
      const insumosArray = this.productoForm.get('insumos') as FormArray;
      insumosArray.push(this.fb.group({
        insumoId: [insumoId, Validators.required],
        cantidad: ['', [Validators.required, Validators.min(0.01)]]
      }));
      this.updateAvailableInsumos();
    }
  }

  removeInsumo(index: number): void {
    //(this.productoForm.get('insumos') as FormArray).removeAt(index);
    const insumosArray = this.productoForm.get('insumos') as FormArray;
    insumosArray.removeAt(index);
    this.updateAvailableInsumos();
  }

  updateAvailableInsumos(): void {
    const selectedInsumoIds = this.insumosControls.map(control => control.get('insumoId')?.value);
    this.availableInsumos = this.insumos.filter(insumo => !selectedInsumoIds.includes(insumo.id));
  }

  onSubmit(): void {
    if (this.productoForm.valid && this.selectedFile) {
      const formData = new FormData();
      formData.append('nombre', this.productoForm.get('nombre')?.value);
      formData.append('descripcion', this.productoForm.get('descripcion')?.value);
      formData.append('imagen', this.selectedFile);
      formData.append('precio', this.productoForm.get('precio')?.value);
      const insumos = this.productoForm.get('insumos')?.value || [];
        insumos.forEach((insumo: any, index: number) => {
            formData.append(`insumos[${index}][insumoId]`, insumo.insumoId);
            formData.append(`insumos[${index}][cantidad]`, insumo.cantidad);
        });

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
      console.log('Formulario inválido o archivo no seleccionado');
    }
  }
}
