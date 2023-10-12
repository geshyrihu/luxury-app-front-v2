import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ERecurrencePipe } from 'src/app/pipes/recurrence.pipe';
import { SanitizeHtmlPipe } from 'src/app/pipes/sanitize-html.pipe';
import { ETypeMaintancePipe } from 'src/app/pipes/typeMaintance.pipe';
import { CustomerIdService } from 'src/app/services/customer-id.service';
import { DataService } from 'src/app/services/data.service';
import { DateService } from 'src/app/services/date.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-soporte-orden-servicio',
  templateUrl: './soporte-orden-servicio.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ETypeMaintancePipe,
    ERecurrencePipe,
    SanitizeHtmlPipe,
  ],
})
export default class SoporteOrdenServicioComponent
  implements OnInit, OnDestroy
{
  public dateService = inject(DateService);
  private route = inject(ActivatedRoute);
  private dataService = inject(DataService);
  private customerIdService = inject(CustomerIdService);

  subRef$: Subscription;

  id: string = '';
  item: any;
  dataCustomer: any;
  urlImg: string = '';
  nameCarpetaFecha: string = '';
  logoCustomer = '';
  nameCustomer = '';

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.onLoadItem();
    this.onLoadData();
  }
  onLoadItem() {
    this.subRef$ = this.dataService
      .get(`ServiceOrders/SoporteOrdenServicio/${this.id}`)
      .subscribe((resp: any) => {
        this.nameCarpetaFecha = this.dateService.getDateFormat(
          resp.body.fechaSolicitud
        );
        this.urlImg = `${environment.base_urlImg}customers/${this.customerIdService.customerId}/ordenServicio/${this.nameCarpetaFecha}/`;
        this.item = resp.body;
      });
  }
  onLoadData() {
    this.subRef$ = this.dataService
      .get(`Customers/${this.customerIdService.customerId}`)
      .subscribe((resp: any) => {
        this.dataCustomer = resp.body;
        this.nameCustomer = resp.body.nameCustomer;
        this.logoCustomer = `${environment.base_urlImg}Administration/customer/${resp.body.photoPath}`;
      });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
