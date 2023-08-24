import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { Subscription } from 'rxjs';
import AddoreditMinutaDetalleComponent from 'src/app/pages/operaciones/junta-comite/addoredit-minuta-detalle/addoredit-minuta-detalle.component';
import AddorEditMeetingSeguimientoComponent from 'src/app/pages/operaciones/junta-comite/addoredit-seguimiento/addor-edit-meeting-seguimiento.component';
import { SanitizeHtmlPipe } from 'src/app/pipes/sanitize-html.pipe';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import ComponentsModule from 'src/app/shared/components.module';
import ModalSeguimientosComponent from './modal-seguimientos/modal-seguimientos.component';

@Component({
  selector: 'app-contabilidad-pendientes-minuta',
  templateUrl: './contabilidad-pendientes-minuta.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ComponentsModule,
    TableModule,
    ToastModule,
    SanitizeHtmlPipe,
    NgbTooltip,
  ],
  providers: [DialogService, MessageService, ToastService],
})
export default class ContabilidadPendientesMinutaComponent
  implements OnInit, OnDestroy
{
  private dataService = inject(DataService);
  public authService = inject(AuthService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public swalService = inject(SwalService);
  public toastService = inject(ToastService);

  data: any[] = [];

  ref: DynamicDialogRef;
  subRef$: Subscription;
  statusFiltro: number = 4;

  ngOnInit() {
    this.onLoadData();
  }

  onLoadData() {
    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .get(
        `ContabilidadMinuta/ListaMinuta/${this.authService.userTokenDto.infoUserAuthDto.applicationUserId}/${this.statusFiltro}`
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

  onFiltrarData(valorFiltro: number) {
    this.statusFiltro = valorFiltro;
    this.onLoadData();
  }

  onModalAddOrEditSeguimiento(
    meetingDetailsId: any,
    idMeetingSeguimiento: any
  ) {
    this.ref = this.dialogService.open(AddorEditMeetingSeguimientoComponent, {
      data: {
        meetingDetailsId,
        idMeetingSeguimiento,
      },
      header: 'Seguimiento',
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

  onModalTodosSeguimientos(idItem: number) {
    this.ref = this.dialogService.open(ModalSeguimientosComponent, {
      data: {
        idItem,
      },
      header: 'Seguimientos',
      width: '80%',
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

  onModalAddOrEditMinutaDetalle(data: any) {
    this.ref = this.dialogService.open(AddoreditMinutaDetalleComponent, {
      data: {
        id: data.id,
        areaResponsable: data.areaResponsable,
      },
      header: data.header,
      styleClass: 'modal-md',
      closeOnEscape: true,
      autoZIndex: true,
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
