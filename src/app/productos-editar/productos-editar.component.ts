import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AsyncValidatorFn, AbstractControl, ValidationErrors, FormArray, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService } from '../services/producto.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Observable, map } from 'rxjs';
import { InsumoService } from '../services/insumo.service';
import { Insumo } from '../model/insumo';
import e from 'express';

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
  allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
  searchInsumo: string = '';

  // Variables para los modales de éxito y error
  showSuccessModal: boolean = false;
  showErrorModal: boolean = false;

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
      imagen: ['', [Validators.required, this.isValidImage(this.allowedExtensions)]],
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

  // Chequear si la imagen es valida
  isValidImage(allowedExtensions: string[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const file = control.value;
      
      if (file) {
        //console.log('Archivo:', file);
        const fileExtension = file.split('.').pop()?.toLowerCase();
        if (allowedExtensions.indexOf(fileExtension) === -1) {
          console.log('Extension no permitida:', fileExtension);
          return { 'fileType': { value: control.value } };
        }
      }
      return null;
    };
  }

  ngOnInit(): void {
    this.loadInsumos().subscribe(() => {
      this.loadProducto();
    });
  }

  loadInsumos(): Observable<Insumo[]> {
    return this.insumoService.get().pipe(map((insumos) => {
      this.insumos = insumos;
      //this.updateAvailableInsumos();
      //console.log('Insumos cargados', insumos);
      return insumos;
    }));
  }

  loadProducto(): void {
    this.productoService.getProductoById(this.productoId).subscribe({
      next: (data) => {
        this.productoForm.patchValue(data);
        this.setInsumos(data.insumos);
        //console.log('Producto cargado', data);
        this.updateAvailableInsumos();
      },
      error: (error) => {
        console.error('Error al cargar producto', error);
      }
    });
  }

  setInsumos(insumos: any[]): void {
    const insumosFGs = insumos.map(insumo => this.fb.group({
      insumoId: [+insumo.id, Validators.required],
      cantidad: [insumo.cantidad, [Validators.required, Validators.min(0.01)]]
    }));
    const insumoFormArray = this.fb.array(insumosFGs);
    this.productoForm.setControl('insumos', insumoFormArray);
    //this.updateAvailableInsumos();
  }

  get insumosControls(): AbstractControl[] {
    return (this.productoForm.get('insumos') as FormArray).controls;
  }

  updateAvailableInsumos(): void {
    // Obtener los IDs de los insumos ya seleccionados
    const selectedInsumoIds = this.insumosControls.map(control => +control.get('insumoId')?.value);

    // Filtrar los insumos disponibles
    this.availableInsumos = this.insumos.filter(insumo => !selectedInsumoIds.includes(insumo.id));
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.productoForm.patchValue({ imagen: this.selectedFile?.name });
    console.log('Archivo seleccionado:', this.selectedFile);
  }

  addInsumo(insumoId: number): void {
    const insumosArray = this.productoForm.get('insumos') as FormArray;
    
    // Verificar si hay insumos disponibles
    if (this.availableInsumos.length === 0) {
      console.log('No hay insumos disponibles');
      return;
    }

    insumosArray.push(this.fb.group({
      insumoId: [insumoId, Validators.required],
      cantidad: ['', [Validators.required, Validators.min(0.01)]]
    }));
    this.updateAvailableInsumos();
  }

  removeInsumo(index: number): void {
    const insumosArray = this.productoForm.get('insumos') as FormArray;
    insumosArray.removeAt(index);
    this.updateAvailableInsumos();
  }

  getInsumoNombre(insumoId: number): string {
    const insumo = this.insumos.find(i => i.id === insumoId);
    return insumo ? insumo.nombre : 'Insumo no encontrado';
  }

  getInsumoUnidad(insumoId: number): string {
    const insumo = this.insumos.find(i => i.id === insumoId);
    return insumo ? insumo.unidad : 'Insumo no encontrado';
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
        //console.log('Datos del producto:', formData);          

        this.productoService.update(this.productoId, formData).subscribe({
            next: (data) => {
                //console.log('Producto actualizado', data);
                this.showSuccessModal = true;
            },
            error: (error) => {
                //console.error('Error al actualizar el producto', error);
                this.showErrorModal = true;
            }
        });
    }
    else {
      console.log('Formulario inválido');
    }
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
    this.router.navigate(['/productos']);
  }

  closeErrorModal() {
    this.showErrorModal = false;
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input) {
      this.searchInsumo = input.value;
      this.updateAvailableInsumos();
    }
  }

  filterAvailableInsumos(): Insumo[] {
    if (this.searchInsumo) {
      return this.availableInsumos.filter(insumo => insumo.nombre.toLowerCase().includes(this.searchInsumo.toLowerCase()));
    }
    return this.availableInsumos;
  }

}
