import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { Observable, Subscription } from 'rxjs';
import { CustomerIdService } from 'src/app/services/customer-id.service';
import { DataService } from 'src/app/services/data.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import { ViewPdfService } from 'src/app/services/view-pdf.service';
import ComponentsModule from 'src/app/shared/components.module';
import { environment } from 'src/environments/environment';
import AddoreditDocumentoComponent from './addoredit-documento.component';

@Component({
  selector: 'app-index-docuento',
  templateUrl: './index-documento.component.html',
  standalone: true,
  imports: [ComponentsModule, CommonModule, ToastModule, TableModule],
  providers: [DialogService, MessageService, ToastService],
})
export default class IndexDocumentoComponent implements OnInit, OnDestroy {
  public swalService = inject(SwalService);
  public toastService = inject(ToastService);
  public dataService = inject(DataService);
  public customerIdService = inject(CustomerIdService);
  public viewPdfService = inject(ViewPdfService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  data: any[] = [];

  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  urlBase = environment.base_urlImg;
  // state: boolean = true;
  ref: DynamicDialogRef;
  subRef$: Subscription;
  items = [
    {
      label: 'Editar',
      // command: () => this.onModalAddOrEdit(this.produc),
    },
  ];

  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }

  ngOnInit(): void {
    this.onLoadData();
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.customerId$.subscribe((_) => {
      this.onLoadData();
    });
  }

  onLoadData() {
    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .get(
        'DocumentoCustomer/GetAll/' +
          this.customerIdService.getcustomerId() +
          '/'
      )
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;
          console.log('🚀 ~ resp.body:', resp.body);
          this.swalService.onClose();
        },
        error: (err) => {
          console.log(err.error);
          this.swalService.onClose();
        },
      });
  }
  // onChangeState(state: boolean) {
  //   this.onLoadData();
  // }
  onModalAddOrEdit(data: any) {
    this.ref = this.dialogService.open(AddoreditDocumentoComponent, {
      data: {
        id: data.id,
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

  onDelete(id: number) {
    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .delete('DocumentoCustomer/' + id)
      .subscribe({
        next: (resp: any) => {
          this.toastService.onShowSuccess();
          this.swalService.onClose();
          this.onLoadData();
          this.data = resp.body;
        },
        error: (err) => {
          this.toastService.onShowError();
          this.swalService.onClose();
          console.log(err.error);
        },
      });
  }
}
