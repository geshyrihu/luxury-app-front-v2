import { Pipe, PipeTransform } from '@angular/core';
import { EExtintor } from 'src/app/enums/extintor.enum';
import { onGetEnum } from 'src/app/helpers/enumaraciones';

@Pipe({
  name: 'eExtintorPipe',
  standalone: true,
})
export class EExtintorPipe implements PipeTransform {
  enum: any[] = onGetEnum(EExtintor);
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
