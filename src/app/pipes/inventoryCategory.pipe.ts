import { Pipe, PipeTransform } from '@angular/core';
import { onGetEnum } from 'src/app/helpers/enumaraciones';
import { EInventoryCategory } from '../enums/categoria-inventario.enum';

@Pipe({
  name: 'eInventoryCategory',
  standalone: true,
})
export class EInventoryCategoryPipe implements PipeTransform {
  enum: any[] = onGetEnum(EInventoryCategory);
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
