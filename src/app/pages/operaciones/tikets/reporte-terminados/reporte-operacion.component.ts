import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Observable, Subscription } from 'rxjs';
import { IFilterTicket } from 'src/app/interfaces/IFilterTicket.interface';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerIdService } from 'src/app/services/customer-id.service';
import { DataService } from 'src/app/services/data.service';
import { ReportService } from 'src/app/services/report.service';
import { SwalService } from 'src/app/services/swal.service';
import { TicketFilterService } from 'src/app/services/ticket-filter.service';
import { ToastService } from 'src/app/services/toast.service';
import ComponentsModule from 'src/app/shared/components.module';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-operation-report',
  templateUrl: './reporte-operacion.component.html',
  standalone: true,
  imports: [RouterModule, ComponentsModule, CommonModule],
  providers: [ToastService, MessageService],
})
export default class ReporteOperacionComponent implements OnInit, OnDestroy {
  public swalService = inject(SwalService);
  public toastService = inject(ToastService);
  public authService = inject(AuthService);
  public reportService = inject(ReportService);
  public ticketFilterService = inject(TicketFilterService);
  public dataService = inject(DataService);
  public customerIdService = inject(CustomerIdService);
  urlImg = '';
  data: any[] = [];
  customerId: number;
  nameCustomer: string = '';
  logoCustomer: string = '';
  roleMantenimiento: boolean = false;

  fechaInicial = '';
  fechaFinal = '';

  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  subRef$: Subscription;

  ngOnInit(): void {
    this.fechaInicial = this.ticketFilterService.filterTicket.finishedStart;
    this.fechaFinal = this.ticketFilterService.filterTicket.finishedEnd;
    this.onLoadData();
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.customerId$.subscribe((resp) => {
      this.ticketFilterService.setIdCustomer(this.customerIdService.customerId);
      this.onLoadData();
    });
  }
  onLoadData() {
    this.swalService.onLoading();
    this.urlImg = `${environment.base_urlImg}customers/${this.ticketFilterService.filterTicket.customer}/report/`;

    this.subRef$ = this.dataService
      .post<IFilterTicket>(
        'Ticket/GetReportWeekly',
        this.ticketFilterService.filterTicket
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

  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
