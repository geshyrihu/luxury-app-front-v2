import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { DateService } from 'src/app/services/date.service';
import { FiltroCalendarService } from 'src/app/services/filtro-calendar.service';
import { SistemasReporteService } from 'src/app/services/sistemas-reporte.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import { environment } from 'src/environments/environment';
import CardEmployeeComponent from '../../directorios/empleados/card-employee/card-employee.component';
import AddoreditSistemasReporteComponent from '../addoredit-sistemas-reporte/addoredit-sistemas-reporte.component';

@Component({
  selector: 'app-sistemas-reporte',
  templateUrl: './sistemas-reporte.component.html',
  standalone: true,
  imports: [ComponentsModule, CommonModule, RouterModule, PrimeNgModule],
  providers: [DialogService, MessageService, ConfirmationService, ToastService],
})
export default class SistemasReporteComponent implements OnInit, OnDestroy {
  public dataService = inject(DataService);
  public dateService = inject(DateService);
  public swalService = inject(SwalService);
  public toastService = inject(ToastService);
  public authService = inject(AuthService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public sistemasReporteService = inject(SistemasReporteService);
  private filtroCalendarService = inject(FiltroCalendarService);

  ref: DynamicDialogRef;
  subRef$: Subscription;

  base_urlImg = `${environment.base_urlImg}customers/`;
  data: any[] = [];
  listCustomer: any[] = [];

  employeeId: number = this.authService.userTokenDto.infoEmployeeDto.employeeId;
  status: number = 0;
  pendiente: boolean = true;
  terminado: boolean = true;
  pendientes: number = 0;
  terminados: number = 0;
  url = `${environment.base_urlImg}Administration/accounts/`;
  url_Customer = `${environment.base_urlImg}Administration/customer/`;
  dates$: Observable<Date[]> = this.filtroCalendarService.getDates$();

  ngOnInit(): void {
    this.onLoadData(
      this.dateService.getDateFormat(this.filtroCalendarService.fechaInicial),
      this.dateService.getDateFormat(this.filtroCalendarService.fechaFinal)
    );
    this.dates$.subscribe((dates) => {
      this.onLoadData(
        this.dateService.getDateFormat(dates[0]),
        this.dateService.getDateFormat(dates[1])
      );
    });
  }

  onFilter(pendiente: boolean, terminado: boolean, employeeId: number): void {
    this.pendiente = pendiente;
    this.terminado = terminado;
    this.employeeId = employeeId;
    this.onLoadData(
      this.dateService.getDateFormat(this.filtroCalendarService.fechaInicial),
      this.dateService.getDateFormat(this.filtroCalendarService.fechaFinal)
    );
  }

  onLoadData(fechaInicio: string, fechaFinal: string): void {
    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .get(
        `Ticket/SolicitudesSistemas/${fechaInicio}/${fechaFinal}/${this.pendiente}/${this.terminado}/${this.employeeId}`
      )
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;

          if (this.data !== null) {
            this.pendientes = this.onFilterItems(resp.body, 0);
            this.terminados = this.onFilterItems(resp.body, 1);
          }
          this.sistemasReporteService.setData(this.data);
          this.swalService.onClose();
        },
        error: (err) => {
          console.log(err.error);
          this.swalService.onClose();
        },
      });
  }

  onFilterItems(data: any[], status: number): number {
    const a = data.filter((resp) => resp.status === status);
    return a.length;
  }
  onChangeUser() {
    if (this.employeeId == 0) {
      this.employeeId =
        this.authService.userTokenDto.infoEmployeeDto.employeeId;
    } else {
      this.employeeId = null;
    }
    this.onLoadData(
      this.dateService.getDateFormat(this.filtroCalendarService.fechaInicial),
      this.dateService.getDateFormat(this.filtroCalendarService.fechaFinal)
    );
  }

  showModalAddOrEdit(id: number) {
    this.ref = this.dialogService.open(AddoreditSistemasReporteComponent, {
      data: {
        id: id,
      },
      header: 'Reporte de operación',
      styleClass: 'modal-lg',
      autoZIndex: true,
      closeOnEscape: true,
    });
    this.ref.onClose.subscribe((resp: any) => {
      if (resp !== undefined) {
        this.onLoadData(
          this.dateService.getDateFormat(
            this.filtroCalendarService.fechaInicial
          ),
          this.dateService.getDateFormat(this.filtroCalendarService.fechaFinal)
        );
        this.toastService.onShowSuccess();
      }
    });
  }

  eliminarTiket(id: number) {
    this.subRef$ = this.dataService
      .delete('Ticket/DeleteFinal/' + id)
      .subscribe({
        next: () => {
          this.onLoadData(
            this.dateService.getDateFormat(
              this.filtroCalendarService.fechaInicial
            ),
            this.dateService.getDateFormat(
              this.filtroCalendarService.fechaFinal
            )
          );
          this.toastService.onShowSuccess();
        },
        error: (err) => {
          this.toastService.onShowError();
          console.log(err.error);
        },
      });
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

  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
