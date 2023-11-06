import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'celularNumber',
  standalone: true,
})
// export class CelularNumberPipe implements PipeTransform {
//   transform(value: string): string {
//     if (value.length === 9) {
//       return value;
//     }
//     const firstPart = value.slice(0, 2);
//     const secondPart = value.slice(2, 6);
//     const thirdPart = value.slice(6, 10);
//     return `${firstPart}-${secondPart}-${thirdPart}`;
//   }
// }
export class CelularNumberPipe implements PipeTransform {
  transform(value: string): string {
    console.log('🚀 ~ value:', value);
    // Elimina todos los caracteres no numéricos
    const numericValue = value.replace(/\D/g, '');
    console.log('🚀 ~ numericValue:', numericValue);

    // Verifica si la longitud del número es igual a 9
    if (numericValue.length === 9) {
      // Formatea el número con guiones
      const firstPart = numericValue.slice(0, 2);
      const secondPart = numericValue.slice(2, 6);
      const thirdPart = numericValue.slice(6, 9);
      return `${firstPart}-${secondPart}-${thirdPart}`;
    } else {
      // En caso de que el número no tenga 9 dígitos, retorna el valor original sin cambios
      return value;
    }
  }
}
