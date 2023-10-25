import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
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
import PresupuestoDetalleEdicionHistorialComponent from './presupuesto-detalle-edicion-historial/presupuesto-detalle-edicion-historial.component';

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
          console.log('🚀 ~ this.data:', this.data);
          this.customToastService.onClose();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }

  // Función para eliminar un banco
  onDelete(data: any) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    // Realizar una solicitud HTTP para eliminar un banco específico
    this.dataService
      .delete(`Presupuesto/${data.id}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          // Cuando se completa la eliminación con éxito, mostrar un mensaje de éxito y volver a cargar los datos
          this.customToastService.onCloseToSuccess();
          this.onLoadData();
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
          // Cuando se obtienen los datos con éxito, actualizar la variable 'data' y ocultar el mensaje de carga
          this.onLoadData();
          this.customToastService.onClose();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }

  ngOnDestroy(): void {
    // Cuando se destruye el componente, desvincular y liberar recursos
    this.destroy$.next();
    this.destroy$.complete();
  }
}
