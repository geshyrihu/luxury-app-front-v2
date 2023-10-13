import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Observable, Subscription } from 'rxjs';
import {
  AuthService,
  CustomSwalService,
  CustomToastService,
  CustomerIdService,
  DataService,
  DateService,
} from 'src/app/services/common-services';
import { FiltroCalendarService } from 'src/app/services/filtro-calendar.service';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-access-log',
  templateUrl: './access-log.component.html',
  standalone: true,
  imports: [CommonModule, ComponentsModule, ButtonModule, PrimeNgModule],
  providers: [MessageService, CustomToastService],
})
export default class AccessLogComponent implements OnInit, OnDestroy {
  public customSwalService = inject(CustomSwalService);
  public customToastService = inject(CustomToastService);
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
    this.customSwalService.onLoading();
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
          this.customSwalService.onClose();
        },
        error: (err) => {
          console.log(err.error);
          this.customSwalService.onClose();
          this.customToastService.onShowError();
        },
      });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
