import { Pipe, PipeTransform } from '@angular/core';
import { onGetSelectItemFromEnum } from 'src/app/helpers/enumeration';
import { EStatusOrdenCompra } from '../enums/estatus-orden-compra.enum';

@Pipe({
  name: 'eStatusCompra',
  standalone: true,
})
export class EStatusCompraPipe implements PipeTransform {
  enum: any[] = onGetSelectItemFromEnum(EStatusOrdenCompra);
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
