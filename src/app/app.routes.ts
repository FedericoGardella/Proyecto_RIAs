import { Routes } from '@angular/router';
import { ProductosComponent } from './productos/productos.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    { path: 'productos', component: ProductosComponent },
    { path: 'login', component: LoginComponent },
];
