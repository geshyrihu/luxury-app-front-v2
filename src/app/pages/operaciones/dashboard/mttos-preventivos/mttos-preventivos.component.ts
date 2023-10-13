import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subscription } from 'rxjs';
import { CustomerIdService } from 'src/app/services/common-services';
import { CustomSwalService } from 'src/app/services/custom-swal.service';
import { CustomToastService } from 'src/app/services/custom-toast.service';
import { DataService } from 'src/app/services/data.service';
import { DateService } from 'src/app/services/date.service';
import { PeriodoMonthService } from 'src/app/services/periodo-month.service';
import ComponentsModule from 'src/app/shared/components.module';
import MantenimientosPreventivosResumenComponent from '../mttos-preventivos-resumen/mttos-preventivos-resumen.component';

@Component({
  selector: 'app-mttos-preventivos',
  templateUrl: './mttos-preventivos.component.html',
  standalone: true,
  imports: [NgbAlert, ComponentsModule, CommonModule],
  providers: [DialogService, MessageService, CustomToastService],
})
export default class MantenimientosPreventivosComponent
  implements OnInit, OnDestroy
{
  public dateService = inject(DateService);
  public customSwalService = inject(CustomSwalService);
  public customToastService = inject(CustomToastService);
  public dataService = inject(DataService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public customerIdService = inject(CustomerIdService);
  public periodoMonthService = inject(PeriodoMonthService);

  ref: DynamicDialogRef;
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  subRef$: Subscription;
  ordenesServicio: any = [];

  onChangePeriodo(periodo: string) {
    this.periodoMonthService.setPeriodo(periodo);
    this.onLoadOrdenServicio(
      this.dateService.getDateFormat(this.periodoMonthService.getPeriodoInicio),
      this.dateService.getDateFormat(this.periodoMonthService.getPeriodoFin)
    );
  }

  ngOnInit(): void {
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.onLoadOrdenServicio(
      this.dateService.getDateFormat(this.periodoMonthService.getPeriodoInicio),
      this.dateService.getDateFormat(this.periodoMonthService.getPeriodoFin)
    );
    this.customerId$.subscribe((resp) => {
      this.onLoadOrdenServicio(
        this.dateService.getDateFormat(
          this.periodoMonthService.getPeriodoInicio
        ),
        this.dateService.getDateFormat(this.periodoMonthService.getPeriodoFin)
      );
    });
  }

  onLoadOrdenServicio(fehcaInicio: string, getPeriodoFin: string) {
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService
      .get(
        `Dashboard/OrdenesServicio/${this.customerIdService.getcustomerId()}/${fehcaInicio}/${getPeriodoFin}`
      )
      .subscribe({
        next: (resp: any) => {
          this.ordenesServicio = resp.body;
          this.customSwalService.onClose();
        },
        error: (err) => {
          console.log(err.error);
          this.customSwalService.onClose();
        },
      });
  }

  onClick(estatus?: number) {
    this.ref = this.dialogService.open(
      MantenimientosPreventivosResumenComponent,
      {
        data: {
          estatus,
        },
        width: '100%',
        height: '100%',
        header: 'Ordenes de Mantenimiento Preventivo',
        closeOnEscape: true,
      }
    );
  }

  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
