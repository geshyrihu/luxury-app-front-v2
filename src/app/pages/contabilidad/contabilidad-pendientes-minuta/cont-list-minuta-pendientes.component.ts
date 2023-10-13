import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import AddoreditMinutaDetalleComponent from 'src/app/pages/operaciones/junta-comite/addoredit-minuta-detalle/addoredit-minuta-detalle.component';
import AddorEditMeetingSeguimientoComponent from 'src/app/pages/operaciones/junta-comite/addoredit-seguimiento/addor-edit-meeting-seguimiento.component';
import { SanitizeHtmlPipe } from 'src/app/pipes/sanitize-html.pipe';
import {
  AuthService,
  CustomSwalService,
  CustomToastService,
  DataService,
} from 'src/app/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import ContMinutaSeguimientosComponent from './cont-minuta-seguimientos.component';

@Component({
  selector: 'app-cont-list-minuta-pendientes',
  templateUrl: './cont-list-minuta-pendientes.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ComponentsModule,
    PrimeNgModule,
    SanitizeHtmlPipe,
    NgbTooltip,
  ],
  providers: [DialogService, MessageService, CustomToastService],
})
export default class ContListMinutaPendientesComponent
  implements OnInit, OnDestroy
{
  private dataService = inject(DataService);
  public authService = inject(AuthService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public customSwalService = inject(CustomSwalService);
  public customToastService = inject(CustomToastService);

  data: any[] = [];

  ref: DynamicDialogRef;
  subRef$: Subscription;
  statusFiltro: number = 4;

  ngOnInit() {
    this.onLoadData();
  }

  onLoadData() {
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService
      .get(
        `ContabilidadMinuta/ListaMinuta/${this.authService.userTokenDto.infoUserAuthDto.applicationUserId}/${this.statusFiltro}`
      )
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
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }

  onModalTodosSeguimientos(idItem: number) {
    this.ref = this.dialogService.open(ContMinutaSeguimientosComponent, {
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
        this.customToastService.onShowSuccess();
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
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
