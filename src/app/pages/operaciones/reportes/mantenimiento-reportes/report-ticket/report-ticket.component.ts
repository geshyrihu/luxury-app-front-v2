import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { Observable, Subscription } from 'rxjs';
import ReporteTicketsComponent from 'src/app/pages/operaciones/supervision/reporte-tickets/reporte-tickets.component';
import { CustomerIdService } from 'src/app/services/customer-id.service';
import { DataService } from 'src/app/services/data.service';
import { DateService } from 'src/app/services/date.service';
import { PeriodoMonthService } from 'src/app/services/periodo-month.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import PagetitleReportComponent from 'src/app/shared/cabeceras/pagetitlereport/pagetitlereport.component';
import ComponentsModule from 'src/app/shared/components.module';
import { environment } from 'src/environments/environment';
const base_urlImg = environment.base_urlImg;

@Component({
  selector: 'app-report-ticket',
  templateUrl: './report-ticket.component.html',
  standalone: true,
  imports: [
    PagetitleReportComponent,
    TableModule,
    CommonModule,
    ComponentsModule,
    ReporteTicketsComponent,
  ],
  providers: [ToastService, MessageService],
})
export default class ReportTicketComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  public customerIdService = inject(CustomerIdService);
  public swalService = inject(SwalService);
  public toastService = inject(ToastService);
  public dateService = inject(DateService);
  public periodoMonthService = inject(PeriodoMonthService);

  data: any;
  dataResponsable: any;
  dataCargaTicket: any;
  ref: DynamicDialogRef;
  subRef$: Subscription;
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  url = base_urlImg;
  periodoInicial$: Observable<Date> =
    this.periodoMonthService.getPeriodoInicial$();

  ngOnInit(): void {
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });

    this.periodoInicial$.subscribe(() => {
      this.onLoadData();
    });
  }
  onLoadData() {
    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .get(
        `MaintenanceReport/ticket/${
          this.customerIdService.customerId
        }/${this.dateService.formDateToString(
          this.periodoMonthService.getPeriodoInicio
        )}`
      )
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;
          console.log('🚀 ~ resp.body:', resp.body);
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
        `MaintenanceReport/ticketresponsable/${
          this.customerIdService.customerId
        }/${this.dateService.formDateToString(
          this.periodoMonthService.getPeriodoInicio
        )}`
      )
      .subscribe({
        next: (resp: any) => {
          this.dataResponsable = resp.body;
          this.swalService.onClose();
        },
        error: (err) => {
          this.toastService.onShowError();
          console.log(err.error);
          this.swalService.onClose();
        },
      });
    this.subRef$ = this.dataService
      .get(
        `MaintenanceReport/cargaticket/${
          this.customerIdService.customerId
        }/${this.dateService.formDateToString(
          this.periodoMonthService.getPeriodoInicio
        )}`
      )
      .subscribe({
        next: (resp: any) => {
          this.dataCargaTicket = resp.body;
          this.swalService.onClose();
        },
        error: (err) => {
          console.log(err.error);
          this.swalService.onClose();
          this.toastService.onShowError();
        },
      });
  }

  onSumaTotales(data: any[]) {
    let solicitudes = 0;
    let atendidas = 0;
    let pendientes = 0;
    let noAutorizado = 0;

    data.forEach((resp) => {
      solicitudes += resp.solicitudes;
      atendidas += resp.atendidas;
      pendientes += resp.pendientes;
      noAutorizado += resp.noAutorizado;
    });

    return {
      solicitudes,
      atendidas,
      pendientes,
      noAutorizado,
    };
  }

  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
