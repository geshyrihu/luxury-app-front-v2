import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { CustomerIdService } from 'src/app/services/customer-id.service';
import { DataService } from 'src/app/services/data.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import ComponentsModule from 'src/app/shared/components.module';
import SubirPdfComponent from 'src/app/shared/subir-pdf/subir-pdf.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-activos-documentos',
  templateUrl: './activos-documentos.component.html',
  standalone: true,
  imports: [ComponentsModule, CommonModule],
  providers: [DialogService, MessageService, ToastService],
})
export default class ActivosDocumentosComponent {
  public swalService = inject(SwalService);
  public toastService = inject(ToastService);
  public dataService = inject(DataService);
  public config = inject(DynamicDialogConfig);
  public ref = inject(DynamicDialogRef);
  public customerIdService = inject(CustomerIdService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);

  subRef$: Subscription;

  data: any[] = [];
  machineryId: number = 0;
  url: string = '';

  onLoadData() {
    this.url = `${
      environment.base_urlImg
    }customers/${this.customerIdService.getcustomerId()}/machinery/`;
    this.machineryId = this.config.data.machineryId;
    if (this.machineryId !== 0) this.onLoadData();
    this.subRef$ = this.dataService
      .get(`MachineryDocument/GetAll/${this.machineryId}`)
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
  onDelete(data: any) {
    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .delete('Machineries/DeleteDocument/' + data.id)
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
  onModalFormUploadDoc(id: number) {
    this.ref = this.dialogService.open(SubirPdfComponent, {
      data: {
        serviceOrderId: id,
        pathUrl: 'Machineries/SubirDocumento/',
      },
      header: 'Cargar Imagenes',
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
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
