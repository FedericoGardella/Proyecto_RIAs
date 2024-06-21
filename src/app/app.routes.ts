import { Routes } from '@angular/router';
import { ProductosComponent } from './productos/productos.component';
import { LoginComponent } from './login/login.component';
import { ProductosNuevoComponent } from './productos-nuevo/productos-nuevo.component';
import { ProductosEditarComponent } from './productos-editar/productos-editar.component';
import { RegisterComponent } from './register/register.component';
import { OrdenesComponent } from './ordenes/ordenes.component';
import { InsumosComponent } from './insumos/insumos.component';
import { InsumosNuevoComponent } from './insumos-nuevo/insumos-nuevo.component';
import { InsumosEditarComponent } from './insumos-editar/insumos-editar.component';
import { OrdenesNuevoComponent } from './ordenes-nuevo/ordenes-nuevo.component';
import { PerfilUsuarioComponent } from './perfil-usuario/perfil-usuario.component';

export const routes: Routes = [
    { path: 'productos', component: ProductosComponent },
    { path: 'productos/add', component: ProductosNuevoComponent},
    { path: 'productos/update/:id', component: ProductosEditarComponent},
    { path: 'ordenes/add', component: OrdenesNuevoComponent},
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'ordenes', component: OrdenesComponent },
    { path: 'insumos', component: InsumosComponent},
    { path: 'insumos/add', component: InsumosNuevoComponent},
    { path: 'insumos/update/:id', component: InsumosEditarComponent},
    { path: 'usuarios/:id', component: PerfilUsuarioComponent}
    //{ path: '', redirectTo: '/login', pathMatch: 'full' }
];
