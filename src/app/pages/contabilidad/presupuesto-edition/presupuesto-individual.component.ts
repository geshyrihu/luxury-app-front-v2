import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbAlertModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import EditPartidaCedulaComponent from 'src/app/pages/contabilidad/presupuesto/edit-partida-cedula.component';
import {
  AuthService,
  CustomToastService,
  DataService,
} from 'src/app/services/common-services';
import { CustomerIdService } from 'src/app/services/customer-id.service';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import OrdenesCompraCedulaComponent from '../../operaciones/compras/cedula-presupuestal/ordenes-compra-cedula/ordenes-compra-cedula.component';
import AddPartidaCedulaComponent from '../presupuesto/add-partida-cedula.component';
import InfoCuentaComponent from './info-cuenta/info-cuenta.component';
import MantenimientosProgramadosComponent from './mantenimientos-programados/mantenimientos-programados.component';
import PresupuestoDetalleEdicionHistorialComponent from './presupuesto-detalle-edicion-historial/presupuesto-detalle-edicion-historial.component';
import PresupuestoEditionFileComponent from './presupuesto-edition-file/presupuesto-edition-file.component';

@Component({
  selector: 'app-presupuesto-individual',
  templateUrl: './presupuesto-individual.component.html',
  standalone: true,
  imports: [
    PrimeNgModule,
    CommonModule,
    ButtonModule,
    ComponentsModule,
    FormsModule,
    NgbAlertModule,
    NgbTooltipModule,
  ],
  providers: [DialogService, MessageService, CustomToastService],
})
export default class PresupuestoIndividualComponent implements OnInit {
  public authService = inject(AuthService);
  public customerIdService = inject(CustomerIdService);
  public dataService = inject(DataService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public customToastService = inject(CustomToastService);
  private activatedRoute = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  // Declaración e inicialización de variables
  id: number = 0;
  employeeId: number = this.authService.infoEmployeeDto.employeeId;
  data: any;
  ref: DynamicDialogRef; // Referencia a un cuadro de diálogo modal
  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params.id;

    // Cuando se inicia el componente, cargar los datos de los bancos
    this.onLoadData();
  }
  // Función para cargar los datos de los bancos
  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    // Realizar una solicitud HTTP para obtener datos de bancos
    this.dataService
      .get('Presupuesto/GetById/' + this.id)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          // Cuando se obtienen los datos con éxito, actualizar la variable 'data' y ocultar el mensaje de carga
          this.data = resp.body;
          console.log('🚀 ~ resp.body:', resp.body);
          this.customToastService.onClose();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }

  onModalAdd(data: any) {
    this.ref = this.dialogService.open(AddPartidaCedulaComponent, {
      data: {
        idBudgetCard: this.id,
      },
      header: 'Agregar Partida',
      height: 'auto',
      width: '80%',
      styleClass: 'modal-md',
      baseZIndex: 10000,
      closeOnEscape: true,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.onLoadData();
        this.customToastService.onShowSuccess();
      }
    });
  }

  // Función para eliminar un partida presupuestal
  onDelete(id: number) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    // Realizar una solicitud HTTP para eliminar un banco específico
    this.dataService
      .delete(`CedulaPresupuestal/CedulaPresupuestalDetalle/${id}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          // Cuando se completa la eliminación con éxito, mostrar un mensaje de éxito y volver a cargar los datos
          this.customToastService.onCloseToSuccess();
          // Elimina el elemento de la matriz
          const index = this.data.budgetDetailDto.findIndex(
            (item) => item.id === id
          );
          if (index !== -1) {
            console.log('id a ekiminbar,', id);
            this.data.budgetDetailDto.splice(index, 1);
          }

          // Forza una actualización de la vista
          this.cdr.detectChanges();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }
  // Función para eliminar un banco
  onGetHistorial(id: number) {
    this.ref = this.dialogService.open(
      PresupuestoDetalleEdicionHistorialComponent,
      {
        data: {
          id,
        },
        header: 'Historial de movimientos',
        styleClass: 'modal-md ',
        closeOnEscape: true,
        baseZIndex: 10000,
      }
    );
  }
  onModalInfoCuenta(id: number) {
    this.ref = this.dialogService.open(InfoCuentaComponent, {
      data: {
        id,
      },
      header: 'Consideraciones',
      styleClass: 'modal-md ',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
  }

  // Función para abrir un cuadro de diálogo modal para agregar o editar información sobre un banco
  onModalAddOrEdit(data: any) {
    this.ref = this.dialogService.open(EditPartidaCedulaComponent, {
      data: {
        id: data.id,
      },
      header: data.title,
      styleClass: 'modal-md ',
      closeOnEscape: true,
      baseZIndex: 10000,
    });

    // Escuchar el evento 'onClose' cuando se cierra el cuadro de diálogo
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        // Cuando se recibe 'true', mostrar un mensaje de éxito y volver a cargar los datos
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }

  ServiciosMttoProgramados(cuentaId: number) {
    console.log('🚀 ~ cuentaId:', cuentaId);
    this.ref = this.dialogService.open(MantenimientosProgramadosComponent, {
      data: {
        cuentaId,
      },
      header: 'Mantenimientos programados',
      styleClass: 'modal-md ',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
  }

  onModalDocument(id: number) {
    this.ref = this.dialogService.open(PresupuestoEditionFileComponent, {
      data: {
        id,
      },
      header: 'Soporte documentos',
      styleClass: 'modal-lg',
      closeOnEscape: true,
      baseZIndex: 10000,
    });

    // Escuchar el evento 'onClose' cuando se cierra el cuadro de diálogo
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        // Cuando se recibe 'true', mostrar un mensaje de éxito y volver a cargar los datos
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }

  onEnterPressed(item: any) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    const data = {
      id: item.id,
      employeeId: this.employeeId,
      monthlyBudget: item.monthlyBudget,
    };
    // Realizar una solicitud HTTP para obtener datos de bancos
    this.dataService
      .post(`Presupuesto/UpdateAccount/`, data)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          // Cuando se actualiza el elemento con éxito, buscar su índice en la matriz
          const index = this.data.budgetDetailDto.findIndex(
            (existingItem) => existingItem.id === data.id
          );

          if (index !== -1) {
            // Actualiza el elemento en la matriz
            this.data.budgetDetailDto[index] = {
              ...this.data.budgetDetailDto[index],
              monthlyBudget: data.monthlyBudget,
            };
          }

          // Oculta el mensaje de carga
          this.customToastService.onCloseToSuccess();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }

  onModalOrdenesCompraCedula(
    presupuestoAnteriorDetalleId: number,
    presupuestoAnteriorId: number
  ) {
    this.ref = this.dialogService.open(OrdenesCompraCedulaComponent, {
      data: {
        partidaPresupuestalId: presupuestoAnteriorDetalleId,
        cedulaPresupuestalId: presupuestoAnteriorId,
      },
      header: 'Ordenes de Compra',
      height: '100%',
      width: '100%',
      baseZIndex: 10000,
      closeOnEscape: true,
    });
  }
  ngOnDestroy(): void {
    // Cuando se destruye el componente, desvincular y liberar recursos
    this.destroy$.next();
    this.destroy$.complete();
  }
}
