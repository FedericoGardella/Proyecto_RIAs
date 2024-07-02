import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Usuario } from '../model/usuario';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import e from 'express';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ ReactiveFormsModule, HttpClientModule, CommonModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{
  registerForm: FormGroup;
  errorMessage: string | null = null;
  showModal: boolean = false;
  showSuccess: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { 
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.maxLength(30)]],
      password: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(20)]],
      confirmPassword: ['', [Validators.required]],
      role: ['USER', [Validators.required]],
      telefono: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(12), Validators.pattern('^[0-9]*$')]],
    }, { validators: this.passwordMatchValidator });
  } 

  passwordMatchValidator(form: FormGroup): ValidationErrors | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }
  

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const newUsuario: Usuario = this.registerForm.value;
      this.authService.register(newUsuario).subscribe({
        next: () => {
          this.showSuccess = true;
        },
        error: (error) => {
          console.error('Error al registrar el usuario', error);
          if (error.status === 400) {
            this.errorMessage = error.error.message;
          }
          else {
            this.errorMessage = 'Error al registrar el usuario';
          }
          this.showModal = true;            
        }
      });
    }
  }

  closeModal(): void {
    this.showModal = false;
  }

  closeSuccess(): void {
    this.showSuccess = false;
    this.router.navigate(['/login']);
  }
}
