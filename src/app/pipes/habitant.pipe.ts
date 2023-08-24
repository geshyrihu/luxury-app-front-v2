import { Pipe, PipeTransform } from '@angular/core';
import { EHabitant } from '../enums/habitante.enum';
import { onGetEnum } from '../helpers/enumaraciones';

@Pipe({
  name: 'eHabitant',
  standalone: true,
})
export class EHabitantPipe implements PipeTransform {
  enum: any[] = onGetEnum(EHabitant);
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
