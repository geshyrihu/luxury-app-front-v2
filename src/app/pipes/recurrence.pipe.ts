import { Pipe, PipeTransform } from '@angular/core';
import { ERecurrence } from '../enums/recurrencia.enum';
import { onGetEnum } from '../helpers/enumaraciones';

@Pipe({
  name: 'eRecurrence',
  standalone: true,
})
export class ERecurrencePipe implements PipeTransform {
  enum: any[] = onGetEnum(ERecurrence);
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
