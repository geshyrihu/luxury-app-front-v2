import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { BusquedaProveedor } from 'src/app/interfaces/IBusquedaProveedor.interface';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
// import { ViewPdfService } from 'src/app/services/view-pdf.service';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import AddoreditProveedorComponent from '../addoredit-proveedor/addoredit-proveedor.component';
import TarjetaProveedorComponent from '../tarjeta-proveedor/tarjeta-proveedor.component';
@Component({
  selector: 'app-list-provider',
  templateUrl: './list-provider.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, ComponentsModule, PrimeNgModule],
  providers: [DialogService, MessageService, ConfirmationService, ToastService],
})
export default class ListProviderComponent implements OnInit, OnDestroy {
  public swalService = inject(SwalService);
  public toastService = inject(ToastService);
  public dataService = inject(DataService);
  public messageService = inject(MessageService);
  public dialogService = inject(DialogService);
  public authService = inject(AuthService);
  // public viewPdfService = inject(ViewPdfService);

  data: BusquedaProveedor[] = [];
  ref: DynamicDialogRef;
  subRef$: Subscription;

  ngOnInit(): void {
    this.onLoadData();
  }
  validateRole(value: string[]): boolean {
    return this.authService.onValidateRoles(value);
  }
  onLoadData() {
    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .get<BusquedaProveedor[]>(`Proveedor/ListadoProveedores`)
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
    this.swalService.onLoading();
    this.subRef$ = this.dataService.delete(`Providers/${id}`).subscribe({
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

  onAutorizarProvider(providerId: number) {
    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .get<BusquedaProveedor[]>(`Proveedor/Autorizar/${providerId}`)
      .subscribe({
        next: () => {
          this.onLoadData();
          this.swalService.onClose();
        },
        error: (err) => {
          this.toastService.onShowError();
          console.log(err.error);
          this.swalService.onClose();
        },
      });
  }

  showModalCardProveedor(data: any) {
    this.ref = this.dialogService.open(TarjetaProveedorComponent, {
      data: {
        id: data.id,
      },
      header: data.title,
      styleClass: 'modal-lg',
      baseZIndex: 10000,
      closeOnEscape: true,
    });
  }

  showModalAddOrEdit(data: any) {
    this.ref = this.dialogService.open(AddoreditProveedorComponent, {
      data: {
        id: data.id,
      },
      header: data.title,
      height: '100%',
      width: '100%',
      baseZIndex: 10000,
      closeOnEscape: true,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.toastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }

  onActivateProvider(data: any) {
    this.subRef$ = this.dataService
      .put(`Providers/ChangeState/${data.providerId}/${data.state}`, null)
      .subscribe({
        next: (resp: any) => {
          this.onLoadData();
        },
        error: (err) => {
          this.toastService.onShowError();
          console.log(err.error);
        },
      });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
