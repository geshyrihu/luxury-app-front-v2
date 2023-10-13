import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subscription } from 'rxjs';
import {
  CustomSwalService,
  CustomToastService,
  CustomerIdService,
  DataService,
} from 'src/app/services/common-services';
import { ViewPdfService } from 'src/app/services/view-pdf.service';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import { environment } from 'src/environments/environment';
import AddoreditDocumentoComponent from './addoredit-documento.component';

@Component({
  selector: 'app-list-docuento',
  templateUrl: './list-documento.component.html',
  standalone: true,
  imports: [ComponentsModule, CommonModule, PrimeNgModule],
  providers: [DialogService, MessageService, CustomToastService],
})
export default class ListDocumentoComponent implements OnInit, OnDestroy {
  public customSwalService = inject(CustomSwalService);
  public customToastService = inject(CustomToastService);
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
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService
      .get(
        'DocumentoCustomer/GetAll/' +
          this.customerIdService.getcustomerId() +
          '/'
      )
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;
          this.customSwalService.onClose();
        },
        error: (err) => {
          console.log(err.error);
          this.customSwalService.onClose();
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
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }

  onDelete(id: number) {
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService
      .delete('DocumentoCustomer/' + id)
      .subscribe({
        next: (resp: any) => {
          this.customToastService.onShowSuccess();
          this.customSwalService.onClose();
          this.onLoadData();
          this.data = resp.body;
        },
        error: (err) => {
          this.customToastService.onShowError();
          this.customSwalService.onClose();
          console.log(err.error);
        },
      });
  }
}
