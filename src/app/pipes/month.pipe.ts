import { Pipe, PipeTransform } from '@angular/core';
import { onGetEnum } from 'src/app/helpers/enumaraciones';
import { EMonths } from '../enums/meses.enum';

@Pipe({
  name: 'eMonth',
  standalone: true,
})
export class EMonthPipe implements PipeTransform {
  enum: any = onGetEnum(EMonths);
  transform(value: number): string {
    let dato: string = '';
    if (value === null) {
      dato = '';
    } else {
      value = Number(value);

      this.enum.forEach((item) => {
        if (value === item.value) {
          dato = item.label;
        }
      });
    }
    return dato;
  }
}
