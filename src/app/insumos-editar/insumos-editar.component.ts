import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InsumoService } from '../services/insumo.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-insumos-editar',
  standalone: true,
  imports: [ ReactiveFormsModule, HttpClientModule, CommonModule],
  templateUrl: './insumos-editar.component.html',
  styleUrl: './insumos-editar.component.css'
})
export class InsumosEditarComponent implements OnInit{

  insumoForm: FormGroup;
  insumoId: number;
  unidades = ['Kg', 'Lt', 'Unidad/es'];

  // Variables para los modales de éxito y error
  showSuccessModal: boolean = false;
  showErrorModal: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private insumoService: InsumoService
  ) {
    this.insumoId = +this.route.snapshot.params['id'];
    this.insumoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)], [this.uniqueNameValidator()]],
      unidad: ['', [Validators.required]],
    });
  }

  // Chequear si el nombre es unico
  uniqueNameValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.insumoService.get().pipe(
        map((insumos) => {
          const insumo = insumos.find((i) => i.nombre === control.value && i.id !== this.insumoId);
          return insumo ? { uniqueName: true } : null;
        })
      );
    };
  }

  ngOnInit(): void {
    this.loadInsumo();
  }

  loadInsumo(): void {
    this.insumoService.getInsumoById(this.insumoId).subscribe({
      next: (data) => {
        this.insumoForm.patchValue(data);
      },
      error: (error) => {
        console.error('Error al cargar el insumo', error);
      }
    });
  }

  onSubmit(): void {
    if (this.insumoForm.valid) {
      this.insumoService.update(this.insumoId, this.insumoForm.value).subscribe({
        next: () => {
          this.showSuccessModal = true;
        },
        error: (error) => {
          this.showErrorModal = true;
          console.error('Error al actualizar el insumo', error);
        }
      });
    }
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
    this.router.navigate(['/insumos']);
  }

  closeErrorModal() {
    this.showErrorModal = false;
  }
}
