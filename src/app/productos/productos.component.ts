import { Component, OnInit } from '@angular/core';
import { Producto } from '../model/producto';
import { ProductoService } from '../services/producto.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  public productos: Producto[] = [];
  public displayedColumns: string[] = ['id', 'nombre', 'descripcion', 'imagen', 'precio'];

  constructor(private productosService: ProductoService) {}

  ngOnInit(): void {
    this.productosService.get().subscribe((productos) => {
      this.productos = productos;
    });
  }
}
