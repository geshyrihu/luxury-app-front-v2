import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { Subscription } from 'rxjs';
import AddorEditMeetingSeguimientoComponent from 'src/app/pages/operaciones/junta-comite/addoredit-seguimiento/addor-edit-meeting-seguimiento.component';
import {
  CustomSwalService,
  CustomToastService,
  DataService,
} from 'src/app/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';

@Component({
  selector: 'app-cont-minuta-seguimientos',
  templateUrl: './cont-minuta-seguimientos.component.html',
  standalone: true,
  imports: [ComponentsModule, CommonModule, TableModule],
  providers: [DialogService, MessageService, CustomToastService],
})
export default class ContMinutaSeguimientosComponent
  implements OnInit, OnDestroy
{
  public config = inject(DynamicDialogConfig);
  public dataService = inject(DataService);
  public dialogService = inject(DialogService);
  public customToastService = inject(CustomToastService);
  public customSwalService = inject(CustomSwalService);

  data: any[] = [];
  id = this.config.data.idItem;
  ref: DynamicDialogRef;
  subRef$: Subscription;

  ngOnInit(): void {
    this.onLoadData();
  }
  onLoadData() {
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService
      .get(`ContabilidadMinuta/ListaSeguimientos/${this.id}`)
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

  onDeleteSeguimiento(id: number) {
    this.subRef$ = this.dataService
      .delete(`MeetingDertailsSeguimiento/${id}`)
      .subscribe({
        next: () => {
          this.customToastService.onShowSuccess();
          this.onLoadData();
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
        },
      });
  }
  onModalAddOrEditSeguimiento(idMeetingSeguimiento: any) {
    this.ref = this.dialogService.open(AddorEditMeetingSeguimientoComponent, {
      data: {
        idMeetingSeguimiento,
      },
      header: 'Seguimiento',
      styleClass: 'modal-md',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
