import { Routes } from '@angular/router';
import { ProductosComponent } from './productos/productos.component';
import { LoginComponent } from './login/login.component';
import { ProductosNuevoComponent } from './productos-nuevo/productos-nuevo.component';
import { ProductosEditarComponent } from './productos-editar/productos-editar.component';
import { RegisterComponent } from './register/register.component';
import { OrdenesComponent } from './ordenes/ordenes.component';

export const routes: Routes = [
    { path: 'productos', component: ProductosComponent },
    { path: 'productos/add', component: ProductosNuevoComponent},
    { path: 'productos/edit/:id', component: ProductosEditarComponent},
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'ordenes', component: OrdenesComponent },
    //{ path: '', redirectTo: '/login', pathMatch: 'full' }
];
