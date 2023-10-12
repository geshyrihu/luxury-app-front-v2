import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import { environment } from 'src/environments/environment';
import AddOrEditProductosComponent from './addoredit-productos.component';

@Component({
  selector: 'app-index-productos',
  templateUrl: './index-productos.component.html',
  standalone: true,
  imports: [ComponentsModule, CommonModule, PrimeNgModule],
  providers: [DialogService, MessageService, ToastService],
})
export default class IndexProductosComponent implements OnInit, OnDestroy {
  public swalService = inject(SwalService);
  public toastService = inject(ToastService);
  public authService = inject(AuthService);
  private dataService = inject(DataService);
  public messageService = inject(MessageService);
  public dialogService = inject(DialogService);
  urlBaseImg = `${environment.base_urlImg}Administration/products/`;
  urlBaseImgUser = `${environment.base_urlImg}Administration/accounts/`;
  data: any[] = [];

  ref: DynamicDialogRef;
  subRef$: Subscription;

  account_id: string = '';
  constructor() {
    this.account_id =
      this.authService.userTokenDto.infoUserAuthDto.applicationUserId;
  }

  ngOnInit(): void {
    //
    this.onLoadData();
  }

  onLoadData() {
    this.swalService.onLoading();
    this.subRef$ = this.dataService.get(`Productos`).subscribe({
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

  // ... Eliminar registro
  onDelete(data: any) {
    this.swalService.onLoading();
    this.subRef$ = this.dataService.delete(`Productos/${data.id}`).subscribe({
      next: () => {
        this.toastService.onShowSuccess();
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

  // ... Llamada al Modal agregar o editar
  showModalAddOrEdit(data: any) {
    this.ref = this.dialogService.open(AddOrEditProductosComponent, {
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
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
