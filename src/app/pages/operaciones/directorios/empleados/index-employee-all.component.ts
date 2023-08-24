import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { Subscription } from 'rxjs';
import { IEmployeeDto } from 'src/app/interfaces/IEmployeeDto.interface';
import { DataService } from 'src/app/services/data.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import ComponentsModule from 'src/app/shared/components.module';
import { environment } from 'src/environments/environment';
import AddOrEditEmplopyeeComponent from './addoredit-employee.component';
@Component({
  selector: 'app-index',
  templateUrl: './index-employee-all.component.html',
  standalone: true,
  imports: [CommonModule, ComponentsModule, TableModule, ToastModule],
  providers: [DialogService, MessageService, ConfirmationService, ToastService],
})
export default class IndexEmployeeAllComponent implements OnInit, OnDestroy {
  public dataService = inject(DataService);
  public swalService = inject(SwalService);
  public toastService = inject(ToastService);
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
    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .get<any[]>(`Employees/General/${this.activo}`)
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

  onDelete(data: any) {
    this.swalService.onLoading();
    this.subRef$ = this.dataService.delete(`Employees/${data.id}`).subscribe({
      next: () => {
        this.toastService.onShowSuccess();
        this.swalService.onClose();
        this.onLoadData();
      },
      error: (err) => {
        this.toastService.onShowError();
        this.swalService.onClose();
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
        this.toastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
