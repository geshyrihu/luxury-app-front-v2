import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subscription } from 'rxjs';
import { CustomerIdService } from 'src/app/services/customer-id.service';
import { DataService } from 'src/app/services/data.service';
import { DateService } from 'src/app/services/date.service';
import { PeriodoMonthService } from 'src/app/services/periodo-month.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import ComponentsModule from 'src/app/shared/components.module';
import MantenimientosPreventivosResumenComponent from '../mttos-preventivos-resumen/mttos-preventivos-resumen.component';

@Component({
  selector: 'app-mttos-preventivos',
  templateUrl: './mttos-preventivos.component.html',
  standalone: true,
  imports: [NgbAlert, ComponentsModule, CommonModule],
  providers: [DialogService, MessageService, ToastService],
})
export default class MantenimientosPreventivosComponent
  implements OnInit, OnDestroy
{
  public dateService = inject(DateService);
  public swalService = inject(SwalService);
  public toastService = inject(ToastService);
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
      this.dateService.formDateToString(
        this.periodoMonthService.getPeriodoInicio
      ),
      this.dateService.formDateToString(this.periodoMonthService.getPeriodoFin)
    );
  }

  ngOnInit(): void {
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.onLoadOrdenServicio(
      this.dateService.formDateToString(
        this.periodoMonthService.getPeriodoInicio
      ),
      this.dateService.formDateToString(this.periodoMonthService.getPeriodoFin)
    );
    this.customerId$.subscribe((resp) => {
      this.onLoadOrdenServicio(
        this.dateService.formDateToString(
          this.periodoMonthService.getPeriodoInicio
        ),
        this.dateService.formDateToString(
          this.periodoMonthService.getPeriodoFin
        )
      );
    });
  }

  onLoadOrdenServicio(fehcaInicio: string, getPeriodoFin: string) {
    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .get(
        `Dashboard/OrdenesServicio/${this.customerIdService.getcustomerId()}/${fehcaInicio}/${getPeriodoFin}`
      )
      .subscribe({
        next: (resp: any) => {
          this.ordenesServicio = resp.body;
          this.swalService.onClose();
        },
        error: (err) => {
          console.log(err.error);
          this.swalService.onClose();
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
