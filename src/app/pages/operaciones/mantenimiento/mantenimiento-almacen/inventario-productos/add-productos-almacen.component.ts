import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { Subscription } from 'rxjs';
import { IProductoListAddDto } from 'src/app/interfaces/IProductoListAddDto.interface.interface';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerIdService } from 'src/app/services/customer-id.service';
import { DataService } from 'src/app/services/data.service';
import { SelectItemService } from 'src/app/services/select-item.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import ComponentsModule from 'src/app/shared/components.module';
import TarjetaProductoComponent from '../../mantenimiento-catalogos/tarjeta-producto/tarjeta-producto.component';

@Component({
  selector: 'app-add-productos-almacen',
  templateUrl: './add-productos-almacen.component.html',
  standalone: true,
  imports: [
    ComponentsModule,
    FormsModule,
    CommonModule,
    TableModule,
    ToastModule,
  ],
  providers: [DialogService, MessageService, ToastService],
})
export default class AddProductosAlmacenComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  public swalService = inject(SwalService);
  public toastService = inject(ToastService);
  private selectItemService = inject(SelectItemService);
  public authService = inject(AuthService);
  public customerIdService = inject(CustomerIdService);
  public dialogService = inject(DialogService);
  public ref = inject(DynamicDialogRef);

  data: any[] = [];
  cb_UnidadMedida: any[] = [];
  mensajeError = '';
  subRef$: Subscription;

  onLoadSelectItem() {
    this.selectItemService
      .onGetSelectItem('getMeasurementUnits')
      .subscribe((resp) => {
        this.cb_UnidadMedida = resp;
      });
  }

  ngOnInit(): void {
    this.onLoadSelectItem();
    this.onLoadData();
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
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.toastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }

  onLoadData() {
    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .get(
        `InventarioProducto/GetProductoDropdownDto/${this.customerIdService.customerId}`
      )
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;
          this.swalService.onClose();
        },
        error: (err) => {
          console.log(err.error);
          this.swalService.onClose();
          this.toastService.onShowError();
        },
      });
  }
  onSubmit(item: IProductoListAddDto) {
    item.employeeId = this.authService.userTokenDto.infoEmployeeDto.employeeId;
    item.customerId = this.customerIdService.customerId;

    if (
      item.existencia < 0 ||
      item.unidadDeMedidaId == 0 ||
      item.stockMax == 0 ||
      item.stockMin == 0
    ) {
      this.mensajeError =
        'Completa todos los campos :Existencia, Unidad, Stok Max,   Stok Min';
      return;
    }
    this.swalService.onLoading();

    this.subRef$ = this.dataService
      .post(`InventarioProducto/`, item)
      .subscribe({
        next: () => {
          this.mensajeError = '';
          this.swalService.onClose();
          this.onLoadData();
        },
        error: (err) => {
          this.toastService.onShowError();
          this.swalService.onClose();
          console.log(err.error);
        },
      });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
