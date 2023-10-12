import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import CrudCatalogoDescripcionComponent from '../crud-catalogo-descripcion/crud-catalogo-descripcion.component';

@Component({
  selector: 'app-index-catalogo-descripcion',
  templateUrl: './index-catalogo-descripcion.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, ComponentsModule, PrimeNgModule],
  providers: [DialogService, MessageService, ToastService],
})
export default class IndexCatalogoDescripcionComponent
  implements OnInit, OnDestroy
{
  private dataService = inject(DataService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public swalService = inject(SwalService);
  public toastService = inject(ToastService);
  data: any[] = [];
  ref: DynamicDialogRef;
  subRef$: Subscription;

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .get<any[]>('CatalogoEntregaRecepcionDescripcion')
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
      .delete(`CatalogoEntregaRecepcionDescripcion/${data.id}`)
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

  onModalAddOrEdit(data: any) {
    this.ref = this.dialogService.open(CrudCatalogoDescripcionComponent, {
      data: {
        id: data.id,
      },
      header: data.title,
      styleClass: 'modal-md ',
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

  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
