import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AsyncValidatorFn, AbstractControl, ValidationErrors, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService } from '../services/producto.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Observable, map } from 'rxjs';
import { InsumoService } from '../services/insumo.service';
import { Insumo } from '../model/insumo';

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
  insumos: Insumo[] = [];
  availableInsumos: Insumo[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productoService: ProductoService,
    private insumoService: InsumoService
  ) {
    this.productoId = +this.route.snapshot.params['id'];
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
          const producto = productos.find((p) => p.nombre === control.value && p.id !== this.productoId);
          return producto ? { uniqueName: true } : null;
        })
      );
    };
  }

  ngOnInit(): void {
    this.loadInsumos();
    this.loadProducto();
  }

  loadProducto(): void {
    this.productoService.getProductoById(this.productoId).subscribe({
      next: (data) => {
        this.productoForm.patchValue(data);
        this.setInsumos(data.insumos);
        console.log('Producto cargado', data);
      },
      error: (error) => {
        console.error('Error al cargar producto', error);
      }
    });
  }
  
  loadInsumos(): void {
    this.insumoService.get().subscribe((insumos) => {
      this.insumos = insumos;
      this.updateAvailableInsumos();
    });
  }

  setInsumos(insumos: any[]): void {
    const insumosFGs = insumos.map(insumo => this.fb.group({
      insumoId: [insumo.id || insumo.insumo.id, Validators.required],
      cantidad: [insumo.cantidad, Validators.required]
    }));
    const insumoFormArray = this.fb.array(insumosFGs);
    this.productoForm.setControl('insumos', insumoFormArray);
  }

  get insumosControls(): AbstractControl[] {
    return (this.productoForm.get('insumos') as FormArray).controls;
  }

  updateAvailableInsumos(): void {
    const selectedInsumoIds = this.insumosControls.map(control => control.get('insumoId')?.value);
    this.availableInsumos = this.insumos.filter(insumo => !selectedInsumoIds.includes(insumo.id));
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.productoForm.patchValue({ imagen: this.selectedFile?.name });
    console.log('Archivo seleccionado:', this.selectedFile);
  }

  addInsumo(): void {
    (this.productoForm.get('insumos') as FormArray).push(this.fb.group({
      insumoId: ['', Validators.required],
      cantidad: ['', Validators.required]
    }));
    this.updateAvailableInsumos();
  }

  removeInsumo(index: number): void {
    (this.productoForm.get('insumos') as FormArray).removeAt(index);
    this.updateAvailableInsumos();
  }

  isInsumoSelected(insumoId: number): boolean {
    return this.insumosControls.some(control => control.get('insumoId')?.value === insumoId);
  }
  
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

        const insumos = this.productoForm.get('insumos')?.value || [];
        insumos.forEach((insumo: any, index: number) => {
          formData.append(`insumos[${index}][insumoId]`, insumo.insumoId);
          formData.append(`insumos[${index}][cantidad]`, insumo.cantidad);
        });

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
