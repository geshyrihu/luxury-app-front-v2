import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { Observable, Subscription } from 'rxjs';
import { IWorkPositionDto } from 'src/app/interfaces/IEmpresaOrganigramaDto.interface';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerIdService } from 'src/app/services/customer-id.service';
import { DataService } from 'src/app/services/data.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import ComponentsModule from 'src/app/shared/components.module';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import AddoreditPlantillaComponent from './addoredit-plantilla.component';

@Component({
  selector: 'app-list-plantilla-general',
  templateUrl: './list-plantilla-general.component.html',
  standalone: true,
  imports: [TableModule, ToastModule, ComponentsModule, CommonModule],
  providers: [ConfirmationService, DialogService, MessageService, ToastService],
})
export default class ListPlantillaGeneralComponent
  implements OnInit, OnDestroy
{
  public swalService = inject(SwalService);
  public toastService = inject(ToastService);
  public authService = inject(AuthService);
  public dataService = inject(DataService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public customerIdService = inject(CustomerIdService);
  public confirmationService = inject(ConfirmationService);

  data: IWorkPositionDto[] = [];

  ref: DynamicDialogRef;
  subRef$: Subscription;
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  pahtBaseImg = environment.base_urlImg + 'Administration/accounts/';

  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }

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
      .get<IWorkPositionDto[]>('WorkPosition/GetAllGeneral')
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
  onDelete(id: number) {
    Swal.fire({
      title: '¿Confirmar?',
      text: 'Se va a eliminar el registro',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        this.swalService.onLoading();
        this.subRef$ = this.dataService.delete(`WorkPosition/${id}`).subscribe({
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
    });
  }

  onModalAddOrEdit(data: any) {
    this.ref = this.dialogService.open(AddoreditPlantillaComponent, {
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
}
