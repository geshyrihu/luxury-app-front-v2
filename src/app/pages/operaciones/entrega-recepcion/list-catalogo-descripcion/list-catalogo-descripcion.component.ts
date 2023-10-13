import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import {
  CustomSwalService,
  CustomToastService,
  DataService,
} from 'src/app/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import CrudCatalogoDescripcionComponent from '../crud-catalogo-descripcion/crud-catalogo-descripcion.component';

@Component({
  selector: 'app-list-catalogo-descripcion',
  templateUrl: './list-catalogo-descripcion.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, ComponentsModule, PrimeNgModule],
  providers: [DialogService, MessageService, CustomToastService],
})
export default class ListCatalogoDescripcionComponent
  implements OnInit, OnDestroy
{
  private dataService = inject(DataService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public customSwalService = inject(CustomSwalService);
  public customToastService = inject(CustomToastService);
  data: any[] = [];
  ref: DynamicDialogRef;
  subRef$: Subscription;

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService
      .get<any[]>('CatalogoEntregaRecepcionDescripcion')
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;
          this.customSwalService.onClose();
        },
        error: (err) => {
          console.log(err.error);
          this.customSwalService.onClose();
          this.customToastService.onShowError();
        },
      });
  }
  onDelete(data: any) {
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService
      .delete(`CatalogoEntregaRecepcionDescripcion/${data.id}`)
      .subscribe({
        next: () => {
          this.onLoadData();
          this.customSwalService.onClose();
          this.customToastService.onShowSuccess();
        },
        error: (err) => {
          console.log(err.error);
          this.customSwalService.onClose();
          this.customToastService.onShowError();
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
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
