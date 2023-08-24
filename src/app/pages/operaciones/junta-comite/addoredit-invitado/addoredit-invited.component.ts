import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-addoredit-invited',
  templateUrl: './addoredit-invited.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule],
  providers: [MessageService, ToastService],
})
export default class AddOrEditInvitedComponent implements OnInit, OnDestroy {
  public swalService = inject(SwalService);
  public toastService = inject(ToastService);
  public dataService = inject(DataService);
  public config = inject(DynamicDialogConfig);
  public messageService = inject(MessageService);

  subRef$: Subscription;

  @Input()
  customerId: number;
  @Input()
  meetingId: number;
  participantsList: any[] = [];
  listaInvitados: any[] = [];
  invitado: string = '';

  ngOnInit(): void {
    this.onLoadData();
  }

  onSubmit() {
    this.subRef$ = this.dataService
      .get(
        `MeetingInvitado/AgregarParticipantesInvitado/${this.meetingId}/${this.invitado}`
      )
      .subscribe({
        next: () => {
          this.toastService.onShowSuccess();
          this.onLoadData();
          console.log('Seagrego invitado...');
        },
        error: (err) => {
          console.log(err.error);
          this.toastService.onShowError();
        },
      });
  }
  onDelete(idParticipant: number): void {
    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .delete(`MeetingInvitado/${idParticipant}`)
      .subscribe({
        next: () => {
          this.toastService.onShowSuccess();
          this.swalService.onClose();
          this.onLoadData();
        },
        error: (err) => {
          console.log(err.error);
          this.swalService.onClose();
          this.toastService.onShowError();
        },
      });
  }

  onLoadData() {
    this.subRef$ = this.dataService
      .get(`MeetingInvitado/ParticipantesInvitado/${this.meetingId}`)
      .subscribe({
        next: (resp: any) => {
          this.listaInvitados = resp.body;
          this.invitado = '';
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
