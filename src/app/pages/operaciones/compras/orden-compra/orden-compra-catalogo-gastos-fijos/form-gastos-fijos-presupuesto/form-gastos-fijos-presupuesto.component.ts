import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CatalogoGastosFijosService } from 'src/app/services/catalogo-gastos-fijos.service';
import { CustomerIdService } from 'src/app/services/customer-id.service';
import { DataService } from 'src/app/services/data.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import ComponentsModule from 'src/app/shared/components.module';

@Component({
  selector: 'app-form-gastos-fijos-presupuesto',
  templateUrl: './form-gastos-fijos-presupuesto.component.html',
  standalone: true,
  imports: [
    ComponentsModule,
    CommonModule,
    FormsModule,
    TableModule,
    ToastModule,
  ],
  providers: [MessageService, ToastService],
})
export default class FormGastosFijosPresupuestoComponent
  implements OnInit, OnDestroy
{
  public swalService = inject(SwalService);
  public toastService = inject(ToastService);
  public dataService = inject(DataService);
  public authService = inject(AuthService);
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  public messageService = inject(MessageService);
  public catalogoGastosFijosService = inject(CatalogoGastosFijosService);
  public customerIdService = inject(CustomerIdService);

  subRef$: Subscription;

  data: any[] = [];
  presupuestoAgregados: any[] = [];
  total: number = 0;
  catalogoGastosFijosId: number = 0;
  cb_cedulas: any[] = [];
  cedulaId: number = 0;

  ngOnInit(): void {
    this.onLoadCedulas();
    this.catalogoGastosFijosId =
      this.catalogoGastosFijosService.getCatalogoGastosFijosId();
    this.onLoadPresupuesto();
  }

  onLoadPresupuesto() {
    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .get(
        `OrdenCompraPresupuesto/GetAllForGastosFijos/${this.customerIdService.customerId}/${this.cedulaId}/${this.catalogoGastosFijosId}`
      )
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;

          this.onLoadPresupuestoAgregados();
          this.swalService.onClose();
        },
        error: (err) => {
          this.toastService.onShowError();
          console.log(err.error);
          this.swalService.onClose();
        },
      });
  }

  onSubmit(partidaPresupuestal: any) {
    const model = {
      cedulaPresupuestalDetalleId:
        partidaPresupuestal.cedulaPresupuestalDetalleId,
      dineroUsado: partidaPresupuestal.dineroUsado,
      catalogoGastosFijosId: this.catalogoGastosFijosId,
    };
    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .post(`CatalogoGastosFijosPresupuesto`, model)
      .subscribe({
        next: () => {
          this.onLoadPresupuestoAgregados();
          this.onLoadPresupuesto();
          this.swalService.onClose();
        },
        error: (err) => {
          console.log(err.error);
          this.swalService.onClose();
          this.toastService.onShowError();
        },
      });
  }

  onLoadPresupuestoAgregados() {
    this.subRef$ = this.dataService
      .get(
        `CatalogoGastosFijosPresupuesto/PresupuestoOrdenCompraFijos/${this.catalogoGastosFijosId}`
      )
      .subscribe({
        next: (resp: any) => {
          this.presupuestoAgregados = resp.body;
        },
        error: (err) => {
          this.toastService.onShowError();
          console.log(err.error);
        },
      });
  }

  deletePresupuestoAgregado(id: number) {
    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .delete(`CatalogoGastosFijosPresupuesto/${id}`)
      .subscribe({
        next: () => {
          this.toastService.onShowSuccess();
          this.onLoadPresupuesto();
          this.onLoadPresupuestoAgregados();
          this.swalService.onClose();
        },
        error: (err) => {
          this.toastService.onShowError();
          console.log(err.error);
          this.swalService.onClose();
        },
      });
  }

  onUpdatePresupuestoAgregado(item: any) {
    this.subRef$ = this.dataService
      .put(`CatalogoGastosFijosPresupuesto/${item.id}`, item)
      .subscribe({
        next: (resp: any) => {
          this.toastService.onShowSuccess();
          this.onLoadPresupuestoAgregados();
        },
        error: (err) => {
          this.toastService.onShowError();
          console.log(err.error);
        },
      });
  }

  onLoadCedulas() {
    this.subRef$ = this.dataService
      .get(
        `CedulaPresupuestal/GetCedulas/${this.customerIdService.getcustomerId()}`
      )
      .subscribe({
        next: (resp: any) => {
          if (resp.body) {
            this.cedulaId = resp.body[0].value;
          }
          this.cb_cedulas = resp.body;
        },
        error: (err) => {
          this.toastService.onShowError();
          console.log(err.error);
        },
      });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
