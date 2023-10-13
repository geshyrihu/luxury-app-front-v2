import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { Observable, Subscription } from 'rxjs';
import AddoreditMaintenancePreventiveComponent from 'src/app/pages/operaciones/calendarios/mantenimiento-preventivo/addoredit-maintenance-preventive.component';
import { EMonthPipe } from 'src/app/pipes/month.pipe';
import { ERecurrencePipe } from 'src/app/pipes/recurrence.pipe';
import {
  CustomSwalService,
  CustomToastService,
  CustomerIdService,
  DataService,
} from 'src/app/services/common-services';
// import AddoreditMaintenanceCalendarsComponent from './addoredit.component';

@Component({
  selector: 'app-gastos-mantenimiento',
  templateUrl: './gastos-mantenimiento.component.html',
  standalone: true,
  imports: [CommonModule, ToastModule, ERecurrencePipe, EMonthPipe],
  providers: [MessageService, DialogService, CustomToastService],
})
export default class GastosMantenimientoComponent implements OnInit, OnDestroy {
  public customSwalService = inject(CustomSwalService);
  public customToastService = inject(CustomToastService);
  public dataService = inject(DataService);
  public customerIdService = inject(CustomerIdService);
  public messageService = inject(MessageService);
  public dialogService = inject(DialogService);

  data: any[] = [];
  resumenGastos: any[] = [];
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  totalGasto: number = 0;
  ref: DynamicDialogRef;
  subRef$: Subscription;

  ngOnInit(): void {
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }
  onLoadData() {
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService
      .get(
        `MaintenanceCalendars/SummaryOfExpenses/${this.customerIdService.getcustomerId()}`
      )
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body.items;
          this.totalGasto = resp.body.totalGastos;
          this.customSwalService.onClose();
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
          this.customSwalService.onClose();
        },
      });
    this.subRef$ = this.dataService
      .get(
        `MaintenanceCalendars/Resumengastos/${this.customerIdService.getcustomerId()}`
      )
      .subscribe({
        next: (resp: any) => {
          this.resumenGastos = resp.body;
          this.customSwalService.onClose();
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
          this.customSwalService.onClose();
        },
      });
  }
  onModalItem(item: any) {
    this.ref = this.dialogService.open(
      AddoreditMaintenancePreventiveComponent,
      {
        data: {
          id: item.id,
          task: 'edit',
          idMachinery: item.idEquipo,
        },
        header: 'Editar regitro',
        styleClass: 'modal-mdInventory',
        closeOnEscape: true,
      }
    );
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
