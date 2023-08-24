import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { SelectItemService } from 'src/app/services/select-item.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import ComponentsModule from 'src/app/shared/components.module';
import CreateOrdenCompraComponent from '../../orden-compra/orden-compra/create-orden-compra/create-orden-compra.component';

@Component({
  selector: 'app-modal-edit-cotizacion',
  templateUrl: './modal-edit-cotizacion.component.html',
  standalone: true,
  imports: [FormsModule, ComponentsModule, CommonModule, ToastModule],
  providers: [DialogService, MessageService, ToastService],
})
export default class ModalEditCotizacionComponent implements OnInit, OnDestroy {
  public swalService = inject(SwalService);
  public toastService = inject(ToastService);
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  public dataService = inject(DataService);
  public selectItemService = inject(SelectItemService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public router = inject(Router);

  subRef$: Subscription;

  cotizacionProveedorId = 0;
  cotizacionProveedor: any;
  solicitudCompra: any;
  solicitudCompraDetalle: any;
  solicitudCompraId = 0;
  providerId = 0;
  providerName: string = '';
  posicionCotizacion: number = 0;
  cb_providers: any[] = [];
  proveedorResult: any[] = [];
  cotizacionesRelacionadas: any[] = [];

  ngOnInit(): void {
    this.solicitudCompraId = this.config.data.solicitudCompraId;
    this.posicionCotizacion = this.config.data.posicionCotizacion;
    this.selectItemService.onGetSelectItem('Providers').subscribe((resp) => {
      this.cb_providers = resp;
    });
    this.onLoadSelectItemProvider();
    this.onGetCotizacioProveedor();
    this.onCotizacionesRelacionadas();
    this.onLoadData();
  }

  onLoadSelectItemProvider() {
    this.subRef$ = this.dataService
      .get('CotizacionProveedor/GetProviders/' + this.solicitudCompraId)
      .subscribe({
        next: (resp: any) => {
          this.cb_providers = resp.body;
        },
        error: (err) => {
          this.toastService.onShowError();
          console.log(err.error);
        },
      });
  }

  onGetCotizacioProveedor() {
    this.subRef$ = this.dataService
      .get<any>(
        `CotizacionProveedor/GetPosicionCotizacion/${this.solicitudCompraId}/${this.posicionCotizacion}`
      )
      .subscribe((resp: any) => {
        this.cotizacionProveedor = resp.body;
        this.providerId = resp.body.providerId;
        this.providerName = resp.body.provider;
      });
  }
  onLoadData() {
    this.subRef$ = this.dataService
      .get<any>(`SolicitudCompra/${this.solicitudCompraId}`)
      .subscribe({
        next: (resp: any) => {
          this.solicitudCompra = resp.body;
          this.solicitudCompraDetalle = resp.body.solicitudCompraDetalle;
        },
        error: (err) => {
          this.toastService.onShowError();
          console.log(err.error);
        },
      });
  }

  onUpdateProvider() {
    this.cotizacionProveedor.providerId = this.providerId;
    this.subRef$ = this.dataService
      .put(
        `CotizacionProveedor/UpdateProvider/${this.cotizacionProveedor.id}`,
        this.cotizacionProveedor
      )
      .subscribe({
        next: (resp: any) => {
          this.toastService.onShowSuccess();
        },
        error: (err) => {
          this.toastService.onShowError();
          console.log(err.error);
        },
      });
  }

  onChange(item: any) {
    const data = {
      employeeId: item.employeeId,
      cantidad: item.cantidad,
      descuento: item.descuento,
      descuento2: item.descuento2,
      descuento3: item.descuento3,
      id: item.id,
      iva: item.iva,
      iva2: item.iva2,
      iva3: item.iva3,
      ivaAplicado: item.ivaAplicado,
      ivaAplicado2: item.ivaAplicado2,
      ivaAplicado3: item.ivaAplicado3,
      precio: item.precio,
      precio2: item.precio2,
      precio3: item.precio3,
      productoId: item.productoId,
      solicitudCompraId: item.solicitudCompraId,
      subTotal: item.subTotal,
      subTotal2: item.subTotal2,
      subTotal3: item.subTotal3,
      total: item.total,
      total2: item.total2,
      total3: item.total3,
      unidadMedidaId: item.unidadMedidaId,
    };
    this.subRef$ = this.dataService
      .put(`SolicitudCompraDetalle/UpdatePrice/${item.id}`, data)
      .subscribe({
        next: () => {
          this.onLoadData();
          this.toastService.onShowSuccess();
        },
        error: (err) => {
          this.toastService.onShowError();
          console.log(err.error);
        },
      });
  }

  onDeleteProvider() {
    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .delete(
        `solicitudCompra/DeleteProvider/${this.solicitudCompraId}/${this.providerId}`
      )
      .subscribe({
        next: () => {
          this.ref.close(true);
          this.swalService.onClose();
        },
        error: (err) => {
          this.toastService.onShowError();
          console.log(err.error);
          this.swalService.onClose();
        },
      });
  }
  onModalCreateOrdenCompra() {
    this.ref.close();
    this.ref = this.dialogService.open(CreateOrdenCompraComponent, {
      data: {
        solicitudCompraId: this.solicitudCompra.id,
        folioSolicitudCompra: this.solicitudCompra.folio,
        proveedorId: this.cotizacionProveedor.providerId,
        posicionCotizacion: this.posicionCotizacion,
      },
      header: 'Crear Orden de compra',
      width: '1000px',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((ordenCompraId: number) => {
      if (ordenCompraId !== undefined) {
        this.router.navigateByUrl(
          `operaciones/compras/orden-compra/${ordenCompraId}`
        );
      }
    });
  }

  onCotizacionesRelacionadas() {
    this.subRef$ = this.dataService
      .get(`OrdenCompra/CotizacionesRelacionadas/${this.solicitudCompraId}`)
      .subscribe({
        next: (resp: any) => {
          this.cotizacionesRelacionadas = resp.body;
        },
        error: (err) => {
          this.toastService.onShowError();
          console.log(err.error);
        },
      });
  }
  public saveProviderId(e): void {
    let find = this.cb_providers.find((x) => x?.label === e.target.value);
    this.providerId = find?.value;
    this.onUpdateProvider();
  }

  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
