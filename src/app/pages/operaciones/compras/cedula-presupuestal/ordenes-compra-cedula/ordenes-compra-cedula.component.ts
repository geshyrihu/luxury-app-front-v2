import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { CustomSwalService } from 'src/app/services/custom-swal.service';
import { CustomToastService } from 'src/app/services/custom-toast.service';
import { DataService } from 'src/app/services/data.service';
import { OrdenCompraService } from 'src/app/services/orden-compra.service';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import OrdenCompraComponent from '../../orden-compra/orden-compra/orden-compra.component';

@Component({
  selector: 'app-ordenes-compra-cedula',
  templateUrl: './ordenes-compra-cedula.component.html',
  standalone: true,
  imports: [ComponentsModule, CommonModule, PrimeNgModule, NgbTooltip],
  providers: [CustomToastService],
})
export default class OrdenesCompraCedulaComponent implements OnInit, OnDestroy {
  private customSwalService = inject(CustomSwalService);
  private customToastService = inject(CustomToastService);
  private dataService = inject(DataService);
  public config = inject(DynamicDialogConfig);
  public dialogService = inject(DialogService);
  public ordenCompraService = inject(OrdenCompraService);

  subRef$: Subscription;
  partidaPresupuestalId: number = 0;
  cedulaPresupuestalId: number = 0;
  data: any[] = [];
  ngOnInit(): void {
    this.partidaPresupuestalId = this.config.data.partidaPresupuestalId;
    this.cedulaPresupuestalId = this.config.data.cedulaPresupuestalId;
    if (this.partidaPresupuestalId !== 0 && this.cedulaPresupuestalId !== 0)
      this.onLoadData();
  }

  onLoadData() {
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService
      .get(
        `OrdenCompra/compraspresupuesto/${this.partidaPresupuestalId}/${this.cedulaPresupuestalId}`
      )
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
  pagadas() {
    let total: number = 0;
    this.data.forEach((item) => {
      if (item.statuspagoFiltro) {
        total += item.totalSuma;
      }
    });

    return total.toLocaleString('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: true,
      // Puedes ajustar las opciones regionales aquí
    });
  }
  noPagadas() {
    let total: number = 0;
    this.data.forEach((item) => {
      if (!item.statuspagoFiltro) {
        total += item.totalSuma;
      }
    });

    return total.toLocaleString('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: true,
      // Puedes ajustar las opciones regionales aquí
    });
  }
  ref: DynamicDialogRef;
  onOrdenCompraModal(id: number) {
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
  }

  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
