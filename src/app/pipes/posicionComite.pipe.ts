import { Pipe, PipeTransform } from '@angular/core';
import { ECargoComite } from 'src/app/enums/cargo-comite.enum';
import { onGetEnum } from '../helpers/enumaraciones';

@Pipe({
  name: 'ePosicionComitePipe',
  standalone: true,
})
export class EPosicionComitePipe implements PipeTransform {
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
