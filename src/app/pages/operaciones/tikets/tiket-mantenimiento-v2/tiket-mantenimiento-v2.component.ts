import { CommonModule } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { Observable, Subscription } from 'rxjs';
import { ISelectItemCheckDto } from 'src/app/interfaces/ISelectItemDto.interface';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerIdService } from 'src/app/services/customer-id.service';
import { DataService } from 'src/app/services/data.service';
import { DateService } from 'src/app/services/date.service';
import { ReportService } from 'src/app/services/report.service';
import { SelectItemService } from 'src/app/services/select-item.service';
import { SwalService } from 'src/app/services/swal.service';
import { TicketFilterService } from 'src/app/services/ticket-filter.service';
import { ToastService } from 'src/app/services/toast.service';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-tiket-mantenimiento-v2',
  templateUrl: './tiket-mantenimiento-v2.component.html',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    ComponentsModule,
    FormsModule,
    PrimeNgModule,
    NgbDropdownModule,
    MultiSelectModule,
  ],
  providers: [DialogService, MessageService, ConfirmationService, ToastService],
})
export default class TiketMantenimientoV2Component implements OnInit {
  public authService = inject(AuthService);
  public customerIdService = inject(CustomerIdService);
  public dataService = inject(DataService);
  public dateService = inject(DateService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public ticketFilterService = inject(TicketFilterService);
  public reportService = inject(ReportService);
  public router = inject(Router);
  public swalService = inject(SwalService);
  public toastService = inject(ToastService);
  public selectItemService = inject(SelectItemService);

  base_urlImg = '';
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  data: any[] = [];
  ref: DynamicDialogRef;
  subRef$: Subscription;
  url = `${environment.base_urlImg}Administration/accounts/`;

  cb_responsible_area: ISelectItemCheckDto[] = [];
  cb_status: ISelectItemCheckDto[] = [];

  ngOnInit(): void {
    this.ngOnLoadSelectItem();

    this.customerId$ = this.customerIdService.getCustomerId$();
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }

  private params: HttpParams = new HttpParams(); // Parámetros iniciales
  ngOnInititParams() {
    let params = new HttpParams();
    this.cb_responsible_area.forEach((depto) => {
      params = params.append('departamento', depto.value.toString());
    });
    this.cb_status.forEach((stat) => {
      params = params.append('status', stat.toString());
    });

    return params;
  }

  onLoadData() {
    let departamentoValues: number[] = this.cb_responsible_area
      .filter((item) => item.check === true)
      .map((item) => item.value);

    let statusValues: number[] = [0, 1, 2, 3];

    let params = new HttpParams();
    departamentoValues.forEach((depto) => {
      params = params.append('departamento', depto.toString());
    });
    statusValues.forEach((stat) => {
      params = params.append('status', stat.toString());
    });

    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .get(`TicketV2/${this.customerIdService.customerId}`, params)
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;
          this.swalService.onClose();
        },
        error: (err) => {
          this.toastService.onShowError();
          console.log(err.error);
          this.swalService.onClose();
        },
      });
  }
  ngOnModalFilter() {}

  visible: boolean = false;
  onModalResponsibleArea: boolean = false;

  ngOnLoadSelectItem() {
    this.selectItemService
      .onGetSelectItemCheck('ResponsibleAreaCheck')
      .subscribe((resp) => {
        this.cb_responsible_area = resp;
      });
  }

  ///OPCIONES PARA SELECCIONAR AREA RESPONSABLE
  onSelectResponsibleArea(item) {
    this.onLoadData();
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
