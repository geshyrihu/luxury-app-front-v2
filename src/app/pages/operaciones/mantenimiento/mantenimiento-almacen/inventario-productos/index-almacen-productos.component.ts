import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerIdService } from 'src/app/services/customer-id.service';
import { DataService } from 'src/app/services/data.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import { environment } from 'src/environments/environment';
import TarjetaProductoComponent from '../../mantenimiento-catalogos/tarjeta-producto/tarjeta-producto.component';
import AddOrEditEntradasComponent from '../entradas/addoredit-entradas.component';
import CrudSalidasComponent from '../salidas/addoredit-salidas.component';
import AddProductosAlmacenComponent from './add-productos-almacen.component';
import EditProductosAlmacenComponent from './edit-productos-almacen.component';

const urlImgBase = environment.base_urlImg;

@Component({
  selector: 'app-index-almacen-productos',
  templateUrl: './index-almacen-productos.component.html',
  standalone: true,
  imports: [ComponentsModule, CommonModule, PrimeNgModule],
  providers: [DialogService, MessageService, ConfirmationService, ToastService],
})
export default class IndexAlmacenProductosComponent
  implements OnInit, OnDestroy
{
  private customerIdService = inject(CustomerIdService);
  private dataService = inject(DataService);
  public authService = inject(AuthService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public swalService = inject(SwalService);
  public toastService = inject(ToastService);

  data: any[] = [];
  ref: DynamicDialogRef;
  subRef$: Subscription;

  urlImgBase = urlImgBase + 'Administration/products/';
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  rowGroupMetadata: any = this.customerIdService.getCustomerId$();

  ngOnInit(): void {
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }
  onSort() {
    this.updateRowGroupMetaData();
  }

  updateRowGroupMetaData() {
    this.rowGroupMetadata = {};

    if (this.data) {
      for (let i = 0; i < this.data.length; i++) {
        let rowData = this.data[i];
        let representativeName = rowData.category;
        if (i == 0) {
          this.rowGroupMetadata[representativeName] = { index: 0, size: 1 };
        } else {
          let previousRowData = this.data[i - 1];
          let previousRowGroup = previousRowData.category;
          if (representativeName === previousRowGroup)
            this.rowGroupMetadata[representativeName].size++;
          else
            this.rowGroupMetadata[representativeName] = { index: i, size: 1 };
        }
      }
    }
  }

  onLoadData() {
    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .get(
        'InventarioProducto/GetAsyncAll/' + this.customerIdService.customerId
      )
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;
          this.swalService.onClose();
          this.updateRowGroupMetaData();
        },
        error: (err) => {
          this.toastService.onShowError();
          console.log(err.error);
          this.swalService.onClose();
        },
      });
  }

  onDelete(data: any) {
    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .delete(`InventarioProducto/${data.id}`)
      .subscribe({
        next: () => {
          this.onLoadData();
          this.swalService.onClose();
          this.toastService.onShowSuccess();
        },
        error: (err) => {
          console.log(err.error);
          this.swalService.onClose();
          this.toastService.onShowError();
        },
      });
  }

  editProductos(data: any) {
    this.ref = this.dialogService.open(EditProductosAlmacenComponent, {
      data: {
        id: data.id,
        idProducto: data.idProducto,
      },
      header: data.title,
      styleClass: 'modal-md',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.toastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }
  addProductos(data: any) {
    this.ref = this.dialogService.open(AddProductosAlmacenComponent, {
      data: {
        id: data.id,
        idProducto: data.idProducto,
      },
      header: data.title,
      height: 'auto',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.toastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }

  onAddEntrada(data: any) {
    this.ref = this.dialogService.open(AddOrEditEntradasComponent, {
      data: {
        id: 0,
        idProducto: data.idProducto,
        nombreProducto: data.nombreProducto,
      },
      header: 'Entrada de Productos',
      styleClass: 'modal-md',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.toastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }
  onAddSalida(data: any) {
    this.ref = this.dialogService.open(CrudSalidasComponent, {
      data: {
        id: data.id,
        idInventarioProducto: data.idInventarioProducto,
        idProducto: data.idProducto,
        nombreProducto: data.nombreProducto,
      },
      header: 'Salida de Productos',
      styleClass: 'modal-md',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.toastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }

  onModalTarjetaProducto(productoId: number): void {
    this.ref = this.dialogService.open(TarjetaProductoComponent, {
      data: {
        productoId: productoId,
      },
      header: 'Tarjeta de Producto',
      width: '1000px',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
