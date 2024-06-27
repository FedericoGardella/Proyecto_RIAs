import { Component, OnInit } from '@angular/core';
import { Usuario } from '../model/usuario';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

interface UsuarioWithStartingRole extends Usuario {
  startingRole: string;
}

@Component({
  selector: 'app-usuarios-listar',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './usuarios-listar.component.html',
  styleUrl: './usuarios-listar.component.css'
})

export class UsuariosListarComponent implements OnInit{
  usuarios: UsuarioWithStartingRole[] = [];
  roles: string[] = ['ADMIN', 'PANADERO', 'USER'];
  emailUsuario: string | null = null;

  // Variables para los modales de éxito y error
  showSuccessModal: boolean = false;
  showErrorModal: boolean = false;

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUsuarios();
    this.emailUsuario = this.authService.getEmail();
  }

  loadUsuarios(): void {
    this.userService.getAll().subscribe((usuarios) => {
      this.usuarios = usuarios.map((usuario) => ({
        ...usuario,
        startingRole: usuario.role
      }));
    });
  }

  updateRole(id: Number, role: string): void {
    this.userService.updateRole(id, role).subscribe((usuario) => {
      console.log('Rol actualizado:', usuario);
      this.showSuccessModal = true;
    });
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
    this.loadUsuarios();
  }

  closeErrorModal() {
    this.showErrorModal = false;
  }

}
