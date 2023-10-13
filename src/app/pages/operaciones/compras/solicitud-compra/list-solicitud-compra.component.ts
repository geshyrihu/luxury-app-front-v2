import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subscription } from 'rxjs';
import { EStatusOrdenCompraPipe } from 'src/app/pipes/status-orden-compra.pipe';
import {
  AuthService,
  CustomSwalService,
  CustomToastService,
  CustomerIdService,
  DataService,
  SolicitudCompraService,
} from 'src/app/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';

@Component({
  selector: 'app-list-solicitud-compra',
  templateUrl: './list-solicitud-compra.component.html',
  standalone: true,
  imports: [
    ComponentsModule,
    CommonModule,
    PrimeNgModule,
    EStatusOrdenCompraPipe,
  ],
  providers: [
    DialogService,
    MessageService,
    ConfirmationService,
    CustomToastService,
  ],
})
export default class ListSolicitudCompraComponent implements OnInit, OnDestroy {
  public authService = inject(AuthService);
  public customerIdService = inject(CustomerIdService);
  public dataService = inject(DataService);
  public messageService = inject(MessageService);
  public router = inject(Router);
  public solicitudCompraService = inject(SolicitudCompraService);
  public customSwalService = inject(CustomSwalService);
  public customToastService = inject(CustomToastService);
  public dialogService = inject(DialogService);
  data: any[] = [];
  ref: DynamicDialogRef;
  subRef$: Subscription;
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  statusCompra: number = this.solicitudCompraService.onGetStatusFiltro();
  textoFiltro: string = this.solicitudCompraService.onGetTextoFiltro();

  ngOnInit(): void {
    this.onLoadData();
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }

  onBusqueda(texto: string) {
    this.solicitudCompraService.onSetTextoFiltro(texto);
  }
  onLoadData() {
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService
      .get(
        `SolicitudCompra/Solicitudes/${
          this.customerIdService.customerId
        }/${this.solicitudCompraService.onGetStatusFiltro()}`
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

  onDelete(data: any) {
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService
      .delete(`SolicitudCompra/${data.id}`)
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

  onSolicitudCompra(id: number) {
    this.router.navigateByUrl(`operaciones/compras/solicitud-compra/${id}`);
  }

  onSelectStatus(status: any) {
    this.solicitudCompraService.onSetStatusFiltro(status);

    this.onLoadData();
  }
  // ...Crear Orden de compra
  onCreateOrder(id: any) {
    this.router.navigateByUrl(`operaciones/compras/orden-compra/${0}/${id}`);
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
