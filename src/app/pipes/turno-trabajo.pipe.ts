import { Pipe, PipeTransform } from '@angular/core';
import { ETurnoTrabajo } from '../enums/turno-trabajo.enum';
import { onGetEnum } from '../helpers/enumaraciones';

@Pipe({
  name: 'eTurnoTrabajo',
  standalone: true,
})
export class ETurnoTrabajoPipe implements PipeTransform {
  enum: any[] = onGetEnum(ETurnoTrabajo);
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
