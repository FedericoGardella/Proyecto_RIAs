import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Usuario } from '../model/usuario';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ ReactiveFormsModule, HttpClientModule, CommonModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { 
    this.registerForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      role: ['', [Validators.required]],
      telefono: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const newUsuario: Usuario = this.registerForm.value;
      this.authService.register(newUsuario).subscribe({
        next: () => {
          alert('Usuario registrado exitosamente');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Error al registrar el usuario', error);
          alert('Hubo un error al registrar el usuario');
        }
      });
    }
  }

  

}
