import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'CurrencyMexicoPipe',
  standalone: true,
})
export class CurrencyMexicoPipe implements PipeTransform {
  // transform(value: any): string {
  //   return `$ ${(Math.round(value * 100) / 100).toString()}`;
  // }

  //TODO: VERIFICAR SI ES FUNCIONAL ESTE PIPE

  transform(value: number): string {
    // Verificar si el valor es numérico
    if (isNaN(value)) {
      return '';
    }

    // Formatear el número como moneda en México
    const formatter = new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    });

    return formatter.format(value);
  }
}
