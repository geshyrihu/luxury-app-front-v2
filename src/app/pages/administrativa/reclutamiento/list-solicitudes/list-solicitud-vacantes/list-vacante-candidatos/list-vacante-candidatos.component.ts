import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { Subscription } from 'rxjs';
import { PositionRequestAgendaDto } from 'src/app/interfaces/PositionRequestAgendaDto';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import ComponentsModule from 'src/app/shared/components.module';
import { environment } from 'src/environments/environment';
import AddOrEditVacanteCandidatoComponent from './addoredit-vacante-candidato.component';
@Component({
  selector: 'app-list-vacante-candidatos',
  templateUrl: './list-vacante-candidatos.component.html',
  standalone: true,
  imports: [
    ComponentsModule,
    NgbTooltip,
    CommonModule,
    FormsModule,
    TableModule,
    ToastModule,
  ],
  providers: [DialogService, MessageService, ToastService],
})
export default class LisVacanteCandidatosComponent implements OnInit {
  private dataService = inject(DataService);
  public authService = inject(AuthService);
  public messageService = inject(MessageService);
  public swalService = inject(SwalService);
  public toastService = inject(ToastService);
  public activatedRoute = inject(ActivatedRoute);
  public dialogService = inject(DialogService);

  data: PositionRequestAgendaDto;
  positionRequestId: number =
    this.activatedRoute.snapshot.params.positionRequestId;
  customerId: number = 0;
  noCandidates: boolean = true;
  ref: DynamicDialogRef;
  subRef$: Subscription;
  pathPdf: string = `${environment.base_urlImg}Administration/reclutamiento/solicitudes/`;
  submitting: boolean = false;

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .get<PositionRequestAgendaDto>(
        'PositionRequestAgenda/Candidatos/' + this.positionRequestId
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
      .delete(`PositionRequestAgenda/${data.id}`)
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

  onSendEmailConfirm() {
    this.swalService.onLoading();
    let dataSend: number[] = [];
    this.data.candidates.forEach((item) => {
      if (item.sendCandidate == true) {
        dataSend.push(item.id);
      }
    });
    this.dataService
      .post(
        `SolicitudesReclutamiento/SendCandidates/${this.positionRequestId}`,
        dataSend
      )
      .subscribe({
        next: () => {
          this.toastService.onShowSuccess();
          this.onLoadData();
        },
        error: (err) => {
          this.toastService.onShowError();
          console.log(err.error);
          // Habilitar el botón nuevamente al finalizar el envío del formulario
          this.submitting = false;
          this.swalService.onClose();
        },
      });
  }

  onValueCandidates() {
    this.noCandidates = !this.data.candidates.some(
      (item) => item.sendCandidate
    );
  }

  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
