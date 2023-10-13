import { NgIf } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  CustomSwalService,
  CustomToastService,
  CustomerIdService,
  DataService,
} from 'src/app/services/common-services';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cabecera-solicitud-pago-pdf',
  templateUrl: './cabecera-solicitud-pago-pdf.component.html',
  standalone: true,
  imports: [NgIf],
  providers: [CustomToastService],
})
export default class CabeceraSolicitudPagoPdfComponent
  implements OnInit, OnDestroy
{
  public dataService = inject(DataService);
  public customerIdService = inject(CustomerIdService);
  public customToastService = inject(CustomToastService);
  public customSwalService = inject(CustomSwalService);

  data: any;
  subRef$: Subscription;

  url: string = environment.base_urlImg + 'Administration/customer/';
  @Input()
  titulo: string = '';
  @Input()
  folio: string = '';
  @Input()
  factura: string = '';

  ngOnInit(): void {
    this.onloadData();
  }

  onloadData() {
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService
      .get('Customers/' + this.customerIdService.getcustomerId())
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
