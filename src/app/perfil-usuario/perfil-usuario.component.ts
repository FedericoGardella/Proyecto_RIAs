import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdenService } from '../services/orden.service';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormatProductosPipe } from "../format-productos.pipe";
import { Orden } from '../model/orden';

@Component({
    selector: 'app-perfil-usuario',
    standalone: true,
    templateUrl: './perfil-usuario.component.html',
    styleUrl: './perfil-usuario.component.css',
    imports: [CommonModule, FormatProductosPipe]
})
export class PerfilUsuarioComponent implements OnInit{

  user: any;
  userId: number;
  userEmail: string = '';
  ordenes: any[] = [];

  constructor(
    private userService: UserService,
    private ordenService: OrdenService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) { 
    this.userId = +this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.userEmail = this.authService.getEmail()!;
    console.log('Email:', this.userEmail);
    this.loadUser();
    this.loadOrdenes();
    
  }

  loadUser(): void {
    this.userService.getProfile(this.userId).subscribe(
      data => {
        this.user = data;
        console.log('Usuario:', this.user);
      },
      error => {
        console.error('Error al obtener usuario:', error);
      }
    );
  }

  loadOrdenes(): void {
    if (this.userEmail) {
      this.ordenService.getOrdenesByCliente(this.userEmail).subscribe(
        data => {
          this.ordenes = data;
          console.log('Ordenes:', this.ordenes);
        },
        error => {
          console.error('Error al obtener ordenes:', error);
        }
      );
    }
    else {
      console.error('No se puede obtener ordenes sin email');
    }
  }
}
