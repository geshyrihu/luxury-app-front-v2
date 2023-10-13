import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { IChartData } from 'src/app/interfaces/chart-data.interface';
import { CustomerIdService } from 'src/app/services/common-services';
import { CustomSwalService } from 'src/app/services/custom-swal.service';
import { CustomToastService } from 'src/app/services/custom-toast.service';
import { DataService } from 'src/app/services/data.service';
import { DateService } from 'src/app/services/date.service';
import { PeriodoMonthService } from 'src/app/services/periodo-month.service';
import PagetitleReportComponent from 'src/app/shared/cabeceras/pagetitlereport/pagetitlereport.component';
import CustomBarChartComponent from 'src/app/shared/graficos/ng2-chart/custom-bar-chart/custom-bar-chart.component';

@Component({
  selector: 'app-report-bitacora-alberca',
  templateUrl: './report-bitacora-alberca.component.html',
  standalone: true,
  imports: [CommonModule, CustomBarChartComponent, PagetitleReportComponent],
  providers: [CustomToastService, MessageService],
})
export default class ReportBitacoraAlbercaComponent implements OnInit {
  private dataService = inject(DataService);
  public customerIdService = inject(CustomerIdService);
  public customSwalService = inject(CustomSwalService);
  public customToastService = inject(CustomToastService);
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
    this.customSwalService.onLoading();

    this.subRef$ = this.dataService
      .get<IChartData[]>(
        `MaintenanceReport/bitacoraalbercaparametros/${this.customerIdService.getcustomerId()}/${this.dateService.getDateFormat(
          this.periodoMonthService.getPeriodoInicio
        )}`
      )
      .subscribe({
        next: (resp: any) => {
          this.medidores = resp.body;
          this.customSwalService.onClose();
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
          this.customSwalService.onClose();
        },
      });
  }

  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
