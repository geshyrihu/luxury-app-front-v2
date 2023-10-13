import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subscription } from 'rxjs';
import { CurrencyMexicoPipe } from 'src/app/pipes/currencyMexico.pipe';
import { CustomerIdService } from 'src/app/services/common-services';
import { CustomSwalService } from 'src/app/services/custom-swal.service';
import { CustomToastService } from 'src/app/services/custom-toast.service';
import { DataService } from 'src/app/services/data.service';
import { OrdenCompraService } from 'src/app/services/orden-compra.service';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import OrdenCompraComponent from '../orden-compra.component';

@Component({
  selector: 'app-orden-compra-pagadas',
  templateUrl: './orden-compra-pagadas.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ComponentsModule,
    RouterModule,
    PrimeNgModule,
    CurrencyMexicoPipe,
  ],
  providers: [DialogService, MessageService, CustomToastService],
})
export default class OrdenCompraPagadasComponent implements OnInit, OnDestroy {
  public customSwalService = inject(CustomSwalService);
  public customToastService = inject(CustomToastService);
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
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService
      .get(`OrdenCompra/Pagadas/${this.customerIdService.customerId}/${type}`)
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;
          this.customSwalService.onClose();
        },
        error: (err) => {
          console.log(err.error);
          this.customSwalService.onClose();
        },
      });
  }
  onRevocarPago(id: number) {
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService
      .get(`OrdenCompraStatus/RevocarPago/${id}`)
      .subscribe({
        next: (resp: any) => {
          this.onLoadData(this.tipo);
          this.customSwalService.onClose();
        },
        error: (err) => {
          console.log(err.error);
          this.customSwalService.onClose();
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
        this.customToastService.onShowSuccess();
        this.onLoadData(this.tipo);
      }
    });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
