import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ERecurrencePipe } from 'src/app/pipes/recurrence.pipe';
import { SanitizeHtmlPipe } from 'src/app/pipes/sanitize-html.pipe';
import { ETypeMaintancePipe } from 'src/app/pipes/typeMaintance.pipe';
import { CustomerIdService } from 'src/app/services/common-services';
import { CustomToastService } from 'src/app/services/custom-toast.service';
import { DataService } from 'src/app/services/data.service';
import { DateService } from 'src/app/services/date.service';
import { PeriodoMonthService } from 'src/app/services/periodo-month.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-reporte-ordenes-servicio',
  templateUrl: './reporte-ordenes-servicio.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ETypeMaintancePipe,
    ERecurrencePipe,
    SanitizeHtmlPipe,
    DatePipe,
  ],
  providers: [MessageService, CustomToastService],
})
export default class ReporteOrdenesServicioComponent
  implements OnInit, OnDestroy
{
  public customToastService = inject(CustomToastService);
  public dataService = inject(DataService);
  public customerIdService = inject(CustomerIdService);
  public messageService = inject(MessageService);
  public dateService = inject(DateService);
  public periodoMonthService = inject(PeriodoMonthService);

  data: any[] = [];
  subRef$: Subscription;
  urlImg: string = '';
  fecha: string = '';
  dataCustomer: any;
  nameCarpetaFecha: string = '';
  logoCustomer = '';
  nameCustomer = '';

  ngOnInit(): void {
    this.onLoadData();
    this.onLoadDataCXustomer();
  }
  //TODO: Centralizar obtener ifno de customer...
  onLoadDataCXustomer() {
    this.subRef$ = this.dataService
      .get(`Customers/${this.customerIdService.customerId}`)
      .subscribe((resp: any) => {
        this.dataCustomer = resp.body;
        this.nameCustomer = resp.body.nameCustomer;
        this.logoCustomer = `${environment.base_urlImg}Administration/customer/${resp.body.photoPath}`;
      });
  }

  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    this.subRef$ = this.dataService
      .get(
        'ServiceOrders/ReporteOrdenesServicio/' +
          this.customerIdService.customerId +
          '/' +
          this.dateService.getDateFormat(
            this.periodoMonthService.getPeriodoInicio
          ) +
          '-01'
      )
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;
          this.nameCarpetaFecha = this.data[0].nameFolder;
          this.urlImg = `${environment.base_urlImg}customers/${this.customerIdService.customerId}/ordenServicio/${this.nameCarpetaFecha}/`;
          this.customToastService.onClose();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
