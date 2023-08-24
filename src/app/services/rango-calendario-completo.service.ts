import { EventEmitter, Injectable } from '@angular/core';
import { IFechasFiltro } from '../interfaces/IFechasFiltro.interface';
const date = new Date();

@Injectable({
  providedIn: 'root',
})
export class RangoCalendarioCompletoService {
  //Al cargar el servicio se cargan las fechas del Mes Actual
  fechaInicioDate: Date = new Date(date.getFullYear(), date.getMonth() - 1, 1); //Dia primero del mes actual
  fechaFinalDate: Date = new Date(date.getFullYear(), date.getMonth(), 0); //Dia Ultimo del mes Actual
  // fechaFinalDate: Date = new Date(date.getFullYear(), date.getMonth() + 1, 0); //Dia Ultimo del mes Actual

  fechas$ = new EventEmitter<IFechasFiltro>();

  setFechas(fechaInicio: Date, fechaFinal: Date) {
    this.fechaInicioDate = fechaInicio;
    this.fechaFinalDate = fechaFinal;
  }
}
