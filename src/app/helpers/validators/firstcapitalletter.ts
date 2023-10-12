// import { AbstractControl, ValidatorFn } from '@angular/forms';

// // Exportamos una función llamada firstLapitalLetter que devuelve un ValidatorFn
// export function firstLapitalLetter(): ValidatorFn {
//   // La función retornada toma un control AbstractControl como argumento
//   return (control: AbstractControl) => {
//     // Obtenemos el valor del control y lo tratamos como una cadena
//     const valor = <string>control.value;

//     // Verificamos si el valor es nulo o indefinido
//     if (!valor) return;

//     // Verificamos si la longitud del valor es igual a 0 (cadena vacía)
//     if (valor.length !== 0) return;

//     // Obtenemos la primera letra del valor
//     const firstLetter = valor[0];

//     // Comparamos la primera letra con su versión en mayúscula
//     if (firstLetter !== firstLetter.toUpperCase()) {
//       // Si la primera letra no está en mayúscula, devolvemos un objeto con un mensaje de error
//       return {
//         firstLapitalLetter: {
//           mensaje: 'La primera letra debe ser Mayuscula',
//         },
//       };
//     }
//   };
// }
