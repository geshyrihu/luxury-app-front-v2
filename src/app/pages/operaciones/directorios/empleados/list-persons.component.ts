import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { IEmployeeDto } from 'src/app/interfaces/IEmployeeDto.interface';
import {
  CustomSwalService,
  CustomToastService,
  DataService,
} from 'src/app/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import { environment } from 'src/environments/environment';
import AddOrEditEmplopyeeComponent from './addoredit-employee.component';
@Component({
  selector: 'app-list-persons',
  templateUrl: './list-persons.component.html',
  standalone: true,
  imports: [CommonModule, ComponentsModule, PrimeNgModule],
  providers: [
    DialogService,
    MessageService,
    ConfirmationService,
    CustomToastService,
  ],
})
export default class ListPersonComponent implements OnInit, OnDestroy {
  public dataService = inject(DataService);
  public customSwalService = inject(CustomSwalService);
  public customToastService = inject(CustomToastService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);

  data: IEmployeeDto[] = [];
  url = environment.base_urlImg + 'Administration/accounts/';
  ref: DynamicDialogRef;
  subRef$: Subscription;

  activo: boolean = true;

  onSelectActive(active: boolean): any {
    this.activo = active;
    this.onLoadData();
  }

  ngOnInit(): void {
    this.onLoadData();
  }
  onLoadData() {
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService
      .get<any[]>(`Person/General/${this.activo}`)
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

  onDelete(data: any) {
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService.delete(`Person/${data.id}`).subscribe({
      next: () => {
        this.customToastService.onShowSuccess();
        this.customSwalService.onClose();
        // this.onLoadData();
        // Elimina el elemento del arreglo de datos local
        this.data = this.data.filter((item) => item.id !== data.id);
      },
      error: (err) => {
        this.customToastService.onShowError();
        this.customSwalService.onClose();
        console.log(err.error);
      },
    });
  }
  showModalAddOrEdit(data: any) {
    this.ref = this.dialogService.open(AddOrEditEmplopyeeComponent, {
      data: {
        id: data.id,
      },
      header: data.title,
      styleClass: 'modal-lg',
      baseZIndex: 10000,
      closeOnEscape: true,
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
