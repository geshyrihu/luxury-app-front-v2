import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { EditorModule } from 'primeng/editor';
import { Subscription } from 'rxjs';
import AddoreditMaintenancePreventiveComponent from 'src/app/pages/operaciones/calendarios/mantenimiento-preventivo/addoredit-maintenance-preventive.component';
import { EMonthPipe } from 'src/app/pipes/month.pipe';
import { ERecurrencePipe } from 'src/app/pipes/recurrence.pipe';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { ToastService } from 'src/app/services/toast.service';
import ComponentsModule from 'src/app/shared/components.module';
//TODO: VALIDAR SU AUN ESTA ACTIVO ESTE MODULO
@Component({
  selector: 'app-order-service',
  templateUrl: './order-service.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    EditorModule,
    ERecurrencePipe,
    EMonthPipe,
  ],
  providers: [MessageService, ToastService],
})
export default class OrderServiceComponent implements OnInit, OnDestroy {
  public toastService = inject(ToastService);
  public dataService = inject(DataService);
  public messageService = inject(MessageService);
  public dialogService = inject(DialogService);
  public authService = inject(AuthService);
  public config = inject(DynamicDialogConfig);
  public ref = inject(DynamicDialogRef);
  public confirmationService = inject(ConfirmationService);

  subRef$: Subscription;
  maintenanceCalendars: any[] = [];
  idMachinery: number = 0;

  ngOnInit(): void {
    this.idMachinery = this.config.data.id;

    if (this.idMachinery !== 0) {
      this.onLoadData();
    }
  }

  onLoadData() {
    this.subRef$ = this.dataService
      .get(`MaintenanceCalendars/ListService/${this.idMachinery}`)
      .subscribe({
        next: (resp: any) => {
          this.maintenanceCalendars = resp.body;
        },
        error: (err) => {
          this.toastService.onShowError();
          console.log(err.error);
        },
      });
  }

  confirm(event: Event, id: number) {
    this.confirmationService.confirm({
      target: event.target,
      message: '¿Desea Eliminar este registro?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        //confirm action
        this.subRef$ = this.dataService
          .delete(`MaintenanceCalendars/${id}`)
          .subscribe({
            next: () => {
              this.toastService.onShowSuccess();
              this.onLoadData();
            },
            error: (err) => {
              this.toastService.onShowError();
              console.log(err.error);
            },
          });
      },
      reject: () => {
        //reject action
      },
    });
  }
  showModalMaintenanceCalendar(data: any) {
    this.ref = this.dialogService.open(
      AddoreditMaintenancePreventiveComponent,
      {
        data: {
          id: data.id,
          task: data.task,
          idMachinery: data.idMachinery,
        },
        header: data.header,
        styleClass: 'modal-mdInventory',
        closeOnEscape: true,
      }
    );
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.toastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }
  deleteMaintenanceOrder(data: any) {
    this.subRef$ = this.dataService
      .delete(`MaintenanceCalendars/${data.id}`)
      .subscribe({
        next: () => {
          this.toastService.onShowSuccess();
          this.onLoadData();
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
