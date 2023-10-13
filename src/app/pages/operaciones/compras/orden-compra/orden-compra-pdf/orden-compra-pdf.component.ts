import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { CustomSwalService } from 'src/app/services/custom-swal.service';
import { CustomToastService } from 'src/app/services/custom-toast.service';
import { DataService } from 'src/app/services/data.service';
import { SelectItemService } from 'src/app/services/select-item.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-orden-compra-pdf',
  templateUrl: './orden-compra-pdf.component.html',
  standalone: true,
  imports: [CommonModule],
  providers: [MessageService, CustomToastService],
})
export default class OrdenCompraPdfComponent implements OnInit, OnDestroy {
  public customSwalService = inject(CustomSwalService);
  public customToastService = inject(CustomToastService);
  public dataService = inject(DataService);
  public routeActive = inject(ActivatedRoute);
  public selectItemService = inject(SelectItemService);
  public messageService = inject(MessageService);

  subRef$: Subscription;

  url: string = environment.base_urlImg + 'Administration/customer/';
  model: any;
  ordenCompraId: number = 0;
  nombreAutorizador = '';
  total: number = 0;
  ordenCompraPresupuesto: any[] = [];
  ordenCompraDetalle: any[];
  cb_unidadMedida: any[] = [];

  totalOrdenCompra: number = 0;
  subtotal: number = 0;
  retencionIva: number = 0;
  iva: number = 0;

  ngOnInit(): void {
    this.ordenCompraId = this.routeActive.snapshot.params.id;
    this.onLoadData();
  }

  onLoadData() {
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService
      .get(`ordencompra/Pdf/${this.ordenCompraId}`)
      .subscribe({
        next: (resp: any) => {
          this.model = resp.body;
          this.ordenCompraDetalle = this.model.ordenCompraDetalle;

          for (let n of this.ordenCompraDetalle) {
            this.total += n.total;
          }
          let subTotal = 0;
          let retencionIva = 0;
          let ivaTotal = 0;

          for (let n of this.model.ordenCompraDetalle) {
            subTotal += n.subTotal;
            if (n.unidadMedidaId === 14) {
              retencionIva += n.subTotal;
            }
          }
          for (let n of this.model.ordenCompraDetalle) {
            ivaTotal += n.iva;
          }

          this.retencionIva = retencionIva * 0.06;

          this.subtotal = subTotal;
          this.iva = ivaTotal;

          this.subtotal = subTotal;

          this.total = this.subtotal + this.iva - this.retencionIva;
          this.customSwalService.onClose();
        },
        error: (err) => {
          this.customToastService.onShowError();
          this.customSwalService.onClose();
          console.log(err.error);
        },
      });
  }

  onGetOrdenCompraPresupuesto() {
    this.subRef$ = this.dataService
      .get<any>(
        `OrdenCompraPresupuesto/GetAllForOrdenCompra/${this.ordenCompraId}`
      )
      .subscribe({
        next: (resp: any) => {
          this.ordenCompraPresupuesto = resp.body;
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
        },
      });
  }
  onLoadOrdenCompraDetalle() {
    this.subRef$ = this.dataService
      .get<any>(`OrdenCompraDetalle/GetAll/${this.ordenCompraId}`)
      .subscribe({
        next: (resp: any) => {
          this.ordenCompraDetalle = resp.body;
          for (let n of this.ordenCompraDetalle) {
            this.total += n.total;
          }
          this.customSwalService.onClose();
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
          this.customSwalService.onClose();
        },
      });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
