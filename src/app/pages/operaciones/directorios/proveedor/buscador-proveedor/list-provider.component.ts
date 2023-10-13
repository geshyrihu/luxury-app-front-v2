import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { BusquedaProveedor } from 'src/app/interfaces/IBusquedaProveedor.interface';
import {
  AuthService,
  CustomSwalService,
  CustomToastService,
  DataService,
} from 'src/app/services/common-services';
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
  providers: [
    DialogService,
    MessageService,
    ConfirmationService,
    CustomToastService,
  ],
})
export default class ListProviderComponent implements OnInit, OnDestroy {
  public customSwalService = inject(CustomSwalService);
  public customToastService = inject(CustomToastService);
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
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService
      .get<BusquedaProveedor[]>(`Proveedor/ListadoProveedores`)
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

  onDelete(id: number) {
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService.delete(`Providers/${id}`).subscribe({
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

  onAutorizarProvider(providerId: number) {
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService
      .get<BusquedaProveedor[]>(`Proveedor/Autorizar/${providerId}`)
      .subscribe({
        next: () => {
          this.onLoadData();
          this.customSwalService.onClose();
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
          this.customSwalService.onClose();
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
        this.customToastService.onShowSuccess();
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
          this.customToastService.onShowError();
          console.log(err.error);
        },
      });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
