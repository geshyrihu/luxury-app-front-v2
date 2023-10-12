import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Observable, Subscription } from 'rxjs';
import {
  AuthService,
  DataService,
  MessageService,
  SwalService,
  ToastService,
} from 'src/app/services/common-services';
import { CustomerIdService } from 'src/app/services/customer-id.service';
import { DateService } from 'src/app/services/date.service';
import { FiltroCalendarService } from 'src/app/services/filtro-calendar.service';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-access-log',
  templateUrl: './access-log.component.html',
  standalone: true,
  imports: [CommonModule, ComponentsModule, ButtonModule, PrimeNgModule],
  providers: [MessageService, ToastService],
})
export default class AccessLogComponent implements OnInit, OnDestroy {
  public swalService = inject(SwalService);
  public toastService = inject(ToastService);
  public authService = inject(AuthService);
  private dataService = inject(DataService);
  public dateService = inject(DateService);
  public messageService = inject(MessageService);
  public customerIdService = inject(CustomerIdService);
  private filtroCalendarService = inject(FiltroCalendarService);

  urlImgApi = environment.base_urlImg + 'Administration/accounts/';
  data: any[] = [];
  subRef$: Subscription;
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  dates$: Observable<Date[]> = this.filtroCalendarService.getDates$();

  ngOnInit(): void {
    this.onLoadData(
      this.dateService.getDateFormat(this.filtroCalendarService.fechaInicial),
      this.dateService.getDateFormat(this.filtroCalendarService.fechaFinal)
    );
    this.customerId$.subscribe(() => {
      this.onLoadData(
        this.dateService.getDateFormat(this.filtroCalendarService.fechaInicial),
        this.dateService.getDateFormat(this.filtroCalendarService.fechaFinal)
      );
    });
    this.dates$.subscribe((dates) => {
      this.onLoadData(
        this.dateService.getDateFormat(dates[0]),
        this.dateService.getDateFormat(dates[1])
      );
    });
  }

  onLoadData(fechaInicial: string, fechaFinal: string): void {
    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .get(
        'HistorialAcceso/Customer/' +
          this.customerIdService.customerId +
          '/' +
          fechaInicial +
          '/' +
          fechaFinal
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
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
