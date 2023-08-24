import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Subscription } from 'rxjs';
import { EStatusPipe } from 'src/app/pipes/status.pipe';
import { CustomerIdService } from 'src/app/services/customer-id.service';
import { DataService } from 'src/app/services/data.service';
import { DateService } from 'src/app/services/date.service';
import { ReporteOrdenesServicioService } from 'src/app/services/reporte-ordenes-servicio.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import ComponentsModule from 'src/app/shared/components.module';
import ResumenOrdenesServicioGraficoComponent from '../resumen-ordenes-servicio-grafico/resumen-ordenes-servicio-grafico.component';
@Component({
  selector: 'app-resumen-ordenes-servicio',
  templateUrl: './resumen-ordenes-servicio.component.html',
  standalone: true,
  imports: [
    ResumenOrdenesServicioGraficoComponent,
    CommonModule,
    ComponentsModule,
    TableModule,
    EStatusPipe,
  ],
  providers: [ToastService],
})
export default class ResumenOrdenesServicioComponent
  implements OnInit, OnDestroy
{
  public customerIdService = inject(CustomerIdService);
  public dataService = inject(DataService);
  public dateService = inject(DateService);
  public reporteOrdenesServicioService = inject(ReporteOrdenesServicioService);
  public swalService = inject(SwalService);
  public toastService = inject(ToastService);
  data: any[] = [];
  dataGraficos: any[] = [];
  terminados = 0;
  pendientes = 0;
  noAutorizados = 0;
  grafico: any;
  // date: Date;
  urlImg: string = '';
  subRef$: Subscription;
  customerId: Number;

  ngOnInit(): void {
    this.customerId = this.customerIdService.getcustomerId();
    this.onLoadData();
  }

  onLoadData() {
    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .get(
        'MeetingDertailsSeguimiento/ResumenPreventivosPresentacion/' +
          this.customerId +
          '/' +
          this.dateService.formDateToString(
            this.reporteOrdenesServicioService.getDate()
          )
      )
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;
          this.swalService.onClose();
        },
        error: (err) => {
          console.log(err.error);
          this.swalService.onClose();
          this.toastService.onShowError();
        },
      });
    this.subRef$ = this.dataService
      .get(
        'MeetingDertailsSeguimiento/ResumenPreventivosGraficoPresentacion/' +
          this.customerId +
          '/' +
          this.dateService.formDateToString(
            this.reporteOrdenesServicioService.getDate()
          )
      )
      .subscribe({
        next: (resp: any) => {
          this.dataGraficos = resp.body;
          this.reporteOrdenesServicioService.setDateGrafico(this.dataGraficos);
          this.swalService.onClose();
        },
        error: (err) => {
          this.toastService.onShowError();
          console.log(err.error);
          this.swalService.onClose();
        },
      });
  }

  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
