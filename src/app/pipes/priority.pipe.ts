import { Pipe, PipeTransform } from '@angular/core';
import { EPriority } from '../enums/prioridad.enum';
import { onGetEnum } from '../helpers/enumaraciones';

@Pipe({
  name: 'ePriority',
  standalone: true,
})
export class EPriorityPipe implements PipeTransform {
  enum: any[] = onGetEnum(EPriority);
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
