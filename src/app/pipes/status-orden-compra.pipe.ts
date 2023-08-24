import { Pipe, PipeTransform } from '@angular/core';
import { EStatusOrdenCompra } from 'src/app/enums/estatus-orden-compra.enum';
import { onGetEnum } from '../helpers/enumaraciones';

@Pipe({
  name: 'eStatusOrdenCompra',
  standalone: true,
})
export class EStatusOrdenCompraPipe implements PipeTransform {
  enum: any[] = onGetEnum(EStatusOrdenCompra);
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
