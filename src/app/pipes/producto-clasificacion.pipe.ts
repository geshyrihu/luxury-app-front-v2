import { Pipe, PipeTransform } from '@angular/core';
import { EProductClasificacion } from 'src/app/enums/producto-clasificacion.enum';
import { onGetEnum } from 'src/app/helpers/enumaraciones';

@Pipe({
  name: 'eProductoClasificacion',
  standalone: true,
})
export class EProductoClasificacionPipe implements PipeTransform {
  enum: any[] = onGetEnum(EProductClasificacion);
  transform(value: unknown): string {
    let dato: string = '';
    if (value === null) {
      dato = '';
    } else {
      this.enum.forEach((item) => {
        if (value === item.value) {
          dato = item.label;
        }
      });
    }
    return dato;
  }
}
