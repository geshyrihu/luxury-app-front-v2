import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subscription } from 'rxjs';
import { IComiteVigilanciaDto } from 'src/app/interfaces/IComiteVigilanciaDto.interface';
import { EPosicionComitePipe } from 'src/app/pipes/posicionComite.pipe';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerIdService } from 'src/app/services/customer-id.service';
import { DataService } from 'src/app/services/data.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import AddOrEditComiteVigilanciaComponent from './addoredit-comite-vigilancia.component';

@Component({
  selector: 'app-index-comite-vigilancia',
  templateUrl: './index-comite-vigilancia.component.html',
  standalone: true,
  imports: [ComponentsModule, PrimeNgModule, EPosicionComitePipe],
  providers: [DialogService, MessageService, ToastService],
})
export default class IndexComiteVigilanciaComponent
  implements OnInit, OnDestroy
{
  public authService = inject(AuthService);
  public customerIdService = inject(CustomerIdService);
  public dataService = inject(DataService);
  public messageService = inject(MessageService);
  public swalService = inject(SwalService);
  public toastService = inject(ToastService);
  public dialogService = inject(DialogService);
  data: IComiteVigilanciaDto[] = [];

  ref: DynamicDialogRef;
  subRef$: Subscription;
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();

  ngOnInit(): void {
    this.onLoadData();
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }

  onLoadData() {
    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .get<IComiteVigilanciaDto[]>(
        'ComiteVigilancia/GetAll/' + this.customerIdService.getcustomerId()
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
  onDelete(data: any) {
    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .delete(`ComiteVigilancia/${data.id}`)
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
    this.ref = this.dialogService.open(AddOrEditComiteVigilanciaComponent, {
      data: {
        id: data.id,
      },
      header: data.title,
      styleClass: 'modal-md',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: any) => {
      if (resp !== undefined) {
        this.onLoadData();
        this.toastService.onShowSuccess();
      }
    });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
