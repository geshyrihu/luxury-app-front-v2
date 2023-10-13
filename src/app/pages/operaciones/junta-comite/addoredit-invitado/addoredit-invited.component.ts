import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import {
  CustomSwalService,
  CustomToastService,
  DataService,
} from 'src/app/services/common-services';

@Component({
  selector: 'app-addoredit-invited',
  templateUrl: './addoredit-invited.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule],
  providers: [MessageService, CustomToastService],
})
export default class AddOrEditInvitedComponent implements OnInit, OnDestroy {
  public customSwalService = inject(CustomSwalService);
  public customToastService = inject(CustomToastService);
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
          this.customToastService.onShowSuccess();
          this.onLoadData();
          console.log('Seagrego invitado...');
        },
        error: (err) => {
          console.log(err.error);
          this.customToastService.onShowError();
        },
      });
  }
  onDelete(idParticipant: number): void {
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService
      .delete(`MeetingInvitado/${idParticipant}`)
      .subscribe({
        next: () => {
          this.customToastService.onShowSuccess();
          this.customSwalService.onClose();
          this.onLoadData();
        },
        error: (err) => {
          console.log(err.error);
          this.customSwalService.onClose();
          this.customToastService.onShowError();
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
          this.customToastService.onShowError();
          console.log(err.error);
        },
      });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
