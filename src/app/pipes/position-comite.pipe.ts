import { Pipe, PipeTransform } from '@angular/core';
import { onGetEnum } from 'src/app/helpers/enumaraciones';
import { ECargoComite } from '../enums/cargo-comite.enum';

@Pipe({
  name: 'ePositionComite',
  standalone: true,
})
export class EPositionComitePipe implements PipeTransform {
  enum: any[] = onGetEnum(ECargoComite);
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
