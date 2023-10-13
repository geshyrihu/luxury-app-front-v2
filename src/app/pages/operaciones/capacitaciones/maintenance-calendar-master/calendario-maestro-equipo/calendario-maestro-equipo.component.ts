import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import {
  CustomSwalService,
  CustomToastService,
  DataService,
} from 'src/app/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import AddOrEditCalendarioMaestroEquipoComponent from './add-or-edit-calendario-maestro-equipo.component';

@Component({
  selector: 'app-calendario-maestro-equipo',
  templateUrl: './calendario-maestro-equipo.component.html',
  standalone: true,
  imports: [ComponentsModule, PrimeNgModule],
  providers: [DialogService, MessageService, CustomToastService],
})
export default class CalendarioMaestroEquipoComponent
  implements OnInit, OnDestroy
{
  public customSwalService = inject(CustomSwalService);
  public customToastService = inject(CustomToastService);
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
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService.get('CalendarioMaestroEquipo').subscribe({
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
  onDelete(data: any) {
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService
      .delete(`CalendarioMaestroEquipo/${data.id}`)
      .subscribe({
        next: () => {
          this.customToastService.onShowSuccess();
          this.customSwalService.onClose();
          this.onLoadData();
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
          this.customSwalService.onClose();
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
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
