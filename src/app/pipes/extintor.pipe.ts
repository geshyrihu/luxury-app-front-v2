import { Pipe, PipeTransform } from '@angular/core';
import { EExtintor } from 'src/app/enums/extintor.enum';
import { onGetSelectItemFromEnum } from 'src/app/helpers/enumeration';

@Pipe({
  name: 'eExtintorPipe',
  standalone: true,
})
export class EEExtintorPipe implements PipeTransform {
  enum: any[] = onGetSelectItemFromEnum(EExtintor);
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
