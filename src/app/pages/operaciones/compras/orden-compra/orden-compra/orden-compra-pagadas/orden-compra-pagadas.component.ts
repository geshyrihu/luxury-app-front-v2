import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { Observable, Subscription } from 'rxjs';
import { CurrencyMexicoPipe } from 'src/app/pipes/currencyMexico.pipe';
import { CustomerIdService } from 'src/app/services/customer-id.service';
import { DataService } from 'src/app/services/data.service';
import { OrdenCompraService } from 'src/app/services/orden-compra.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import ComponentsModule from 'src/app/shared/components.module';
import OrdenCompraComponent from '../orden-compra.component';

@Component({
  selector: 'app-orden-compra-pagadas',
  templateUrl: './orden-compra-pagadas.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ComponentsModule,
    RouterModule,
    TableModule,
    ToastModule,
    CurrencyMexicoPipe,
  ],
  providers: [DialogService, MessageService, ToastService],
})
export default class OrdenCompraPagadasComponent implements OnInit, OnDestroy {
  public swalService = inject(SwalService);
  public toastService = inject(ToastService);
  public dataService = inject(DataService);
  public customerIdService = inject(CustomerIdService);
  public router = inject(Router);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public ordenCompraService = inject(OrdenCompraService);

  data: any[] = [];
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  tipo = 1;
  ref: DynamicDialogRef;
  subRef$: Subscription;

  ngOnInit(): void {
    this.onLoadData(1);
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.customerId$.subscribe((resp) => {
      this.onLoadData(1);
    });
  }

  onLoadData(type: any) {
    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .get(`OrdenCompra/Pagadas/${this.customerIdService.customerId}/${type}`)
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;
          this.swalService.onClose();
        },
        error: (err) => {
          console.log(err.error);
          this.swalService.onClose();
        },
      });
  }
  onRevocarPago(id: number) {
    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .get(`OrdenCompraStatus/RevocarPago/${id}`)
      .subscribe({
        next: (resp: any) => {
          this.onLoadData(this.tipo);
          this.swalService.onClose();
        },
        error: (err) => {
          console.log(err.error);
          this.swalService.onClose();
        },
      });
  }
  onAddOrEdit(id: number) {
    this.ordenCompraService.setOrdenCompraId(id);
    this.ref = this.dialogService.open(OrdenCompraComponent, {
      data: {
        id,
      },
      header: 'Editar Orden de Compra',
      width: '100%',
      height: '100%',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.toastService.onShowSuccess();
        this.onLoadData(this.tipo);
      }
    });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
