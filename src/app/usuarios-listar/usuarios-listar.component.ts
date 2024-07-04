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
  filteredUsuarios: UsuarioWithStartingRole[] = [];
  paginatedUsuarios: UsuarioWithStartingRole[] = [];
  roles: string[] = ['ADMIN', 'PANADERO', 'USER'];
  emailUsuario: string | null = null;
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 2;
  totalPages: number = 1;

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
      this.filterUsuarios();
    });
  }

  filterUsuarios(): void {
    this.filteredUsuarios = this.usuarios.filter((usuario) =>
      usuario.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.totalPages = Math.ceil(this.filteredUsuarios.length / this.itemsPerPage);
    this.goToPage(1);
  }

  updateRole(id: Number, role: string): void {
    this.userService.updateRole(id, role).subscribe((usuario) => {
      console.log('Rol actualizado:', usuario);
      this.showSuccessModal = true;
    });
  }

  onSearchTermChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchTerm = inputElement.value || '';
    this.filterUsuarios();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedUsuarios();
    }
  }

  updatePaginatedUsuarios(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedUsuarios = this.filteredUsuarios.slice(startIndex, startIndex + this.itemsPerPage);
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
    this.loadUsuarios();
  }

  closeErrorModal() {
    this.showErrorModal = false;
  }

}
