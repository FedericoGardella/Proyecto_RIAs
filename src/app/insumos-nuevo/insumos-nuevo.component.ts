import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { InsumoService } from '../services/insumo.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-insumos-nuevo',
  standalone: true,
  imports: [ ReactiveFormsModule, HttpClientModule, CommonModule],
  templateUrl: './insumos-nuevo.component.html',
  styleUrl: './insumos-nuevo.component.css'
})
export class InsumosNuevoComponent implements OnInit{

  insumoForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private insumoService: InsumoService,
    private router: Router
  ) {

    this.insumoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)], [this.uniqueNameValidator()]],
      unidad: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
    });
  }

  // Chequear si el nombre es unico
  uniqueNameValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.insumoService.get().pipe(
        map((insumos) => {
          const insumo = insumos.find((i) => i.nombre === control.value);
          return insumo ? { uniqueName: true } : null;
        })
      );
    };
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.insumoForm.valid) {
      this.insumoService.add(this.insumoForm.value).subscribe({
        next: () => {
          alert('Insumo creado con éxito');
          this.router.navigate(['/insumos']);
        },
        error: (error) => {
          console.error('Error al añadir el insumo', error);
        }
      });
    }
  }
}
