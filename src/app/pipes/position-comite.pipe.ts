import { Pipe, PipeTransform } from '@angular/core';
import { onGetSelectItemFromEnum } from 'src/app/helpers/enumeration';
import { ECargoComite } from '../enums/cargo-comite.enum';

@Pipe({
  name: 'ePositionComite',
  standalone: true,
})
export class EPositionComitePipe implements PipeTransform {
  enum: any[] = onGetSelectItemFromEnum(ECargoComite);
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
