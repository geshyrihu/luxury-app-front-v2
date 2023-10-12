import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import AddOrEditCalendarioMaestroEquipoComponent from './add-or-edit-calendario-maestro-equipo.component';

@Component({
  selector: 'app-calendario-maestro-equipo',
  templateUrl: './calendario-maestro-equipo.component.html',
  standalone: true,
  imports: [ComponentsModule, PrimeNgModule],
  providers: [DialogService, MessageService, ToastService],
})
export default class CalendarioMaestroEquipoComponent
  implements OnInit, OnDestroy
{
  public swalService = inject(SwalService);
  public toastService = inject(ToastService);
  public dataService = inject(DataService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  data: any[] = [];
  ref: DynamicDialogRef;
  subRef$: Subscription;
  // is;

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.swalService.onLoading();
    this.subRef$ = this.dataService.get('CalendarioMaestroEquipo').subscribe({
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
  onDelete(data: any) {
    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .delete(`CalendarioMaestroEquipo/${data.id}`)
      .subscribe({
        next: () => {
          this.toastService.onShowSuccess();
          this.swalService.onClose();
          this.onLoadData();
        },
        error: (err) => {
          this.toastService.onShowError();
          console.log(err.error);
          this.swalService.onClose();
        },
      });
  }

  onModalAddOrEdit(data: any) {
    this.ref = this.dialogService.open(
      AddOrEditCalendarioMaestroEquipoComponent,
      {
        data: {
          id: data.id,
        },
        header: data.title,
        styleClass: 'modal-sm ',
        closeOnEscape: true,
        baseZIndex: 10000,
      }
    );
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.toastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
