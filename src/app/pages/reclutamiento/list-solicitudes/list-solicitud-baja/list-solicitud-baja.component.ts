import { CommonModule } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subscription } from 'rxjs';
import PhoneFormatPipe from 'src/app/pipes/phone-format.pipe';
import {
  AuthService,
  CustomSwalService,
  CustomToastService,
  DataService,
  FilterRequestsService,
} from 'src/app/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
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
    PrimeNgModule,
  ],
  providers: [DialogService, MessageService, CustomToastService],
})
export default class ListSolicitudBajaComponent implements OnInit {
  public customSwalService = inject(CustomSwalService);
  public customToastService = inject(CustomToastService);
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
          this.customSwalService.onClose();
        },
        error: (err) => {
          console.log(err.error);
          this.customSwalService.onClose();
          this.customToastService.onShowError();
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
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }
  onDelete(id: number) {
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService.delete(`RequestDismissal/${id}`).subscribe({
      next: () => {
        this.onLoadData();
        this.customSwalService.onClose();
        this.customToastService.onShowSuccess();
      },
      error: (err) => {
        console.log(err.error);
        this.customSwalService.onClose();
        this.customToastService.onShowError();
      },
    });
  }

  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
