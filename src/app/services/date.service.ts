import { Injectable } from '@angular/core';
const dateNow = new Date();
@Injectable({
  providedIn: 'root',
})
export class DateService {
  // private datePipe = inject(DatePipe);

  getDateNow() {
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let dayS: any = day;
    let monthS: any = month;
    if (month < 10) {
      monthS = `0${month}`;
    }
    if (day < 10) {
      dayS = `0${day}`;
    }
    return `${year}-${monthS}-${dayS}`;
  }

  // formatDate(date: Date | string, format: string): string {
  //   return this.datePipe.transform(date, format);
  // }
  getDateFormat(value: Date) {
    if (value === null) {
      return null;
    } else {
      let date = new Date(value);
      let dateFinal = date.toISOString().slice(0, 10);
      return dateFinal;
    }
  }
  getHoraNow(date: Date) {
    let hora = date.getHours();
    let minutos = date.getMinutes();

    let horaReturn: string | number;
    let minutoreturn: string | number;
    if (hora < 10) {
      horaReturn = `0${hora}`;
    } else {
      horaReturn = hora;
    }
    if (minutos < 10) {
      minutoreturn = `0${minutos}`;
    } else {
      minutoreturn = minutos;
    }

    return `${horaReturn}:${minutoreturn}`;
  }
  getDateString(date: string) {
    let newDate = new Date(date);
    return this.getHoraNow(newDate);
  }
  getFullYear() {
    return dateNow.getFullYear();
  }

  formatDateTime(date: Date) {
    if (date === null) {
      return null;
    } else {
      date = new Date(date);
      const format = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      const [
        { value: month },
        ,
        { value: day },
        ,
        { value: year },
        ,
        { value: hour },
        ,
        { value: minute },
        ,
        { value: second },
      ] = format.formatToParts(date);

      return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
    }
  }

  formatDateTimeMonthyear(date: Date) {
    if (date === null) {
      return null;
    } else {
      date = new Date(date);

      const format = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: '2-digit',
      });
      const [{ value: month }, , { value: year }] = format.formatToParts(date);

      return `${month}-${year}`;
    }
  }
  formatDateTimetoMMMMyyyy(date: Date) {
    if (date === null) {
      return null;
    } else {
      date = new Date(date);
      const format = new Intl.DateTimeFormat('es-Mx', {
        year: 'numeric',
        month: 'long',
      });
      const fechaFormateada = format.format(date);
      return fechaFormateada.toUpperCase();
    }
  }

  formDateToStringLocale(date: Date) {
    if (date === null) {
      return null;
    } else {
      date = new Date(date);
      const format = new Intl.DateTimeFormat('en', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
      const [{ value: month }, , { value: day }, , { value: year }] =
        format.formatToParts(date);

      return `${day}-${month}-${year}`;
    }
  }
  getNameMontYear(date: Date) {
    if (date === null) {
      return null;
    } else {
      date = new Date(date);
      const format = new Intl.DateTimeFormat('es', {
        year: 'numeric',
        month: 'long',
      });
      const [{ value: month }, , { value: year }] = format.formatToParts(date);

      return `${month}-${year}`;
    }
  }

  formDateToString(date: Date) {
    if (date === null) {
      return null;
    } else {
      let date2 = new Date(date);
      let dateFinal = date2.toISOString().slice(0, 10);
      return dateFinal;
    }
  }

  parsearErroresAPI(response: any): string[] {
    const resultado: string[] = [];

    if (response.error) {
      if (typeof response.error === 'string') {
        resultado.push(response.error);
      } else {
        const mapaErrores = response.error.errors;
        const entradas = Object.entries(mapaErrores);
        entradas.forEach((arreglo: any[]) => {
          const campo = arreglo[0];
          arreglo[1].forEach((mensajeError) => {
            resultado.push(`${campo}: ${mensajeError}`);
          });
        });
      }
    }
    return resultado;
  }

  //Convertir fechas recibidas a input Month HTML
  onParseToInputMonth(date: Date): string {
    const mm = date.getMonth() + 1;
    return [date.getFullYear(), (mm > 9 ? '' : '0') + mm].join('-');
  }
}
