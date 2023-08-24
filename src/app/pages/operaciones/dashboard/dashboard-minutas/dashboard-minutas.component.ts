import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { Observable, Subscription } from 'rxjs';
import { EAreaMinutasDetalles } from 'src/app/enums/area-minutas-detalles.enum';
import { IFechasFiltro } from 'src/app/interfaces/IFechasFiltro.interface';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerIdService } from 'src/app/services/customer-id.service';
import { DataService } from 'src/app/services/data.service';
import { FiltroCalendarService } from 'src/app/services/filtro-calendar.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import ComponentsModule from 'src/app/shared/components.module';
import DashboardMinutasResumenComponent from '../dashboard-minutas-resumen/dashboard-minutas-resumen.component';

@Component({
  selector: 'app-dashboard-minutas',
  templateUrl: './dashboard-minutas.component.html',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    ComponentsModule,
    NgbAlertModule,
    ToastModule,
  ],
  providers: [MessageService, ToastService],
})
export default class DashboardMinutasComponent implements OnInit, OnDestroy {
  public swalService = inject(SwalService);
  public toastService = inject(ToastService);
  public authService = inject(AuthService);
  private dataService = inject(DataService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public rangoCalendarioService = inject(FiltroCalendarService);
  private customerIdService = inject(CustomerIdService);

  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  data: any = [];
  ref: DynamicDialogRef;
  subRef$: Subscription;

  constructor() {
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.onLoadData();
  }

  ngOnInit(): void {
    this.customerId$.subscribe((resp) => {
      this.onLoadData();
    });
    this.onLoadData();
    this.rangoCalendarioService.fechas$.subscribe((resp: IFechasFiltro) => {
      this.onLoadData();
    });
  }

  onSendEmailAllPendingMeeting() {
    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .get(`Meetings/SendEmailAllPendingMeeting`)
      .subscribe({
        next: (resp: any) => {
          this.toastService.onShowSuccess();
          this.swalService.onClose();
        },
        error: (err) => {
          console.log(err.error);
          this.toastService.onShowError();
          this.swalService.onClose();
        },
      });
  }

  onLoadData() {
    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .get(
        `Dashboard/MinutasPendientes/${this.customerIdService.getcustomerId()}`
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
  }

  onModalAddOrEditMinutaDetalle(eAreaMinutasDetalles: EAreaMinutasDetalles) {
    let titulo: string = '';

    if (eAreaMinutasDetalles == EAreaMinutasDetalles.Contable) {
      titulo = 'Contable';
    }
    if (eAreaMinutasDetalles == EAreaMinutasDetalles.Operaciones) {
      titulo = 'Operaciones';
    }
    if (eAreaMinutasDetalles == EAreaMinutasDetalles.Legal) {
      titulo = 'Legal';
    }
    this.ref = this.dialogService.open(DashboardMinutasResumenComponent, {
      data: {
        eAreaMinutasDetalles,
      },
      header: 'Pendientes ' + titulo,
      width: '100%',
      height: '100%',
      closeOnEscape: true,
      autoZIndex: true,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.toastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }
  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
