import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { Observable, Subscription } from 'rxjs';
import { CustomerIdService } from 'src/app/services/common-services';
import { CustomSwalService } from 'src/app/services/custom-swal.service';
import { CustomToastService } from 'src/app/services/custom-toast.service';
import { DataService } from 'src/app/services/data.service';
import { DateService } from 'src/app/services/date.service';
import { PeriodoMonthService } from 'src/app/services/periodo-month.service';
import ComponentsModule from 'src/app/shared/components.module';
import { environment } from 'src/environments/environment';
const base_urlImg = environment.base_urlImg + 'Administration/accounts/';

@Component({
  selector: 'app-reporte-tickets',
  templateUrl: './reporte-tickets.component.html',
  standalone: true,
  imports: [
    ComponentsModule,
    CommonModule,
    TableModule,
    ReporteTicketsComponent,
  ],
  providers: [DialogService, MessageService, CustomToastService],
})
export default class ReporteTicketsComponent implements OnInit, OnDestroy {
  private customerIdService = inject(CustomerIdService);
  private dataService = inject(DataService);
  public dateService = inject(DateService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public periodoMonthService = inject(PeriodoMonthService);
  public customSwalService = inject(CustomSwalService);
  public customToastService = inject(CustomToastService);
  base_urlImg = '';
  data: any[] = [];
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  url = base_urlImg;

  ngOnInit(): void {
    this.onLoadData();
    this.urlImg(this.customerIdService.getcustomerId());
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.customerId$.subscribe((resp) => {
      this.urlImg(this.customerIdService.getcustomerId());
      this.onLoadData();
    });
  }
  urlImg(customerId: number): void {
    this.base_urlImg = `${environment.base_urlImg}customers/${customerId}/tools/`;
  }
  onFiltrarPeriodo(periodo: string) {
    this.periodoMonthService.setPeriodo(periodo);
    this.onLoadData();
  }

  onLoadData() {
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService
      .get(
        `ResumenGeneral/ReporteResumenTicket/${
          this.customerIdService.customerId
        }/${this.dateService.getDateFormat(
          this.periodoMonthService.getPeriodoInicio
        )}/${this.dateService.getDateFormat(
          this.periodoMonthService.getPeriodoFin
        )}`
      )

      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;
          this.customSwalService.onClose();
        },
        error: (err) => {
          console.log(err.error);
          this.customSwalService.onClose();
          this.customToastService.onShowError();
        },
      });
  }

  onSumaTotales(data: any[]) {
    let solicitudes = 0;
    let atendidas = 0;
    let pendientes = 0;

    data.forEach((resp) => {
      solicitudes += resp.solicitudes;
      atendidas += resp.atendidas;
      pendientes += resp.pendientes;
    });

    return {
      solicitudes,
      atendidas,
      pendientes,
    };
  }
  subRef$: Subscription;
  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
