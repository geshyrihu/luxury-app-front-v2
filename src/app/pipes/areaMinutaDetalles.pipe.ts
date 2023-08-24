import { Pipe, PipeTransform } from '@angular/core';
import { EAreaMinutasDetalles } from '../enums/area-minutas-detalles.enum';
import { onGetEnum } from '../helpers/enumaraciones';

@Pipe({
  name: 'eAreaMinutasDetalles',
  standalone: true,
})
export class EAreaMinutasDetallesPipe implements PipeTransform {
  enum: any[] = onGetEnum(EAreaMinutasDetalles);
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
