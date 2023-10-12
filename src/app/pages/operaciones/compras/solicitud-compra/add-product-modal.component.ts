import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { ISelectItemDto } from 'src/app/interfaces/ISelectItemDto.interface';
import TarjetaProductoComponent from 'src/app/pages/operaciones/mantenimiento/mantenimiento-catalogos/tarjeta-producto/tarjeta-producto.component';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { SelectItemService } from 'src/app/services/select-item.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-product-modal',
  templateUrl: './add-product-modal.component.html',
  standalone: true,
  imports: [PrimeNgModule, CommonModule, ComponentsModule, FormsModule],
  providers: [DialogService, MessageService, ConfirmationService, ToastService],
})
export default class AddProductModalComponent implements OnInit {
  public toastService = inject(ToastService);
  public swalService = inject(SwalService);

  isInRole: boolean;
  id: any = 0;
  data: any[] = [];
  urlImagenProducto = environment.base_urlImg + 'Administration/products/';
  mensajeError = false;

  solicitudCompraId: number = 0;
  cb_unidadMedida: ISelectItemDto[] = [];

  constructor(
    private dataService: DataService,
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private selectListService: SelectItemService,
    private authService: AuthService,
    public messageService: MessageService,
    public dialogService: DialogService
  ) {
    this.selectListService
      .onGetSelectItem('GetMeasurementUnits')
      .subscribe((resp) => {
        this.cb_unidadMedida = resp;
      });
  }

  ngOnInit(): void {
    this.id = this.config.data.id;
    this.solicitudCompraId = this.config.data.solicitudCompraId;
    this.onLoadProduct();
  }

  onLoadProduct() {
    this.swalService.onLoading();
    this.dataService
      .get(
        `SolicitudCompraDetalle/AddProductoToSolicitudDto/${this.solicitudCompraId}`
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

  onSubmit(item: any) {
    if (
      item.unidadMedidaId === '' ||
      item.productoId === 0 ||
      item.cantidad === 0
    ) {
      this.mensajeError = true;
      return;
    }

    item.EmployeeId = this.authService.infoEmployeeDto.employeeId;
    this.dataService.post<any>(`SolicitudCompraDetalle/`, item).subscribe({
      next: () => {
        this.toastService.onShowSuccess();
        this.mensajeError = false;
        this.onLoadProduct();
      },
      error: (err) => {
        this.toastService.onShowError();
        console.log(err.error);
      },
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
    this.ref.onClose.subscribe((resp: any) => {});
  }
  showToast(severity: string, summary: string, detail: string) {
    this.messageService.add({
      severity: severity,
      summary: summary,
      detail: detail,
    });
  }
}
