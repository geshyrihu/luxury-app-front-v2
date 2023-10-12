import { Pipe, PipeTransform } from '@angular/core';
import { ETypeMeeting } from '../enums/tipo-reunion.enum';
import { onGetSelectItemFromEnum } from '../helpers/enumeration';

@Pipe({
  name: 'eeTypeMeeting',
  standalone: true,
})
export class ETypeMeetingPipe implements PipeTransform {
  enum: any[] = onGetSelectItemFromEnum(ETypeMeeting);
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
