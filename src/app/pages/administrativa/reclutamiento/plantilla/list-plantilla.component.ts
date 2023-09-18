import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  NgbDropdownModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { Observable, Subscription } from 'rxjs';
import { IWorkPositionDto } from 'src/app/interfaces/IEmpresaOrganigramaDto.interface';
import CardEmployeeComponent from 'src/app/pages/operaciones/directorios/empleados/card-employee/card-employee.component';
import { ETurnoTrabajoPipe } from 'src/app/pipes/turno-trabajo.pipe';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerIdService } from 'src/app/services/customer-id.service';
import { DataService } from 'src/app/services/data.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import ComponentsModule from 'src/app/shared/components.module';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { StatusSolicitudVacanteService } from '../../../../services/status-solicitud-vacante.service';
import DescripcionPuestoComponent from '../professions/descripcion-puesto.component';
import SolicitudBajaComponent from '../solicitudes/solicitud-baja/solicitud-baja.component';
import SolicitudModificacionSalarioComponent from '../solicitudes/solicitud-modificacion-salario/solicitud-modificacion-salario.component';
import SolicitudVacanteComponent from '../solicitudes/solicitud-vacante/solicitud-vacante.component';
import AddoreditPlantillaComponent from './addoredit-plantilla.component';
import HoursWorkPositionComponent from './hours-work-position.component';

@Component({
  selector: 'app-list-plantilla',
  templateUrl: './list-plantilla.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ComponentsModule,
    ETurnoTrabajoPipe,
    NgbDropdownModule,
    NgbTooltipModule,
    RouterModule,
    TableModule,
    ToastModule,
  ],
  providers: [ConfirmationService, DialogService, MessageService, ToastService],
})
export default class ListWorkPlantillaComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  public authService = inject(AuthService);
  public confirmationService = inject(ConfirmationService);
  public customerIdService = inject(CustomerIdService);
  public dataService = inject(DataService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public statusSolicitudVacanteService = inject(StatusSolicitudVacanteService);
  public swalService = inject(SwalService);
  public toastService = inject(ToastService);

  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  data: any[] = [];
  pahtBaseImg = environment.base_urlImg + 'Administration/accounts/';
  ref: DynamicDialogRef;
  subRef$: Subscription;

  ngOnInit(): void {
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }

  onLoadData() {
    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .get<IWorkPositionDto[]>(
        'WorkPosition/GetAll/' + this.customerIdService.getcustomerId()
      )
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;
          console.log('🚀 ~ resp.body:', resp.body);
          this.swalService.onClose();
        },
        error: (err) => {
          console.log(err.error);
          this.swalService.onClose();
          this.toastService.onShowError();
        },
      });
  }

  //Modal para visualizar horarios de la vacante
  onModalHoursWorkPosition(workPositionId: number) {
    this.ref = this.dialogService.open(HoursWorkPositionComponent, {
      data: {
        workPositionId,
      },
      header: 'Horario de trabajo',
      styleClass: 'modal-lg',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.toastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }
  //Modal para visualizar descripcion de puesto
  onModalJobDescription(id: number) {
    this.ref = this.dialogService.open(DescripcionPuestoComponent, {
      data: {
        id,
      },
      header: 'Descripción del puesto',
      styleClass: 'modal-lg',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.toastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }

  //Solicitar vacante
  onModalSolicitudVacante(id: number) {
    this.ref = this.dialogService.open(SolicitudVacanteComponent, {
      data: {
        workPositionId: id,
      },
      header: 'Solicitud de vacante',
      width: '100%',
      height: '100%',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.toastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }
  //Solicitar baja

  onModalSolicitudBaja(id: number) {
    this.ref = this.dialogService.open(SolicitudBajaComponent, {
      data: {
        workPositionId: id,
      },
      header: 'Solicitud de baja',
      width: '100%',
      height: '100%',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.toastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }

  //Solicitar Modificacion de salario

  onModalSolicitudModificacionSalarion(id: number) {
    this.ref = this.dialogService.open(SolicitudModificacionSalarioComponent, {
      data: {
        workPositionId: id,
      },
      header: 'Solicitud de Modificación de salario',
      width: '100%',
      height: '100%',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.toastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }

  //Ver tarjeta de empleado
  onCardEmployee(employeeId: any) {
    this.ref = this.dialogService.open(CardEmployeeComponent, {
      data: {
        employeeId: employeeId,
      },
      header: 'Tarjeta de empleado',
      styleClass: 'modal-md',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
  }
  //Navegar a la solicitud pendiente con sus candidatos
  onRouteEstatusSolicitud(positionRequestId: number) {
    this.statusSolicitudVacanteService.setPositionRequestId(positionRequestId);
    this.router.navigate(['/reclutamiento/status-solicitud-vacante']);
  }

  //Solicitud vigente de modificacion de salario
  onRouteEstatusSalaryModification(employeeId: number, workPositionId: number) {
    this.statusSolicitudVacanteService.setemployeeId(employeeId);
    this.statusSolicitudVacanteService.setworkPositionId(workPositionId);
    this.router.navigate([
      '/reclutamiento/status-solicitud-modificacion-salario/',
    ]);
  }
  //Solicitud vigente de modificacion de baja
  onRouteEstatusRequestDismissal(workPositionId: number) {
    this.statusSolicitudVacanteService.setworkPositionId(workPositionId);
    this.router.navigate(['/reclutamiento/status-solicitud-baja']);
  }

  /*Se valida si pa profesion de Adminisrtador o Asistente entonces no puede ver las opciones a 
  menos que sea Supervisor */
  onValidateRole(professionId: number): boolean {
    let validation = true;
    if (professionId === 5 || professionId === 6) {
      validation = this.authService.onValidateRoles([
        'SupervisionOperativa',
        'SuperUsuario',
      ]);
    }
    return validation;
  }
  //Editar vacante
  onModalAddOrEdit(data: any) {
    this.ref = this.dialogService.open(AddoreditPlantillaComponent, {
      data: {
        id: data.id,
      },
      header: data.title,
      styleClass: 'modal-md',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.toastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }
  //Eliminar vacante workPosition
  onDelete(id: number) {
    Swal.fire({
      title: '¿Confirmar?',
      text: 'Se va a eliminar el registro',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        this.swalService.onLoading();
        this.subRef$ = this.dataService.delete(`WorkPosition/${id}`).subscribe({
          next: () => {
            this.toastService.onShowSuccess();
            this.swalService.onClose();
            this.onLoadData();
          },
          error: (err) => {
            this.toastService.onShowError();
            this.swalService.onClose();
            console.log(err.error);
          },
        });
      }
    });
  }

  onValidateShowTIcket(professionId: number): boolean {
    let permission = true;
    if (professionId == 5) {
      permission = this.authService.onValidateRoles([
        'SupervisionOperativa',
        'SuperUsuario',
        'Reclutamiento',
      ]);
    }
    if (professionId == 6) {
      permission = this.authService.onValidateRoles([
        'SupervisionOperativa',
        'SuperUsuario',
        'Reclutamiento',
        'Residente',
      ]);
    }
    return permission;
  }
  SendMailTest() {
    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .get('SolicitudesReclutamiento/SendMailTest')
      .subscribe({
        next: (_) => {
          this.swalService.onClose();
        },
        error: (err) => {
          console.log(err.error);
          this.swalService.onClose();
          this.toastService.onShowError();
        },
      });
  }

  //TODO:IMPLEMENTAR MEDTODO

  onSendPasswordAccount(workPositionId: number) {}
  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
