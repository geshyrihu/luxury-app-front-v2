import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { Subscription } from 'rxjs';
import { CedulaPresupuestalDetalleAddOrEdit } from 'src/app/interfaces/ICedulaPresupuestalDetalleAddOrEdit.interface';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import ComponentsModule from 'src/app/shared/components.module';

@Component({
  selector: 'app-add-partida-cedula',
  templateUrl: './add-partida-cedula.component.html',
  standalone: true,
  imports: [ComponentsModule, FormsModule, CommonModule, TableModule],
  providers: [ToastService],
})
export default class AddPartidaCedulaComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  public config = inject(DynamicDialogConfig);
  public authService = inject(AuthService);
  public ref = inject(DynamicDialogRef);
  private swalService = inject(SwalService);
  private toastService = inject(ToastService);

  data: any[] = [];
  cedulaPresupuestalId: number = 0;
  applicationUserId: string = '';
  submitting: boolean = false;
  subRef$: Subscription;

  ngOnInit(): void {
    this.applicationUserId =
      this.authService.userTokenDto.infoUserAuthDto.applicationUserId;
    this.cedulaPresupuestalId = this.config.data.idBudgetCard;
    this.onLoadData();
  }
  onLoadData() {
    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .get(
        `SelectItem/AddCuentaCedulaPresupuestal/${this.config.data.idBudgetCard}`
      )
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body.map(function (cuenta: any) {
            return {
              id: cuenta.id,
              numeroCuenta: cuenta.numeroCuenta,
              descripcion: cuenta.descripcion,
              presupuestoMensual: 0,
            };
          });
          this.swalService.onClose();
        },
        error: (err) => {
          this.swalService.onClose();
          this.toastService.onShowError();
          console.log(err.error);
        },
      });
  }
  onSubmit(item: any) {
    let model: CedulaPresupuestalDetalleAddOrEdit =
      new CedulaPresupuestalDetalleAddOrEdit();

    model.cuentaId = item.id;
    model.cedulaPresupuestalId = this.cedulaPresupuestalId;
    model.presupuestoMensual = item.presupuestoMensual;
    model.applicationUserId = this.applicationUserId;
    model.presupuestoEjercido = 0;

    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    this.swalService.onLoading();

    this.subRef$ = this.dataService
      .post(`CedulaPresupuestalDetalles`, model)
      .subscribe({
        next: () => {
          this.toastService.onShowSuccess();
          this.onLoadData();
        },
        error: (err) => {
          this.toastService.onShowError();
          console.log(err.error);
          // Habilitar el botón nuevamente al finalizar el envío del formulario
          this.submitting = false;
          this.swalService.onClose();
        },
      });
  }

  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
