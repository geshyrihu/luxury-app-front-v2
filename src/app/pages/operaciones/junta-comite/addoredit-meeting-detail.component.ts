import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { Subscription } from 'rxjs';
import { EAreaMinutasDetallesPipe } from 'src/app/pipes/area-minuta-detalles.pipe';
import { SanitizeHtmlPipe } from 'src/app/pipes/sanitize-html.pipe';
import { EStatusPipe } from 'src/app/pipes/status.pipe';
import { CustomSwalService } from 'src/app/services/custom-swal.service';
import { CustomToastService } from 'src/app/services/custom-toast.service';
import { DataService } from 'src/app/services/data.service';
import { DateService } from 'src/app/services/date.service';

@Component({
  selector: 'app-addoredit-meeting-detail',
  templateUrl: './addoredit-meeting-detail.component.html',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    EAreaMinutasDetallesPipe,
    SanitizeHtmlPipe,
    EStatusPipe,
  ],
  providers: [DialogService, MessageService, CustomToastService],
})
export default class AddOrEditMeetingDetailComponent
  implements OnInit, OnDestroy
{
  public customSwalService = inject(CustomSwalService);
  public customToastService = inject(CustomToastService);
  public config = inject(DynamicDialogConfig);
  public dataService = inject(DataService);
  public dateService = inject(DateService);
  public messageService = inject(MessageService);
  public dialogService = inject(DialogService);

  subRef$: Subscription;

  status: number = 0;
  meetingId: number = 0;
  data: any[] = [];

  ngOnInit() {
    this.meetingId = this.config.data.id;
    this.status = this.config.data.status;
    this.onLoadData();
  }
  orderData(value: any) {
    this.data.sort();
  }
  convertirFecha(item: any) {
    return this.dateService.getDateFormat(item);
  }
  onLoadData() {
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService
      .get(`MeetingsDetails/DetallesFiltro/${this.meetingId}/${this.status}`)
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

  calculateDetailTotal(name) {
    let total = 0;

    if (this.data) {
      for (let customer of this.data) {
        if (customer.eAreaMinutasDetalles === name) {
          total++;
        }
      }
    }

    return total;
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
