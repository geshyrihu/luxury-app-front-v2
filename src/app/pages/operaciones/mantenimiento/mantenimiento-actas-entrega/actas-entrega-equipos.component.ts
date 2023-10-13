import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subscription } from 'rxjs';
import { SanitizeHtmlPipe } from 'src/app/pipes/sanitize-html.pipe';
import {
  CustomSwalService,
  CustomToastService,
  CustomerIdService,
  DataService,
} from 'src/app/services/common-services';
import { environment } from 'src/environments/environment';
import FormActasEntregaEquiposComponent from '../mantenimiento-inventarios/activos/form-actas-entrega-equipos/form-actas-entrega-equipos.component';

@Component({
  selector: 'app-actas-entrega-equipos',
  templateUrl: './actas-entrega-equipos.component.html',
  standalone: true,
  imports: [CommonModule, SanitizeHtmlPipe],
  providers: [DialogService, MessageService, CustomToastService],
})
export default class ActasEntregaEquiposComponent implements OnInit, OnDestroy {
  public customSwalService = inject(CustomSwalService);
  public customToastService = inject(CustomToastService);
  public dataService = inject(DataService);
  public customerIdService = inject(CustomerIdService);
  public messageService = inject(MessageService);
  public dialogService = inject(DialogService);
  date = new Date();
  empresaReceptora: string = '';
  entregadoPor: string = '';
  recibidoPor: string = '';
  base_urlImg: string = '';
  base_urlImgLogo: string = environment.base_urlImg;
  data: any[] = [];
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  ref: DynamicDialogRef;
  subRef$: Subscription;

  ngOnInit(): void {
    this.onModalAddOrEdit();
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.onLoadData();
    this.base_urlImg = this.urlImg(this.customerIdService.getcustomerId());
    this.customerId$.subscribe((resp) => {
      this.onLoadData();
      this.base_urlImg = this.urlImg(this.customerIdService.getcustomerId());
    });
  }

  onLoadData() {
    this.base_urlImg = this.urlImg(this.customerIdService.getcustomerId());
    this.customSwalService.onLoading();

    this.subRef$ = this.dataService
      .get(`Machineries/ActasEntrega/${this.customerIdService.customerId}`)
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
  urlImg(customerId: any): string {
    return `${environment.base_urlImg}customers/${customerId}/machinery/`;
  }

  onModalAddOrEdit() {
    this.ref = this.dialogService.open(FormActasEntregaEquiposComponent, {
      data: {},
      header: 'Actas de entrega',
      styleClass: 'modal-md',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: any) => {
      this.date = resp.date;
      this.empresaReceptora = resp.empresaReceptora;
      this.entregadoPor = resp.entregadoPor;
      this.recibidoPor = resp.recibidoPor;
      this.ngOnInit();
    });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
