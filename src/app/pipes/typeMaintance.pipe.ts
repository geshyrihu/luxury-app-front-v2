import { Pipe, PipeTransform } from '@angular/core';
import { onGetEnum } from 'src/app/helpers/enumaraciones';
import { ETypeMaintance } from '../enums/tipo-mantenimiento.enum';

@Pipe({
  name: 'eTypeMaintance',
  standalone: true,
})
export class ETypeMaintancePipe implements PipeTransform {
  enum: any[] = onGetEnum(ETypeMaintance);
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
