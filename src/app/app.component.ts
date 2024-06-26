import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'proyecto-angular';
  userId: number | null = 0;

  constructor(
    private authService: AuthService,
  ) {
    this.userId = this.authService.getUserId();
  }
}
