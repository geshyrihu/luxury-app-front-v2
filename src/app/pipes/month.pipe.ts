import { Pipe, PipeTransform } from '@angular/core';
import { onGetSelectItemFromEnum } from 'src/app/helpers/enumeration';
import { EMonths } from '../enums/meses.enum';

@Pipe({
  name: 'eMonth',
  standalone: true,
})
export class EMonthPipe implements PipeTransform {
  enum: any = onGetSelectItemFromEnum(EMonths);
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
