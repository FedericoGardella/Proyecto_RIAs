import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [],
  templateUrl: './perfil-usuario.component.html',
  styleUrl: './perfil-usuario.component.css'
})
export class PerfilUsuarioComponent implements OnInit{

  user: any;
  userId: number;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute
  ) { 
    this.userId = +this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.loadUser();
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
}
