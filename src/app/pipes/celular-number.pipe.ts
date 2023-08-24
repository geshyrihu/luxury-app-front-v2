import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'celularNumber',
    standalone: true
})
export class CelularNumberPipe implements PipeTransform {
  transform(value: string): string {
    if (value.length === 9) {
      return value;
    }
    const firstPart = value.slice(0, 2);
    const secondPart = value.slice(2, 6);
    const thirdPart = value.slice(6, 10);
    return `${firstPart}-${secondPart}-${thirdPart}`;
  }
}
