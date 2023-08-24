import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { SolicitudCompraService } from 'src/app/services/solicitud-compra.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import ComponentsModule from 'src/app/shared/components.module';
import EditProductoComponent from '../edit-producto.component';
// import SolicitudCompraService from "../solicitud-compra.service";

@Component({
  selector: 'app-solicitud-compra-detalle',
  templateUrl: './solicitud-compra-detalle.component.html',
  standalone: true,
  imports: [ComponentsModule, TableModule],
})
export default class SolicitudCompraDetalleComponent {
  private dialogService = inject(DialogService);
  public swalService = inject(SwalService);
  public toastService = inject(ToastService);
  public dataService = inject(DataService);
  private solicitudCompraService = inject(SolicitudCompraService);

  subRef$: Subscription;

  @Input()
  SolicitudCompraDetalle: any[] = [];
  @Input()
  solicitudCompraId: number = 0;

  @Output()
  updateData = new EventEmitter<void>();
  ref: DynamicDialogRef;

  editProduct(data: any) {
    this.ref = this.dialogService.open(EditProductoComponent, {
      data: {
        solicitudCompraId: this.solicitudCompraId,
        id: data.id,
      },
      header: 'Editar Producto',
      width: '600px',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.toastService.onShowSuccess();
        this.onUpdateData();
        // this.onLoadData();
      }
    });
  }
  onUpdateData() {
    this.updateData.emit();
  }

  onDeleteProduct(data: any) {
    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .delete(`SolicitudCompraDetalle/${data.id}`)
      .subscribe({
        next: () => {
          this.toastService.onShowSuccess();
          this.onUpdateData();
          this.solicitudCompraService.onDeleteProduct();
          this.swalService.onClose();
        },
        error: (err) => {
          this.toastService.onShowError();
          console.log(err.error);
          this.swalService.onClose();
        },
      });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
