import { Pipe, PipeTransform } from '@angular/core';
import { onGetSelectItemFromEnum } from 'src/app/helpers/enumeration';
import { EState } from '../enums/state.enum';

@Pipe({
  name: 'eState',
  standalone: true,
})
export class EStatePipe implements PipeTransform {
  enum: any[] = onGetSelectItemFromEnum(EState);
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
