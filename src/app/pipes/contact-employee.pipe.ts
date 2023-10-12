import { Pipe, PipeTransform } from '@angular/core';
import { onGetSelectItemFromEnum } from 'src/app/helpers/enumeration';
import { ERelationEmployee } from '../enums/relacion-empleado.enum';

@Pipe({
  name: 'eRelationEmployee',
  standalone: true,
})
export class ERelationEmployeePipe implements PipeTransform {
  enum: any[] = onGetSelectItemFromEnum(ERelationEmployee);
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
