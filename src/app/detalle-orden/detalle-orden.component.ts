import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrdenService } from '../services/orden.service';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../services/producto.service';
import { FormatProductosPipe } from '../format-productos.pipe';
import { FormatInsumosPipe } from '../format-insumos.pipe';

@Component({
  selector: 'app-detalle-orden',
  standalone: true,
  imports: [CommonModule, FormatProductosPipe, FormatInsumosPipe],
  templateUrl: './detalle-orden.component.html',
  styleUrls: ['./detalle-orden.component.css']
})
export class DetalleOrdenComponent implements OnInit {

  insumos: { id: number, cantidad: number }[] = [];
  ordenId: number;
  data: any;

  constructor(private route: ActivatedRoute, private ordenService: OrdenService, private productoService: ProductoService) {
    this.ordenId = +this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.ordenService.getOrdenById(this.ordenId).subscribe({
      next: (data) => {
        this.data = data;
        this.loadProductos();
        console.log(data); 
        console.log(this.insumos);
      }
    });
  }

  loadProductos(): void {
    this.data.productos.forEach((p: any) => {
        this.productoService.getProductoById(p.id).subscribe(
            (producto) => {
                producto.insumos.forEach((i: any) => {
                    const existingIndex = this.insumos.findIndex((item) => item.id === i.id);
                    const nuevaCantidad = Math.round((i.cantidad * p.cantidad) * 10) / 10; // Redondear a un decimal
                    if (existingIndex !== -1) {
                        this.insumos[existingIndex].cantidad += nuevaCantidad;
                    } else {
                        this.insumos.push({ id: i.id, cantidad: nuevaCantidad });
                    }
                });
            }
        );
    });
}


}
