import { Pipe, PipeTransform } from '@angular/core';
import { ETypeMeeting } from '../enums/tipo-reunion.enum';
import { onGetEnum } from '../helpers/enumaraciones';

@Pipe({
  name: 'eeTypeMeeting',
  standalone: true,
})
export class ETypeMeetingPipe implements PipeTransform {
  enum: any[] = onGetEnum(ETypeMeeting);
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
