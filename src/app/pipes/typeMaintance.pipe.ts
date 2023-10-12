import { Pipe, PipeTransform } from '@angular/core';
import { onGetSelectItemFromEnum } from 'src/app/helpers/enumeration';
import { ETypeMaintance } from '../enums/tipo-mantenimiento.enum';

@Pipe({
  name: 'eTypeMaintance',
  standalone: true,
})
export class ETypeMaintancePipe implements PipeTransform {
  enum: any[] = onGetSelectItemFromEnum(ETypeMaintance);
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
