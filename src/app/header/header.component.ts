import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  userId: number | null = 0;
  userRole: string | null = null;
  
  constructor(
    public authService: AuthService,
    private router: Router
  ) {
    this.userId = this.authService.getUserId();
    this.userRole = this.authService.getRole();
    console.log(this.userId);
    console.log(this.userRole);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
  
}
