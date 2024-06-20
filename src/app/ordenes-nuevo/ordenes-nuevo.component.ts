import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { OrdenService } from '../services/orden.service';
import { ProductoService } from '../services/producto.service';
import { Router } from '@angular/router';
import { Producto } from '../model/producto';
import { Orden } from '../model/orden';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-ordenes-nuevo',
  standalone: true,
  templateUrl: './ordenes-nuevo.component.html',
  styleUrls: ['./ordenes-nuevo.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule]
})
export class OrdenesNuevoComponent implements OnInit {
  productos: Producto[] = [];
  ordenForm: FormGroup;

  constructor(
    private productoService: ProductoService,
    private ordenService: OrdenService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.ordenForm = this.fb.group({
      fecha: ['', Validators.required],
      productos: this.fb.array([])
    });
  }

  ngOnInit() {
    this.productoService.get().subscribe((data: Producto[]) => {
      this.productos = data;
      this.addProductControls();
    });
  }

  addProductControls() {
    const control = <FormArray>this.ordenForm.controls['productos'];
    this.productos.forEach((producto) => {
      control.push(this.fb.group({
        id: [producto.id],
        nombre: [producto.nombre],
        cantidad: [0, [Validators.min(0)]]
      }));
    });
  }

  get productosFormArray() {
    return <FormArray>this.ordenForm.get('productos');
  }

  onSubmit() {
    if (this.ordenForm.valid) {
      const emailCliente = this.authService.getEmail();
      if (!emailCliente) {
        console.error('Email del cliente es null o undefined');
        return;
      }

      const productosConCantidad = this.ordenForm.value.productos.filter((p: any) => p.cantidad > 0);

      const nuevaOrden: Orden = {
        id: 0,
        productos: productosConCantidad.map((p: any) => ({
          id: p.id,
          cantidad: p.cantidad
        })),
        fecha: this.ordenForm.get('fecha')?.value,
        cobro: this.calculateCobro(productosConCantidad),
        estado: 'Pendiente',
        cliente: emailCliente,
      };

      this.ordenService.add(nuevaOrden).subscribe(response => {
        this.router.navigate(['/ordenes']);
      });
    }
  }

  calculateCobro(productos: { id: string, cantidad: number }[]): number {
    return productos.reduce((total, producto) => {
      const productoInfo = this.productos.find(p => p.id === +producto.id);
      return total + (productoInfo ? productoInfo.precio * producto.cantidad : 0);
    }, 0);
  }
}
