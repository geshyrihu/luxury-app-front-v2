import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { IChartData } from 'src/app/interfaces/chart-data.interface';
import { CustomerIdService } from 'src/app/services/customer-id.service';
import { DataService } from 'src/app/services/data.service';
import { DateService } from 'src/app/services/date.service';
import { PeriodoMonthService } from 'src/app/services/periodo-month.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import PagetitleReportComponent from 'src/app/shared/cabeceras/pagetitlereport/pagetitlereport.component';
import CustomBarChartComponent from 'src/app/shared/graficos/ng2-chart/custom-bar-chart/custom-bar-chart.component';

@Component({
  selector: 'app-report-bitacora-alberca',
  templateUrl: './report-bitacora-alberca.component.html',
  standalone: true,
  imports: [CommonModule, CustomBarChartComponent, PagetitleReportComponent],
  providers: [ToastService, MessageService],
})
export default class ReportBitacoraAlbercaComponent implements OnInit {
  private dataService = inject(DataService);
  public customerIdService = inject(CustomerIdService);
  public swalService = inject(SwalService);
  public toastService = inject(ToastService);
  public dateService = inject(DateService);
  public periodoMonthService = inject(PeriodoMonthService);

  medidores: IChartData[] = [];
  title: string = '';
  ref: DynamicDialogRef;
  subRef$: Subscription;

  ngOnInit() {
    this.onLoadData();
  }
  onLoadData() {
    this.swalService.onLoading();

    this.subRef$ = this.dataService
      .get<IChartData[]>(
        `MaintenanceReport/bitacoraalbercaparametros/${this.customerIdService.getcustomerId()}/${this.dateService.formDateToString(
          this.periodoMonthService.getPeriodoInicio
        )}`
      )
      .subscribe({
        next: (resp: any) => {
          this.medidores = resp.body;
          this.swalService.onClose();
        },
        error: (err) => {
          this.toastService.onShowError();
          console.log(err.error);
          this.swalService.onClose();
        },
      });
  }

  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
