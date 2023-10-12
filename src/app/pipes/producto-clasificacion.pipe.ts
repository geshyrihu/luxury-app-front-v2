import { Pipe, PipeTransform } from '@angular/core';
import { EProductClasificacion } from 'src/app/enums/producto-clasificacion.enum';
import { onGetSelectItemFromEnum } from 'src/app/helpers/enumeration';

@Pipe({
  name: 'eProductoClasificacion',
  standalone: true,
})
export class EProductoClasificacionPipe implements PipeTransform {
  enum: any[] = onGetSelectItemFromEnum(EProductClasificacion);
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
