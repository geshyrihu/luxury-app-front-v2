import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { Subscription } from 'rxjs';
import {
  CustomSwalService,
  CustomToastService,
  CustomerIdService,
  DataService,
} from 'src/app/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ordenes-servicio-reporte-proveedor',
  templateUrl: './ordenes-servicio-reporte-proveedor.component.html',
  standalone: true,
  imports: [NgbTooltipModule, ComponentsModule, TableModule],
  providers: [MessageService, CustomToastService],
})
export default class OrdenesServicioReporteProveedorComponent
  implements OnInit, OnDestroy
{
  public config = inject(DynamicDialogConfig);
  public customerIdService = inject(CustomerIdService);
  public messageService = inject(MessageService);
  public dataService = inject(DataService);
  public ref = inject(DynamicDialogRef);
  public customSwalService = inject(CustomSwalService);
  public customToastService = inject(CustomToastService);

  id: number = 0;
  subRef$: Subscription;
  data: any[] = [];
  urlImg: string = '';
  nameCarpetaFecha = '';

  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
  }
  onLoadData() {
    this.subRef$ = this.dataService
      .get(`ServiceOrders/OrdenesServicioReporteProveedor/${this.id}`)
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;
          this.nameCarpetaFecha = this.data[0].nameFolder;
          this.urlImg = `${environment.base_urlImg}customers/${this.customerIdService.customerId}/ordenServicio/${this.nameCarpetaFecha}/`;
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
        },
      });
  }

  deleteDoc(id: number): void {
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService
      .delete(`ServiceOrders/DeleteDocument/${id}`)
      .subscribe({
        next: () => {
          this.onLoadData();
          this.customSwalService.onClose();
          this.customToastService.onShowSuccess();
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
