import { Pipe, PipeTransform } from '@angular/core';
import { onGetSelectItemFromEnum } from 'src/app/helpers/enumeration';
import { EInventoryCategory } from '../enums/categoria-inventario.enum';

@Pipe({
  name: 'eInventoryCategory',
  standalone: true,
})
export class EInventoryCategoryPipe implements PipeTransform {
  enum: any[] = onGetSelectItemFromEnum(EInventoryCategory);
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
