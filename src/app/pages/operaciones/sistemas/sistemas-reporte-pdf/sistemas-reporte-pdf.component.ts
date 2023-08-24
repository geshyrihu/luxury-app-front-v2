import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { FiltroCalendarService } from 'src/app/services/filtro-calendar.service';
import { SistemasReporteService } from 'src/app/services/sistemas-reporte.service';
import { ToastService } from 'src/app/services/toast.service';
import CardEmployeeComponent from '../../directorios/empleados/card-employee/card-employee.component';

@Component({
  selector: 'app-sistemas-reporte-pdf',
  templateUrl: './sistemas-reporte-pdf.component.html',
  standalone: true,
  imports: [CommonModule, TableModule],
  providers: [DialogService, MessageService, ToastService],
})
export default class SistemasReportePdfComponent implements OnInit, OnDestroy {
  public toastService = inject(ToastService);
  public sistemasReporteService = inject(SistemasReporteService);
  public dataService = inject(DataService);
  public authService = inject(AuthService);
  private rangoCalendarioService = inject(FiltroCalendarService);
  public dialogService = inject(DialogService);
  data: any[] = [];
  datosUser: any;
  subRef$: Subscription;
  ref: DynamicDialogRef;

  fechaInicioDate = this.rangoCalendarioService.fechaInicial;
  fechaFinalDate = this.rangoCalendarioService.fechaFinal;

  ngOnInit() {
    this.data = this.sistemasReporteService.dataReport;
    this.onLoadData();
  }

  onLoadData() {
    this.subRef$ = this.dataService
      .get(
        'Sistemas/GetUserData/' +
          this.authService.userTokenDto.infoUserAuthDto.applicationUserId
      )
      .subscribe({
        next: (resp: any) => {
          this.datosUser = resp.body;
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
  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
