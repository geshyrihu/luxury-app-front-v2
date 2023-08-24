import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  NgbAlert,
  NgbRatingModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import { ViewPdfService } from 'src/app/services/view-pdf.service';
import ComponentsModule from 'src/app/shared/components.module';
import { environment } from 'src/environments/environment';
import AddoreditProveedorComponent from '../addoredit-proveedor/addoredit-proveedor.component';
import CalificacionProveedorComponent from '../calificacion-proveedor/calificacion-proveedor.component';
import TarjetaProveedorComponent from '../tarjeta-proveedor/tarjeta-proveedor.component';

@Component({
  selector: 'app-buscador-proveedor',
  templateUrl: './buscador-proveedor.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ComponentsModule,
    NgbRatingModule,
    NgbTooltipModule,
    NgbAlert,
    ToastModule,
  ],
  providers: [DialogService, MessageService, ConfirmationService, ToastService],
})
export default class BuscadorProvedorComponent implements OnInit, OnDestroy {
  public swalService = inject(SwalService);
  public toastService = inject(ToastService);
  public dataService = inject(DataService);
  public messageService = inject(MessageService);
  public dialogService = inject(DialogService);
  public authService = inject(AuthService);
  public viewPdfService = inject(ViewPdfService);
  incluirInactivos: boolean = false;
  url_img = `${environment.base_urlImg}providers/`;
  subRef$: Subscription;
  ref: DynamicDialogRef;

  filtro: string = '';
  resultados: any[] = [];
  loading: boolean = false;
  validateRole(value: string[]): boolean {
    return this.authService.onValidateRoles(value);
  }
  ngOnInit(): void {}
  onSelectForState() {
    this.incluirInactivos = !this.incluirInactivos;
    this.buscar();
  }
  onDelete(data: any) {
    this.swalService.onLoading();
    this.subRef$ = this.dataService.delete(`Providers/${data.id}`).subscribe({
      next: () => {
        this.toastService.onShowSuccess();
        this.swalService.onClose();
        this.buscar();
      },
      error: (err) => {
        this.toastService.onShowError();
        this.swalService.onClose();
        console.log(err.error);
      },
    });
  }

  showModalCardProveedor(data: any) {
    this.ref = this.dialogService.open(TarjetaProveedorComponent, {
      data: {
        id: data.providerId,
      },
      header: data.title,
      styleClass: 'modal-lg',
      baseZIndex: 10000,
      closeOnEscape: true,
    });
  }
  showModalCalificarProveedor(data: any) {
    this.ref = this.dialogService.open(CalificacionProveedorComponent, {
      data: {
        providerId: data.providerId,
        userId: this.authService.userTokenDto.infoUserAuthDto.applicationUserId,
      },
      header: 'Calificar a ' + data.nameProvider,
      styleClass: 'modal-sm',
      baseZIndex: 10000,
      closeOnEscape: true,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.toastService.onShowSuccess();
        this.buscar();
      }
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
        this.buscar();
      }
    });
  }

  calificacionPromedio(data: any, valor: string): number {
    let suma: number = 0;
    data.forEach((element) => {
      suma += element[valor];
    });
    const restult = suma / data.length;

    return restult;
  }
  onActivateProvider(data: any) {
    this.subRef$ = this.dataService
      .put(`Providers/ChangeState/${data.providerId}/${data.state}`, null)
      .subscribe({
        next: (resp: any) => {
          this.buscar();
          // this.onLoadData(this.stateProvider);
        },
        error: (err) => {
          this.toastService.onShowError();
          console.log(err.error);
        },
      });
  }

  buscar() {
    if (this.filtro === '') return;
    this.resultados = [];
    this.loading = true;

    this.subRef$ = this.dataService
      .get(
        'proveedor/buscarProveedor/' + this.incluirInactivos + '/' + this.filtro
      )
      .subscribe({
        next: (resp: any) => {
          this.resultados = resp.body;
          this.loading = false;
        },
        error: (err) => {
          this.toastService.onShowError();
          console.log(err.error);
        },
      });
  }

  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
