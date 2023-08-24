import { AbstractControl, ValidatorFn } from '@angular/forms';

export function firstLapitalLetter(): ValidatorFn {
  return (control: AbstractControl) => {
    const valor = <string>control.value;
    if (!valor) return;
    if (valor.length !== 0) return;

    const firstLetter = valor[0];
    if (firstLetter !== firstLetter.toUpperCase()) {
      return {
        firstLapitalLetter: {
          mensaje: 'La primera letra debe ser Mayuscula',
        },
      };
    }
  };
}
