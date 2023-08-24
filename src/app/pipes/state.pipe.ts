import { Pipe, PipeTransform } from '@angular/core';
import { onGetEnum } from 'src/app/helpers/enumaraciones';
import { EState } from '../enums/state.enum';

@Pipe({
  name: 'eState',
  standalone: true,
})
export class EStatePipe implements PipeTransform {
  enum: any[] = onGetEnum(EState);
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
