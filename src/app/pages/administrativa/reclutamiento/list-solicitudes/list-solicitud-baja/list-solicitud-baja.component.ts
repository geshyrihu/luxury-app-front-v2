import { CommonModule } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { Observable, Subscription } from 'rxjs';
import PhoneFormatPipe from 'src/app/pipes/phone-format.pipe';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import ComponentsModule from 'src/app/shared/components.module';
import { FilterRequestsService } from '../../../../../services/filter-requests.service';
import FilterRequestsComponent from '../filter-requests.component';
import AddoreditSolicitudBajaComponent from './addoredit-solicitud-baja/addoredit-solicitud-baja.component';
@Component({
  selector: 'app-list-solicitud-baja',
  templateUrl: './list-solicitud-baja.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ComponentsModule,
    FilterRequestsComponent,
    FormsModule,
    NgbDropdownModule,
    PhoneFormatPipe,
    RouterModule,
    TableModule,
    ToastModule,
  ],
  providers: [DialogService, MessageService, ToastService],
})
export default class ListSolicitudBajaComponent implements OnInit {
  public swalService = inject(SwalService);
  public toastService = inject(ToastService);
  public authService = inject(AuthService);
  private dataService = inject(DataService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  private filterRequestsService = inject(FilterRequestsService);

  data: any[] = [];
  ref: DynamicDialogRef;
  subRef$: Subscription;
  paramsEmit$: Observable<HttpParams> = this.filterRequestsService.getParams$();
  ngOnInit(): void {
    this.onLoadData();
    this.paramsEmit$.subscribe(() => this.onLoadData());
  }

  onLoadData() {
    this.subRef$ = this.dataService
      .get(`RequestDismissal/List/`, this.filterRequestsService.getParams())
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;
          console.log('🚀 ~ resp.body:', resp.body);
          this.swalService.onClose();
        },
        error: (err) => {
          console.log(err.error);
          this.swalService.onClose();
          this.toastService.onShowError();
        },
      });
  }
  onModalAddOrEdit(data: any) {
    this.ref = this.dialogService.open(AddoreditSolicitudBajaComponent, {
      data: {
        id: data.id,
      },
      header: data.title,
      styleClass: 'modal-md modal-backdrop',
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
  onDelete(id: number) {
    this.swalService.onLoading();
    this.subRef$ = this.dataService.delete(`RequestDismissal/${id}`).subscribe({
      next: () => {
        this.onLoadData();
        this.swalService.onClose();
        this.toastService.onShowSuccess();
      },
      error: (err) => {
        console.log(err.error);
        this.swalService.onClose();
        this.toastService.onShowError();
      },
    });
  }

  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
