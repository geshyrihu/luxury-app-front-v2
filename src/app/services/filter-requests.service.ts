import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FilterRequestsService {
  fechaInicial = new Date(new Date().getFullYear(), 0, 1);
  fechaFormateada = this.fechaInicial.toISOString().slice(0, 7);
  private paramsEmit$: Subject<HttpParams> = new Subject<HttpParams>();

  statusRequest: string = 'Pendiente';

  private params: HttpParams = new HttpParams(); // Parámetros iniciales

  constructor() {
    this.setInitialParams();
  }
  setInitialParams() {
    this.params = this.params
      .set('dateRequest', this.fechaFormateada)
      .set('status', this.statusRequest);
    console.log('🚀 ~ inicial:', this.params);
  }
  setParams(date: any, status: any) {
    this.fechaInicial = new Date(`${date}-01T00:00:00`);
    let fechaISO = this.fechaInicial.toISOString().slice(0, 10);

    // Crear una nueva instancia de HttpParams
    let newParams = new HttpParams()
      .set('dateRequest', fechaISO)
      .set('status', status);

    // Asignar la nueva instancia de HttpParams al campo params
    this.params = newParams;
    this.paramsEmit$.next(this.params);
  }
  getParams$(): Observable<HttpParams> {
    return this.paramsEmit$.asObservable();
  }

  getParams() {
    return this.params;
  }
}
