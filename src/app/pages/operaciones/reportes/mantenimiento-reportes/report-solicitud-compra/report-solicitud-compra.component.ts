import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { Observable, Subscription } from 'rxjs';
import { CustomerIdService } from 'src/app/services/common-services';
import { CustomSwalService } from 'src/app/services/custom-swal.service';
import { CustomToastService } from 'src/app/services/custom-toast.service';
import { DataService } from 'src/app/services/data.service';
import { DateService } from 'src/app/services/date.service';
import { PeriodoMonthService } from 'src/app/services/periodo-month.service';
import PagetitleReportComponent from 'src/app/shared/cabeceras/pagetitlereport/pagetitlereport.component';
import ComponentsModule from 'src/app/shared/components.module';

@Component({
  selector: 'app-report-solicitud-compra',
  templateUrl: './report-solicitud-compra.component.html',
  standalone: true,
  imports: [
    PagetitleReportComponent,
    TableModule,
    CommonModule,
    ComponentsModule,
  ],
  providers: [CustomToastService, MessageService],
})
export default class ReportSolicitudCompraComponent
  implements OnInit, OnDestroy
{
  private dataService = inject(DataService);
  public customerIdService = inject(CustomerIdService);
  public customSwalService = inject(CustomSwalService);
  public customToastService = inject(CustomToastService);
  public dateService = inject(DateService);
  public periodoMonthService = inject(PeriodoMonthService);

  solicitudes: any;
  ordenesCompra: any;

  dataProvider: any = [];
  ref: DynamicDialogRef;
  subRef$: Subscription;
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();

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
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService
      .get(
        `MaintenanceReport/solicitudinsumos/${
          this.customerIdService.customerId
        }/${this.dateService.getDateFormat(
          this.periodoMonthService.getPeriodoInicio
        )}`
      )
      .subscribe({
        next: (resp: any) => {
          this.solicitudes = resp.body.solicitudes;
          this.ordenesCompra = resp.body.ordenesCompra;
          this.customSwalService.onClose();
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
          this.customSwalService.onClose();
        },
      });
  }

  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
