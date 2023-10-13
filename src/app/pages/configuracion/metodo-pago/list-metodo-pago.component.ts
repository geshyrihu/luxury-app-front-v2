import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import {
  AuthService,
  CustomSwalService,
  CustomToastService,
  DataService,
} from 'src/app/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import AddoreditMetodoPagoComponent from './addoredit-metodo-pago.component';

@Component({
  selector: 'app-list-metodo-pago',
  templateUrl: './list-metodo-pago.component.html',
  standalone: true,
  imports: [ComponentsModule, PrimeNgModule],
  providers: [DialogService, MessageService, CustomToastService],
})
export default class ListMetodoPagoComponent implements OnInit, OnDestroy {
  public customSwalService = inject(CustomSwalService);
  public customToastService = inject(CustomToastService);
  public authService = inject(AuthService);
  private dataService = inject(DataService);
  public messageService = inject(MessageService);
  public dialogService = inject(DialogService);
  data: any[] = [];

  ref: DynamicDialogRef;
  subRef$: Subscription;

  ngOnInit(): void {
    this.onLoadData();
  }
  onLoadData() {
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService.get('MetodoPago').subscribe({
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

  onDelete(dto: any) {
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService.delete(`MetodoPago/${dto.id}`).subscribe({
      next: () => {
        this.customToastService.onShowSuccess();
        this.customSwalService.onClose();
        this.onLoadData();
      },
      error: (err) => {
        this.customToastService.onShowError();
        this.customSwalService.onClose();
        console.log(err.error);
      },
    });
  }

  showModalAddOrEdit(data: any) {
    this.ref = this.dialogService.open(AddoreditMetodoPagoComponent, {
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
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
