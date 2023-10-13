import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subscription } from 'rxjs';
import {
  CustomSwalService,
  CustomToastService,
  CustomerIdService,
  DataService,
} from 'src/app/services/common-services';
import DashboardTicketsResumenComponent from '../dashboard-tickets-resumen/dashboard-tickets-resumen.component';

@Component({
  selector: 'app-dashboard-tickets',
  standalone: true,
  imports: [RouterModule, NgbAlertModule, CommonModule],
  templateUrl: './dashboard-tickets.component.html',
  providers: [DialogService, CustomToastService],
})
export default class DashboardTicketsComponent implements OnInit, OnDestroy {
  public dataServide = inject(DataService);
  public customerIdService = inject(CustomerIdService);
  public dialogService = inject(DialogService);
  public customToastService = inject(CustomToastService);
  public customSwalService = inject(CustomSwalService);

  data: any[] = [];
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  ref: DynamicDialogRef;
  subRef$: Subscription;

  ngOnInit(): void {
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }
  onLoadData() {
    this.customSwalService.onLoading();
    this.subRef$ = this.dataServide
      .get(
        'Dashboard/TicketPendientes/' + this.customerIdService.getcustomerId()
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
  onLoadResumen(responsibleAreaId: number) {
    this.ref = this.dialogService.open(DashboardTicketsResumenComponent, {
      data: {
        responsibleAreaId,
      },
      header: 'Pendientes',

      height: '100%',
      width: '100%',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
