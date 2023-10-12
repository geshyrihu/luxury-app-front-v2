import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import ComponentsModule from 'src/app/shared/components.module';
import ServiceOrderAddOrEditComponent from '../../../mantenimiento-ordenes-servicio/addoredit-service-order.component';

@Component({
  selector: 'app-service-history-machinery',
  templateUrl: './service-history-machinery.component.html',
  standalone: true,
  imports: [TableModule, ToastModule, ComponentsModule],
  providers: [ToastService],
})
export default class ServiceHistoryMachineryComponent
  implements OnInit, OnDestroy
{
  private dataService = inject(DataService);
  public config = inject(DynamicDialogConfig);
  private swalService = inject(SwalService);
  private toastService = inject(ToastService);
  public dialogService = inject(DialogService);

  id: number = this.config.data.id;
  subRef$: Subscription;
  data: any[] = [];
  ref: DynamicDialogRef;

  ngOnInit() {
    console.log('this.config.data.id', this.config.data.id);
    this.onLoadData();
  }

  onLoadData() {
    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .get(`Machineries/ServiceHistory/${this.config.data.id}`)
      .subscribe({
        next: (resp: any) => {
          this.swalService.onClose();
          this.data = resp.body;
        },
        error: (err) => {
          this.swalService.onClose();
          this.toastService.onShowError();
          console.log(err.error);
        },
      });
  }

  onEdit(data: any) {
    this.ref = this.dialogService.open(ServiceOrderAddOrEditComponent, {
      data: {
        id: data.id,
        machineryId: data.machineryId,
        providerId: data.providerId,
      },
      header: data.title,
      width: '100%',
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
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
