import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { Subscription } from 'rxjs';
import { CustomSwalService } from 'src/app/services/custom-swal.service';
import { CustomToastService } from 'src/app/services/custom-toast.service';
import { DataService } from 'src/app/services/data.service';
import { DateService } from 'src/app/services/date.service';
import { PeriodoMonthService } from 'src/app/services/periodo-month.service';
import { SelectItemService } from 'src/app/services/select-item.service';
import ComponentsModule from 'src/app/shared/components.module';

@Component({
  selector: 'app-resultado-general-dashboard',
  templateUrl: './resultado-general-dashboard.component.html',
  standalone: true,
  imports: [
    ComponentsModule,
    CommonModule,
    FormsModule,
    NgbModule,
    TableModule,
    MultiSelectModule,
  ],
  providers: [DialogService, MessageService, CustomToastService],
})
export default class ResultadoGeneralDashboardComponent
  implements OnInit, OnDestroy
{
  public dataService = inject(DataService);
  public dateService = inject(DateService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public periodoMonthService = inject(PeriodoMonthService);
  public selectItemService = inject(SelectItemService);
  public customSwalService = inject(CustomSwalService);
  public customToastService = inject(CustomToastService);

  reporteFiltro: string = 'MINUTAS GENERAL';
  subRef$: Subscription;
  ref: DynamicDialogRef;
  data: any[] = [];
  cb_customers: any[] = [];
  periodo: string = '';
  nivelReporte: number = 0;
  mostrar: boolean = false;

  ngOnInit(): void {
    this.selectItemService.getCustomersNombreCorto().subscribe((resp) => {
      this.cb_customers = resp;
    });
    this.periodo = this.dateService.getNameMontYear(
      this.periodoMonthService.fechaInicial
    );
    this.onLoadDataMinutas();
  }

  onFiltrarPeriodo(periodo: string) {
    this.periodoMonthService.setPeriodo(periodo);
    this.periodo = this.dateService.getNameMontYear(
      this.periodoMonthService.fechaInicial
    );
    this.onLoadDataMinutas();
  }

  onFiltrarData(item: string) {
    this.reporteFiltro = item;
    this.onLoadDataMinutas();
  }

  onLoadDataMinutas() {
    this.reporteFiltro = 'MINUTAS GENERAL';
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService
      .get(
        `ResumenGeneral/ReporteResumenMinutas/${this.dateService.getDateFormat(
          this.periodoMonthService.getPeriodoInicio
        )}/${this.dateService.getDateFormat(
          this.periodoMonthService.getPeriodoFin
        )}/${this.nivelReporte}`
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
  onLoadDataMinutaFiltro(EAreaMinutasDetalles: number, reporteFiltro: string) {
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService
      .get(
        `ResumenGeneral/ReporteResumenMinutasFiltro/${this.dateService.getDateFormat(
          this.periodoMonthService.getPeriodoInicio
        )}/${this.dateService.getDateFormat(
          this.periodoMonthService.getPeriodoFin
        )}/${EAreaMinutasDetalles}/${this.nivelReporte}`
      )
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;
          this.reporteFiltro = reporteFiltro;

          this.customSwalService.onClose();
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
          this.customSwalService.onClose();
        },
      });
  }
  onLoadDataPreventivos() {
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService
      .get(
        `ResumenGeneral/ReporteResumenPreventivos/${this.dateService.getDateFormat(
          this.periodoMonthService.getPeriodoInicio
        )}/${this.dateService.getDateFormat(
          this.periodoMonthService.getPeriodoFin
        )}`
      )
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;
          this.reporteFiltro = 'MANTENIMIENTOS PREVENTIVOS';

          this.customSwalService.onClose();
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
          this.customSwalService.onClose();
        },
      });
  }
  onLoadDataTickets() {
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService
      .get(
        `ResumenGeneral/ReporteResumenTicket/${this.dateService.getDateFormat(
          this.periodoMonthService.getPeriodoInicio
        )}/${this.dateService.getDateFormat(
          this.periodoMonthService.getPeriodoFin
        )}`
      )
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;
          this.reporteFiltro = 'TICKETS';
          this.customSwalService.onClose();
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
          this.customSwalService.onClose();
        },
      });
  }

  onValueProgress(value: number) {
    let color = '';
    if (value <= 94) {
      color = 'danger';
    }
    if (value >= 100) {
      color = 'success';
    }
    if (value >= 95 && value <= 99) {
      color = 'warning';
    }
    return color;
  }
  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
