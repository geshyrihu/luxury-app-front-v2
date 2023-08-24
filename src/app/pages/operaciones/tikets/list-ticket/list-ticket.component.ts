import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ImageModule } from 'primeng/image';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { Observable, Subscription } from 'rxjs';
import { IFilterTicket } from 'src/app/interfaces/IFilterTicket.interface';
import CardEmployeeComponent from 'src/app/pages/operaciones/directorios/empleados/card-employee/card-employee.component';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerIdService } from 'src/app/services/customer-id.service';
import { DataService } from 'src/app/services/data.service';
import { DateService } from 'src/app/services/date.service';
import { ReportService } from 'src/app/services/report.service';
import { SwalService } from 'src/app/services/swal.service';
import { TicketFilterService } from 'src/app/services/ticket-filter.service';
import { ToastService } from 'src/app/services/toast.service';
import ComponentsModule from 'src/app/shared/components.module';
import { environment } from 'src/environments/environment';
import EnviarMailReporteSemanalComponent from '../../enviar-email/enviar-mail-reporte-semanal/enviar-mail-reporte-semanal.component';
import AddoreditTicketComponent from '../addoredit-ticket/addoredit-ticket.component';
import FilterWorkplanComponent from '../filter-workplan/filter-workplan.component';
import TicketSeguimientoComponent from '../ticket-comentario/ticket-seguimiento.component';
import FilterTicketComponent from '../ticket-filter/ticket-filter.component';

@Component({
  selector: 'app-list-ticket',
  templateUrl: './list-ticket.component.html',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    ComponentsModule,
    FormsModule,
    TableModule,
    ToastModule,
    ImageModule,
  ],
  providers: [DialogService, MessageService, ConfirmationService, ToastService],
})
export default class ListTicketComponent implements OnInit, OnDestroy {
  public authService = inject(AuthService);
  public customerIdService = inject(CustomerIdService);
  public dataService = inject(DataService);
  public dateService = inject(DateService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public ticketFilterService = inject(TicketFilterService);
  public reportService = inject(ReportService);
  public router = inject(Router);
  public swalService = inject(SwalService);
  public toastService = inject(ToastService);

  base_urlImg = '';
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  data: any[] = [];
  dataCompleta: any[] = [];
  filterTicket: IFilterTicket;
  ligaReporte: string = '';
  ref: DynamicDialogRef;
  url = `${environment.base_urlImg}Administration/accounts/`;
  subRef$: Subscription;
  ngOnInit(): void {
    this.setDataFilter();
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.ticketFilterService.setIdCustomer(this.customerIdService.customerId);
      this.onLoadData();
    });
  }

  setDataFilter() {
    return this.ticketFilterService.getfilterTicket;
  }

  onLoadData() {
    this.onCreateLiga();
    this.base_urlImg = `${
      environment.base_urlImg
    }customers/${this.ticketFilterService.getIdCustomer()}/report/`;
    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .post<IFilterTicket>('Ticket', this.ticketFilterService.getfilterTicket)
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;

          this.dataCompleta = resp.body;
          this.swalService.onClose();
        },
        error: (err) => {
          this.toastService.onShowError();
          console.log(err.error);
          this.swalService.onClose();
        },
      });
  }

  showModalAddOrEdit(data: any) {
    this.ref = this.dialogService.open(AddoreditTicketComponent, {
      data: {
        id: data.id,
        status: data.status,
        customerId: this.customerIdService.customerId,
      },
      header: data.title,
      styleClass: 'modal-lg',
      autoZIndex: true,
      closeOnEscape: true,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.toastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }
  onModalComentarios(id: number) {
    this.ref = this.dialogService.open(TicketSeguimientoComponent, {
      data: {
        id,
      },
      header: 'Seguimientos',
      width: '60%',
      autoZIndex: true,
      closeOnEscape: true,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.toastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }
  showModalEnviarEmail() {
    this.ref = this.dialogService.open(EnviarMailReporteSemanalComponent, {
      data: {
        customerId: this.customerIdService.customerId,
        fechaInicial: this.dateService.formDateToString(
          this.ticketFilterService.filterTicket.finishedStart
        ),
        fechaFinal: this.dateService.formDateToString(
          this.ticketFilterService.filterTicket.finishedEnd
        ),
      },
      header: 'Enviar reporte semanal',
      styleClass: 'modal-lg',
      baseZIndex: 1000,
      height: '100%',
      width: '100%',
      closeOnEscape: true,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.toastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }
  onModalFiltro() {
    this.ref = this.dialogService.open(FilterTicketComponent, {
      data: {
        panelDto: this.filterTicket,
      },
      styleClass: 'modal-lg',
      baseZIndex: 10000,
      dismissableMask: true,
      closeOnEscape: true,
      rtl: true,
      showHeader: false,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.toastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }
  onModalWorkPlan() {
    this.ref = this.dialogService.open(FilterWorkplanComponent, {
      data: {
        panelDto: this.filterTicket,
      },
      styleClass: 'modal-sm',
      baseZIndex: 10000,
      closeOnEscape: true,
    });
    this.ref.onClose.subscribe((resp: any) => {
      if (resp.fechaInicial && resp.fechaFinal) {
        this.dataService
          .get(
            `Ticket/FilterWorkPlan/${this.customerIdService.getcustomerId()}/${this.dateService.formDateToString(
              resp.fechaInicial
            )}/${this.dateService.formDateToString(resp.fechaFinal)}`
          )
          .subscribe(
            (resp: any) => {
              this.data = resp.body;
              this.toastService.onShowSuccess();
            },
            (err) => {
              console.log(err.error);
              this.toastService.onShowError();
            }
          );
      }
    });
  }

  onDelete(item: any) {
    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .delete(
        `Ticket/onDelete/${item.id}/${this.authService.userTokenDto.infoUserAuthDto.applicationUserId}`
      )
      .subscribe({
        next: () => {
          this.onLoadData();
          this.swalService.onClose();
          this.toastService.onShowSuccess();
        },
        error: (err) => {
          console.log(err.error);
          this.swalService.onClose();
          this.toastService.onShowError();
        },
      });
  }
  onGeneratePDF() {
    this.reportService.setCustomerId(this.customerIdService.customerId);
    this.reportService.setDataOperationReport(this.filterTicket);
    this.router.navigateByUrl('report/operationReport');
  }
  onGeneratePDFPending() {
    this.reportService.setCustomerId(this.customerIdService.customerId);
    this.reportService.setDataOperationReport(this.filterTicket);
    this.router.navigateByUrl('report/operationPendientesReport');
  }

  onCardEmployee(employeeId: number) {
    this.ref = this.dialogService.open(CardEmployeeComponent, {
      data: {
        employeeId,
      },
      header: 'Tarjeta de Usuario',
      styleClass: 'modal-sm',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
  }
  onUpdateStateTicket(item: any) {
    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .get(
        `Ticket/ActualizarStateEnviarReporte/${item.id}/${item.folioReporte}`
      )
      .subscribe({
        next: () => {
          this.swalService.onClose();
        },
        error: (err) => {
          this.swalService.onClose();
          console.log(err.error);
        },
      });
  }

  onCreateLiga() {
    if (
      this.ticketFilterService.filterTicket.finishedStart &&
      this.ticketFilterService.filterTicket.finishedEnd
    ) {
      const liga =
        'http://luxurybuildingapp.com:1008/#/publico/reporte-operacion/' +
        this.customerIdService.getcustomerId() +
        '/' +
        this.dateService.formDateToString(
          this.ticketFilterService.filterTicket.finishedStart
        ) +
        '/' +
        this.dateService.formDateToString(
          this.ticketFilterService.filterTicket.finishedEnd
        );
      this.ligaReporte = liga;
    }
  }

  onLoadMisTickets() {
    const result = this.data.filter(
      (resp: any) =>
        resp.responsableId ==
        this.authService.userTokenDto.infoEmployeeDto.employeeId
    );
    this.data = result;
  }

  onLoadTicketsAll() {
    this.data = this.dataCompleta;
  }

  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
