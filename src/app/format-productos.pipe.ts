import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatProductos',
  standalone: true
})
export class FormatProductosPipe implements PipeTransform {
  transform(productos: { id: number, cantidad: number }[] | undefined): string {
    if (!productos) {
      return '';
    }
    return productos.map(p => `ID: ${p.id}  x${p.cantidad}`).join('\n');
  }
}
