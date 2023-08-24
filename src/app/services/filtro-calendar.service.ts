import { EventEmitter, Injectable, inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { IFechasFiltro } from '../interfaces/IFechasFiltro.interface';
import { DateService } from './date.service';
const date = new Date();

@Injectable({
  providedIn: 'root',
})
export class FiltroCalendarService {
  public dateService = inject(DateService);

  //Dia primero del mes anterior
  fechaInicial: Date = new Date(date.getFullYear(), date.getMonth() - 1, 1);
  //Dia Ultimo del mes Actual
  fechaFinal: Date = new Date(date.getFullYear(), date.getMonth(), 0);

  fechaInicioDateFull: Date = new Date(date.getFullYear(), date.getMonth(), 1);
  fechaFinalDateFull: Date = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ); //Dia Ultimo del mes Actual

  fechas$ = new EventEmitter<IFechasFiltro>();
  fechasMOnth$ = new EventEmitter<IFechasFiltro>();

  dates$ = new Subject<Date[]>();
  // Validar en que formato se reciben las fechas
  setFechas(fechaInicio: Date, fechaFinal: Date) {
    this.fechaInicioDateFull = fechaInicio;
    this.fechaFinalDateFull = fechaFinal;
  }

  SetFechasMonth(fechaInicio: string, fechaFinal: string) {
    this.fechaInicial = new Date(fechaInicio + '-' + 1);
    let finalTemp = new Date(fechaFinal + '-' + 1);
    this.fechaFinal = new Date(
      finalTemp.getFullYear(),
      finalTemp.getMonth() + 1,
      0
    );
    this.dates$.next([this.fechaInicial, this.fechaFinal]);
  }

  getDates$(): Observable<Date[]> {
    return this.dates$.asObservable();
  }
}
