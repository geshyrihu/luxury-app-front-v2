import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core'; // useful for typechecking
import esLocale from '@fullcalendar/core/locales/es';
import dayGridPlugin from '@fullcalendar/daygrid';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subscription } from 'rxjs';
import CardEmployeeComponent from 'src/app/pages/operaciones/directorios/empleados/card-employee/card-employee.component';
import {
  AuthService,
  CustomSwalService,
  CustomerIdService,
  DataService,
} from 'src/app/services/common-services';

@Component({
  selector: 'app-birthday',
  templateUrl: './birthday.component.html',
  standalone: true,
  imports: [FullCalendarModule],
  providers: [DialogService, MessageService],
})
export default class BirthdayComponent implements OnInit, OnDestroy {
  public authService = inject(AuthService);
  public customerIdService = inject(CustomerIdService);
  public dataService = inject(DataService);
  public customSwalService = inject(CustomSwalService);
  public dialogService = inject(DialogService);

  subRef$: Subscription;

  calendarOptions: CalendarOptions = {
    locale: esLocale, // Agrega el idioma español
    headerToolbar: {
      left: 'dayGridMonth,dayGridWeek,dayGridDay',
      center: 'title',
      right: 'prevYear,prev,next,nextYear',
    },
    themeSystem: 'bootstrap5',
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
  };
  toggleWeekends() {
    this.calendarOptions.weekends = !this.calendarOptions.weekends; // toggle the boolean!
  }

  events: any[] = [];
  ref: DynamicDialogRef;
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();

  onLoadData() {
    // this.onLoadData();
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService
      .get('Employees/AllCumpleanos/' + this.customerIdService.customerId)
      .subscribe({
        next: (resp: any) => {
          this.calendarOptions = {
            initialView: 'dayGridMonth',
            headerToolbar: {
              left: 'dayGridMonth,dayGridWeek,dayGridDay',
              center: 'title',
              right: 'prevYear,prev,next,nextYear',
            },
            themeSystem: 'bootstrap5',
            plugins: [dayGridPlugin],
            locales: [esLocale],
            locale: 'es',
            events: resp.body,
            eventClick: this.tarjetaUsuario.bind(this),
          };
          this.customSwalService.onClose();
        },
        error: (err) => {
          this.customSwalService.onClose();
          console.log(err.error);
        },
      });
  }

  tarjetaUsuario(clickInfo: EventClickArg) {
    this.ref = this.dialogService.open(CardEmployeeComponent, {
      data: {
        employeeId: clickInfo.event._def.publicId,
      },
      header: 'Datos de usuario',
      styleClass: 'modal-md',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
  }
  ngOnInit() {
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
