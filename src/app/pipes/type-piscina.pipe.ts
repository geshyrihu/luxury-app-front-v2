import { Pipe, PipeTransform } from '@angular/core';
import { ETypePiscina } from '../enums/type-piscina.enum';
import { onGetSelectItemFromEnum } from '../helpers/enumeration';

@Pipe({
  name: 'ETypePiscina',
  standalone: true,
})
export class ETypePiscinaPipe implements PipeTransform {
  enum: any[] = onGetSelectItemFromEnum(ETypePiscina);
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
