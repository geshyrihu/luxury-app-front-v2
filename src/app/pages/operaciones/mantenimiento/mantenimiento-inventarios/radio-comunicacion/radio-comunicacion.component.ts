import { CommonModule } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ImageModule } from 'primeng/image';
import { Observable, Subscription } from 'rxjs';
import { IRadioComunicacionDto } from 'src/app/interfaces/IRadioComunicacionDto.interface';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerIdService } from 'src/app/services/customer-id.service';
import { DataService } from 'src/app/services/data.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import { environment } from 'src/environments/environment';
import AddOrEditRadioComunicacionComponent from './add-or-edit-radio-comunicacion.component';
@Component({
  selector: 'app-radio-comunicacion',
  templateUrl: './radio-comunicacion.component.html',
  standalone: true,
  imports: [ComponentsModule, CommonModule, PrimeNgModule, ImageModule],
  providers: [DialogService, MessageService, ToastService],
})
export default class RadioComunicacionComponent implements OnDestroy {
  public swalService = inject(SwalService);
  public toastService = inject(ToastService);
  public authService = inject(AuthService);
  public dataService = inject(DataService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public customerIdService = inject(CustomerIdService);
  data: IRadioComunicacionDto[] = [];

  ref: DynamicDialogRef;
  subRef$: Subscription;
  urlBaseImg: string = `${environment.base_urlImg}customers/${this.customerIdService.customerId}/radios/`;
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();

  ngOnInit(): void {
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }

  onLoadData() {
    this.swalService.onLoading();

    this.subRef$ = this.dataService
      .get<IRadioComunicacionDto[]>(
        `RadioComunicacion/GetAll/${this.customerIdService.customerId}`
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
      .delete(`RadioComunicacion/${data.id}`)
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
    this.ref = this.dialogService.open(AddOrEditRadioComunicacionComponent, {
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
