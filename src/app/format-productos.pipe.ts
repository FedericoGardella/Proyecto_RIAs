import { Pipe, PipeTransform, Injector } from '@angular/core';
import { ProductoService } from './services/producto.service';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Pipe({
  name: 'formatProductos',
  standalone: true
})
export class FormatProductosPipe implements PipeTransform {
  private productoService: ProductoService;

  constructor(private injector: Injector) {
    this.productoService = this.injector.get(ProductoService);
  }

  transform(productos: { id: number, cantidad: number }[] | undefined): Observable<string> {
    if (!productos) {
      return new Observable(observer => {
        observer.next('');
        observer.complete();
      });
    }

    const observables = productos.map(p =>
      this.productoService.getProductoById(p.id).pipe(
        map(producto => ({ nombre: producto.nombre, cantidad: p.cantidad }))
      )
    );

    return forkJoin(observables).pipe(
      map(productosConNombre =>
        productosConNombre.map(p => `${p.nombre}  x${p.cantidad}`).join('\n')
      )
    );
  }
}
