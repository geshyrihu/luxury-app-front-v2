import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
const dateNow = new Date();
@Injectable({
  providedIn: 'root',
})
export class PeriodoMonthService {
  fechaInicial = new Date(dateNow.getFullYear(), dateNow.getMonth() - 1, 1);
  fechaFinal = new Date(dateNow.getFullYear(), dateNow.getMonth(), 0);

  private periodoInicial$ = new Subject<Date>();

  getPeriodoInicial$(): Observable<Date> {
    return this.periodoInicial$.asObservable();
  }

  private periodoFinal$ = new Subject<Date>();

  getPeriodoFinal$(): Observable<Date> {
    return this.periodoFinal$.asObservable();
  }

  get getPeriodoInicio(): Date {
    return this.fechaInicial;
  }
  get getPeriodoFin(): Date {
    return this.fechaFinal;
  }

  setPeriodo(periodo: any) {
    this.fechaInicial = new Date(periodo + '-' + 1);
    let finalTemp = new Date(periodo + '-' + 1);
    this.fechaFinal = new Date(
      finalTemp.getFullYear(),
      finalTemp.getMonth() + 1,
      0
    );

    this.periodoInicial$.next(this.fechaInicial);
    this.periodoFinal$.next(this.fechaFinal);
  }
}
