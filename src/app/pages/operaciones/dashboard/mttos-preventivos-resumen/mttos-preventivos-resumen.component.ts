import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { EInventoryCategory } from 'src/app/enums/categoria-inventario.enum';
import { EInventoryCategoryPipe } from 'src/app/pipes/inventoryCategory.pipe';
import { SanitizeHtmlPipe } from 'src/app/pipes/sanitize-html.pipe';
import { CustomerIdService } from 'src/app/services/customer-id.service';
import { DataService } from 'src/app/services/data.service';
import { DateService } from 'src/app/services/date.service';
import { PeriodoMonthService } from 'src/app/services/periodo-month.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
@Component({
  selector: 'app-mttos-preventivos-resumen',
  templateUrl: './mttos-preventivos-resumen.component.html',
  standalone: true,
  imports: [PrimeNgModule, EInventoryCategoryPipe, SanitizeHtmlPipe],
  providers: [DialogService, MessageService, ToastService],
})
export default class MantenimientosPreventivosResumenComponent
  implements OnInit, OnDestroy
{
  public config = inject(DynamicDialogConfig);
  public customerIdService = inject(CustomerIdService);
  public messageService = inject(MessageService);
  public periodoMonthService = inject(PeriodoMonthService);
  public dataService = inject(DataService);
  public dateService = inject(DateService);
  public dialogService = inject(DialogService);
  public swalService = inject(SwalService);
  public toastService = inject(ToastService);

  data: any[] = [];
  ref: DynamicDialogRef;
  subRef$: Subscription;
  responsable: EInventoryCategory;
  estatus: number;

  ngOnInit(): void {
    this.estatus = this.config.data.estatus;
    this.onLoadData(
      this.dateService.getDateFormat(this.periodoMonthService.getPeriodoInicio),
      this.dateService.getDateFormat(this.periodoMonthService.getPeriodoFin),
      this.estatus
    );
  }
  onLoadData(fechaInicial: string, fechaFinal: string, status?: any) {
    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .get(
        `Dashboard/DashboardOrdenServicio/${this.customerIdService.getcustomerId()}/${fechaInicial}/${fechaFinal}/${status}`
      )
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;
          this.swalService.onClose();
        },
        error: (err) => {
          console.log(err.error);
          this.swalService.onClose();
        },
      });
  }

  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
