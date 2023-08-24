import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { Subscription } from 'rxjs';
import { SanitizeHtmlPipe } from 'src/app/pipes/sanitize-html.pipe';
import { ETypeMeetingPipe } from 'src/app/pipes/typeMeeting.pipe';
import { CustomerIdService } from 'src/app/services/customer-id.service';
import { DataService } from 'src/app/services/data.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import ComponentsModule from 'src/app/shared/components.module';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-report-meeting',
  templateUrl: './report-meeting.component.html',
  standalone: true,
  imports: [
    ComponentsModule,
    CommonModule,
    TableModule,
    SanitizeHtmlPipe,
    ETypeMeetingPipe,
  ],
  providers: [ToastService, MessageService],
})
export default class ReportMeetingComponent implements OnInit, OnDestroy {
  public dataService = inject(DataService);
  public rutaActiva = inject(ActivatedRoute);
  public customerIdService = inject(CustomerIdService);
  public swalService = inject(SwalService);
  public toastService = inject(ToastService);

  data: any = [];
  detalles: any = [];
  subRef$: Subscription;
  customer: number = 0;
  meetingId: number = 0;
  logoCustomer = '';
  nameCustomer = '';
  imgBase = environment.base_urlImg + 'Administration/customer/';
  ngOnInit(): void {
    this.data = [];
    this.swalService.onLoading();

    this.customer = this.rutaActiva.snapshot.params.customer;
    this.meetingId = this.rutaActiva.snapshot.params.id;

    this.subRef$ = this.dataService
      .get(`Meetings/MeetingReportPdf/${this.meetingId}`)
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;

          this.detalles = resp.body.asuntos;
          this.onLoadCustomer();
          this.swalService.onClose();
        },
        error: (err) => {
          this.toastService.onShowError();
          console.log(err.error);
        },
      });
  }

  onLoadCustomer() {
    this.subRef$ = this.dataService
      .get(`Customers/GetReport/${this.customer}`)
      .subscribe((resp: any) => {
        this.nameCustomer = resp.body.nameCustomer;
        this.logoCustomer = `${environment.base_urlImg}Administration/customer/${resp.body.photoPath}`;
      });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
