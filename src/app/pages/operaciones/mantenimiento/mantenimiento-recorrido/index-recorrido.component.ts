import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ImageModule } from 'primeng/image';
import { ToastModule } from 'primeng/toast';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerIdService } from 'src/app/services/customer-id.service';
import { DataService } from 'src/app/services/data.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import ComponentsModule from 'src/app/shared/components.module';
import { environment } from 'src/environments/environment';
import AddBitacoraComponent from '../mantenimiento-bitacoras/recorridos/add-bitacora.component';
import BitacoraIndividualComponent from '../mantenimiento-bitacoras/recorridos/bitacora-individual.component';
import RecorridoTaskAddOrEditComponent from './addoredit-recorrido-task.component';
import RecorridoAddOrEditComponent from './addoreedit-recorrido.component';

@Component({
  selector: 'app-index-recorrido',
  templateUrl: './index-recorrido.component.html',
  standalone: true,
  imports: [
    FormsModule,
    ComponentsModule,
    CommonModule,
    ToastModule,
    ImageModule,
    RouterModule,
    NgbDropdownModule,
  ],
  providers: [ConfirmationService, DialogService, MessageService, ToastService],
})
export default class IndexRecorridoComponent implements OnInit, OnDestroy {
  public swalService = inject(SwalService);
  public toastService = inject(ToastService);
  public authService = inject(AuthService);
  public confirmationService = inject(ConfirmationService);
  public customerIdService = inject(CustomerIdService);
  public dataService = inject(DataService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);

  pathImg = environment.base_urlImg;
  data: any[] = [];

  subRef$: Subscription;
  ref: DynamicDialogRef;
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  value: number = 0;
  filterValue: string = ' ';

  ngOnInit(): void {
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.onLoadData(this.value);
    this.customerId$.subscribe((resp) => {
      this.onLoadData(this.value);
    });
  }

  filterGlobal() {
    if (this.filterValue !== ' ' || this.filterValue !== null) {
      this.onLoadData(this.value);
    } else {
      this.onLoadData(this.value);
    }
  }
  onChange(value: number) {
    this.data = [];
    this.value = value;
    this.onLoadData(this.value);
  }

  onLoadData(value: number) {
    if (this.filterValue === ' ') {
      this.swalService.onLoading();
    }

    this.subRef$ = this.dataService
      .get(
        `Routes/GetAll/${this.customerIdService.getcustomerId()}/${value}/${
          this.filterValue
        }`
      )
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

  onDelete(id: number) {
    this.swalService.onLoading();
    this.subRef$ = this.dataService.delete(`Routes/${id}`).subscribe({
      next: () => {
        this.toastService.onShowSuccess();
        this.swalService.onClose();
        this.onLoadData(this.value);
      },
      error: (err) => {
        this.toastService.onShowError();
        this.swalService.onClose();
        console.log(err.error);
      },
    });
  }

  onDeleteTask(taskId: number) {
    this.swalService.onLoading();
    this.subRef$ = this.dataService.delete(`RouteTask/${taskId}`).subscribe({
      next: () => {
        this.toastService.onShowSuccess();
        this.swalService.onClose();
        this.onLoadData(this.value);
      },
      error: (err) => {
        this.toastService.onShowError();
        this.swalService.onClose();
        console.log(err.error);
      },
    });
  }

  onModalAddOrEdit(data: any) {
    this.ref = this.dialogService.open(RecorridoAddOrEditComponent, {
      data: {
        id: data.id,
      },
      header: data.title,
      styleClass: 'modal-md',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.toastService.onShowSuccess();
        this.onLoadData(this.value);
      }
    });
  }
  onModalAddTask(data: any) {
    this.ref = this.dialogService.open(RecorridoTaskAddOrEditComponent, {
      data: {
        id: data.id,
        routeId: data.routeId,
      },
      header: 'Agregar revisión a recorrido',
      styleClass: 'modal-md',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.toastService.onShowSuccess();
        this.onLoadData(this.value);
      }
    });
  }

  eliminarRecorrido(id: number) {
    this.swalService.onLoading();
    this.subRef$ = this.dataService.delete('Routes/' + id).subscribe({
      next: () => {
        this.toastService.onShowSuccess();
        this.swalService.onClose();
        this.onLoadData(this.value);
      },
      error: (err) => {
        this.toastService.onShowError();
        this.swalService.onClose();
        console.log(err.error);
      },
    });
  }
  onModalBitacora(machineryId: number) {
    this.ref = this.dialogService.open(AddBitacoraComponent, {
      data: {
        machineryId,
      },
      header: 'Registrar novedades',
      styleClass: 'modal-md',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
  }
  onModalBitacoraIndividual(data: any) {
    this.ref = this.dialogService.open(BitacoraIndividualComponent, {
      data: {
        machineryId: data.machineryId,
        nameMachinery: data.nameMachinery,
      },
      header: 'Bitacora',
      styleClass: 'modal-md',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.toastService.onShowSuccess();
        this.onLoadData(this.value);
      }
    });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
