import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { Subscription } from 'rxjs';
import { CustomSwalService } from 'src/app/services/custom-swal.service';
import { CustomToastService } from 'src/app/services/custom-toast.service';
import { DataService } from 'src/app/services/data.service';
import { SolicitudCompraService } from 'src/app/services/solicitud-compra.service';
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
  public customSwalService = inject(CustomSwalService);
  public customToastService = inject(CustomToastService);
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
        this.customToastService.onShowSuccess();
        this.onUpdateData();
        // this.onLoadData();
      }
    });
  }
  onUpdateData() {
    this.updateData.emit();
  }

  onDeleteProduct(data: any) {
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService
      .delete(`SolicitudCompraDetalle/${data.id}`)
      .subscribe({
        next: () => {
          this.customToastService.onShowSuccess();
          this.onUpdateData();
          this.solicitudCompraService.onDeleteProduct();
          this.customSwalService.onClose();
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
          this.customSwalService.onClose();
        },
      });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
