import { Injector, Pipe, PipeTransform } from '@angular/core';
import { InsumoService } from './services/insumo.service';
import { Observable, forkJoin, map } from 'rxjs';

interface Insumo {
  id: number;
  cantidad: number;
}

@Pipe({
  name: 'formatInsumos',
  standalone: true
})
export class FormatInsumosPipe implements PipeTransform {

  private insumoService: InsumoService;

  constructor(private injector: Injector) {
    this.insumoService = this.injector.get(InsumoService);
  }

  transform(insumosJson: string): Observable<string> {
    const insumos: Insumo[] = JSON.parse(insumosJson);
    if (!insumos || !Array.isArray(insumos)) {
      return new Observable(observer => {
        observer.next('');
        observer.complete();
      });
    }

    const observables = insumos.map(i =>
      this.insumoService.getInsumoById(i.id).pipe(
        map(insumo => ({ nombre: insumo.nombre, cantidad: i.cantidad, unidad: insumo.unidad}))
      )
    );

    return forkJoin(observables).pipe(
      map(insumosConNombre =>
        insumosConNombre.map(i => `${i.nombre}  ${i.cantidad} ${i.unidad}`).join('\n')
      )
    );
  }

}
