import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Observable, Subscription } from 'rxjs';
import { SanitizeHtmlPipe } from 'src/app/pipes/sanitize-html.pipe';
import {
  CustomSwalService,
  CustomToastService,
  CustomerIdService,
  DataService,
} from 'src/app/services/common-services';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-reporte-completo-activos',
  templateUrl: './reporte-completo-activos.component.html',
  standalone: true,
  imports: [CommonModule, SanitizeHtmlPipe],
  providers: [MessageService, CustomToastService],
})
export default class ReporteCompletoActivosComponent
  implements OnInit, OnDestroy
{
  public customSwalService = inject(CustomSwalService);
  public customToastService = inject(CustomToastService);
  public customerIdService = inject(CustomerIdService);
  public dataService = inject(DataService);
  public messageService = inject(MessageService); // private reporteActivosPdfService: ReporteActivosPdfService

  base_urlImg = '';
  data: any[] = [];
  titulo: string = '';
  customerId: number;
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  subRef$: Subscription;

  ngOnInit(): void {
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.customerId = this.customerIdService.getcustomerId();
    this.onLoadData();
    this.customerId$.subscribe((resp) => {
      this.customerId = this.customerIdService.getcustomerId();
      this.onLoadData();
    });
  }

  onLoadData() {
    this.base_urlImg = this.urlImg(this.customerId);
    this.customSwalService.onLoading();

    this.subRef$ = this.dataService
      .get('Machineries/InventarioCompleto/' + this.customerId)
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
    this.customSwalService.onClose();
  }

  urlImg(customerId: any): string {
    return `${environment.base_urlImg}customers/${customerId}/machinery/`;
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
