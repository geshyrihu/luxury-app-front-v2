import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { Subscription } from 'rxjs';
import { EMonthPipe } from 'src/app/pipes/month.pipe';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import ComponentsModule from 'src/app/shared/components.module';
import AddOrEditCalendarioMaestroComponent from './add-or-edit-calendario-maestro.component';
import ModalDatosServicioComponent from './modal-datos-servicio/modal-datos-servicio.component';

@Component({
  selector: 'app-calendario-maestro',
  templateUrl: './calendario-maestro.component.html',
  standalone: true,
  imports: [
    NgbAlertModule,
    CommonModule,
    ComponentsModule,
    ToastModule,
    EMonthPipe,
  ],
  providers: [DialogService, MessageService, ToastService],
})
export default class CalendarioMaestroComponent implements OnInit, OnDestroy {
  public swalService = inject(SwalService);
  public toastService = inject(ToastService);
  private dataService = inject(DataService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public authService = inject(AuthService);
  data: any[] = [];
  ref: DynamicDialogRef;
  subRef$: Subscription;

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.swalService.onLoading();

    this.subRef$ = this.dataService.get('CalendarioMaestro/GetAll').subscribe({
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

  onDatosServicio(data: any) {
    this.ref = this.dialogService.open(ModalDatosServicioComponent, {
      data: {
        servicio: data.descripcionServicio,
        observaciones: data.observaciones,
        proveedores: data.proveedores,
      },
      header: 'Información de servicio',
      styleClass: 'modal-lg',
      baseZIndex: 10000,
      closeOnEscape: true,
    });
  }
  onDelete(data: any): any {
    this.subRef$ = this.dataService
      .delete(`CalendarioMaestro/${data.id}`)
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

  onModalAddOrEdit(id: number, mes: number) {
    this.ref = this.dialogService.open(AddOrEditCalendarioMaestroComponent, {
      data: {
        id,
        mes,
      },
      header: 'Calendario Maestro',
      height: '100%',
      width: '100%',
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
