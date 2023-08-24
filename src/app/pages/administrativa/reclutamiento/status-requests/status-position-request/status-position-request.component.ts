import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerIdService } from 'src/app/services/customer-id.service';
import { DataService } from 'src/app/services/data.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import ComponentsModule from 'src/app/shared/components.module';
import CustomInputModule from 'src/app/shared/custom-input-form/custom-input.module';
import { environment } from 'src/environments/environment';
import { StatusSolicitudVacanteService } from '../../../../../services/status-solicitud-vacante.service';
import AddOrEditVacanteComponent from '../../list-solicitudes/list-solicitud-vacantes/addoredit-vacante.component';
import AddOrEditVacanteCandidatoComponent from '../../list-solicitudes/list-solicitud-vacantes/list-vacante-candidatos/addoredit-vacante-candidato.component';
import SolicitudAltaComponent from '../../solicitudes/solicitud-alta/solicitud-alta.component';

@Component({
  selector: 's-status-position-request',
  templateUrl: './status-position-request.component.html',
  standalone: true,
  imports: [
    ComponentsModule,
    TableModule,
    ToastModule,
    FormsModule,
    CommonModule,
    CustomInputModule,
    NgbAlertModule,
  ],
  providers: [DialogService, MessageService, ToastService],
})
export default class statuspositionrequestcomponent
  implements OnInit, OnDestroy
{
  private statusSolicitudVacanteService = inject(StatusSolicitudVacanteService);
  public customerIdService = inject(CustomerIdService);
  public dataService = inject(DataService);
  public dialogService = inject(DialogService);
  public swalService = inject(SwalService);
  public toastService = inject(ToastService);
  public router = inject(Router);
  public authService = inject(AuthService);

  positionRequestId = this.statusSolicitudVacanteService.getPositionRequestId();
  ref: DynamicDialogRef;
  subRef$: Subscription;
  data: any;
  noCandidates: boolean = true;
  submitting: boolean = false;
  pathPdf: string = `${environment.base_urlImg}Administration/reclutamiento/solicitudes/`;
  applicationUserId: string =
    this.authService.infoUserAuthDto.applicationUserId;
  ngOnInit() {
    if (this.positionRequestId === null) {
      this.router.navigateByUrl('/reclutamiento/plantilla-interna');
    }
    this.onLoadData();
  }

  onLoadData() {
    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .get('RequestPositionCandidate/Candidatos/' + this.positionRequestId)
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

  onValueCandidates() {
    this.noCandidates = !this.data.candidates.some(
      (item: any) => item.sendCandidate
    );
  }

  onModalSolicitudALta(requestPositionCandidateId: number) {
    this.ref = this.dialogService.open(SolicitudAltaComponent, {
      data: {
        requestPositionCandidateId: requestPositionCandidateId,
      },
      header: 'Solicitud de alta',
      width: '100%',
      height: '100%',
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

  onModalAddOrEditPositionRequest(data: any) {
    this.ref = this.dialogService.open(AddOrEditVacanteComponent, {
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
  onDeletePositionRequest(id: number) {
    this.swalService.onLoading();
    this.subRef$ = this.dataService.delete(`RequestPosition/${id}`).subscribe({
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
  onSendCandidatesForEmail() {
    let dataSend: number[] = [];
    this.data.candidates.forEach((item) => {
      if (item.sendCandidate == true) {
        dataSend.push(item.id);
      }
    });
    // Deshabilitar el botón al iniciar el envío del formulario
    this.swalService.onLoading();
    this.submitting = true;
    this.dataService
      .post(
        `SolicitudesReclutamiento/SendCandidates/${this.positionRequestId}`,
        dataSend
      )
      .subscribe({
        next: () => {
          this.onLoadData();
          this.swalService.onClose();
          this.toastService.onShowSuccess();
        },
        error: (err) => {
          console.log(err.error);
          this.toastService.onShowError();
          // Habilitar el botón nuevamente al finalizar el envío del formulario
          this.swalService.onClose();
          this.submitting = false;
        },
      });
  }

  onModalAddOrEdit(data: any) {
    this.ref = this.dialogService.open(AddOrEditVacanteCandidatoComponent, {
      data: {
        id: data.id,
        positionRequestId: this.positionRequestId,
      },
      header: data.title,
      styleClass: 'modal-md ',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      this.onLoadData();
      if (resp) {
        this.onLoadData();
        this.toastService.onShowSuccess();
      }
    });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
