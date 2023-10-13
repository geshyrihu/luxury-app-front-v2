import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { ISelectItemDto } from 'src/app/interfaces/ISelectItemDto.interface';
import { EMonthPipe } from 'src/app/pipes/month.pipe';
import { ERecurrencePipe } from 'src/app/pipes/recurrence.pipe';
import { SanitizeHtmlPipe } from 'src/app/pipes/sanitize-html.pipe';
import {
  CustomSwalService,
  CustomToastService,
  CustomerIdService,
  DataService,
} from 'src/app/services/common-services';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-general-anual-mantenimiento',
  templateUrl: './general-anual-mantenimiento.component.html',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    NgbAlertModule,
    ERecurrencePipe,
    SanitizeHtmlPipe,
    EMonthPipe,
  ],
  providers: [CustomToastService],
})
export default class GeneralAnualMantenimientoComponent
  implements OnInit, OnDestroy
{
  public customSwalService = inject(CustomSwalService);
  public dataService = inject(DataService);
  public customerIdService = inject(CustomerIdService);
  public customToastService = inject(CustomToastService);

  data: any[] = [];
  subRef$: Subscription;
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  cb_providers: ISelectItemDto[] = [];
  providerId = '';
  pathImg = '';

  ngOnInit() {
    this.onLoadData();
    this.onLoadProveedores();
    this.pathImg = `${environment.base_urlImg}customers/${this.customerIdService.customerId}/machinery/`;
    this.customerId$.subscribe((resp) => {
      this.pathImg = `${environment.base_urlImg}customers/${this.customerIdService.customerId}/machinery/`;
      this.onLoadData();
    });
  }
  onLoadProveedores() {
    this.cb_providers = [];
    this.subRef$ = this.dataService
      .get(
        `MaintenanceCalendars/ProveedoresCalendario/${this.customerIdService.customerId}`
      )
      .subscribe({
        next: (resp: any) => {
          this.cb_providers = resp.body;
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
        },
      });
  }
  onLoadData() {
    this.data = [];
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService
      .get(
        `MaintenanceCalendars/GeneralMantenimiento/${this.customerIdService.customerId}/${this.providerId}`
      )
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;
          this.customSwalService.onClose();
        },
        error: (err) => {
          console.log(err.error);
          this.customSwalService.onClose();
        },
      });
  }
  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
