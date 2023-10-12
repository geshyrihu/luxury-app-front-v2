import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerIdService } from 'src/app/services/customer-id.service';
import { DataService } from 'src/app/services/data.service';
import { DateService } from 'src/app/services/date.service';
import { FiltroCalendarService } from 'src/app/services/filtro-calendar.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import Swal from 'sweetalert2';
import AddPresentacionJuntaComiteComponent from './add-presentacion-junta-comite/add-presentacion-junta-comite.component';
import AddoreditPresentacionJuntaComiteComponent from './addoredit-presentacion-junta-comite/addoredit-presentacion-junta-comite.component';
import EnviarMailEstadosFinancierosComponent from './enviar-mail-estados-financieros/enviar-mail-estados-financieros.component';

@Component({
  selector: 'app-presentacion-junta-comite',
  templateUrl: './presentacion-junta-comite.component.html',
  standalone: true,
  imports: [CommonModule, ComponentsModule, PrimeNgModule],
  providers: [DialogService, MessageService, ConfirmationService, ToastService],
})
export default class PresentacionJuntaComiteComponent
  implements OnInit, OnDestroy
{
  private rangoCalendarioService = inject(FiltroCalendarService);
  public authService = inject(AuthService);
  public confirmationService = inject(ConfirmationService);
  public customerIdService = inject(CustomerIdService);
  public dataService = inject(DataService);
  public dateService = inject(DateService);
  public messageService = inject(MessageService);
  public route = inject(Router);
  public swalService = inject(SwalService);
  public toastService = inject(ToastService);
  public dialogService = inject(DialogService);

  enviarEstadosFinancierosCondominos(id: any) {
    this.ref = this.dialogService.open(EnviarMailEstadosFinancierosComponent, {
      data: {
        id,
      },
      header: 'ENVIAR ESTADOS FINANCIEROS',
      baseZIndex: 1000,
      height: '100%',
      width: '100%',
      closeOnEscape: true,
      maximizable: true,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.toastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }
  ref: DynamicDialogRef;
  subRef$: Subscription;
  data: any[] = [];
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  applicationUserId: string = '';
  url: string = '';

  estatusParteContable: boolean = false;
  supervisorContable: boolean = false;

  fechaInicial: string = this.dateService.getDateFormat(
    this.rangoCalendarioService.fechaInicial
  );
  fechaFinal: string = this.dateService.getDateFormat(
    this.rangoCalendarioService.fechaFinal
  );

  onValidarId(userId: string): boolean {
    if (
      userId == this.authService.userTokenDto.infoUserAuthDto.applicationUserId
    ) {
      return true;
    } else {
      return false;
    }
  }

  ngOnInit(): void {
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.onLoadData();
    this.url =
      'customers/' + this.customerIdService.getcustomerId() + '/presentacion/';
    this.applicationUserId =
      this.authService.userTokenDto.infoUserAuthDto.applicationUserId;
    this.customerId$.subscribe((resp) => {
      this.onLoadData();
      this.url =
        'customers/' +
        this.customerIdService.getcustomerId() +
        '/presentacion/';
    });
  }
  onValidateContabilidad(id: number, employeeSupervisorContableId: number) {
    if (employeeSupervisorContableId == null) {
      this.onAutorizarContabilidad(id);
    } else {
      this.onRevocarContabilidad(id);
    }
  }
  onValidateEstadosFinancieros(
    id: number,
    employeeSupervisorContableId: number
  ) {
    if (employeeSupervisorContableId == null) {
      this.onAutorizarFinancieros(id);
    } else {
      this.onRevocarFinancieros(id);
    }
  }
  onLoadData(): void {
    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .get(
        `PresentacionJuntaComite/GetAll/${this.customerIdService.getcustomerId()}`
      )
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

  showModalAddOrEdit(data: any) {
    this.ref = this.dialogService.open(
      AddoreditPresentacionJuntaComiteComponent,
      {
        data: {
          id: data.id,
          titulo: data.titulo,
        },
        header: data.titulo,
        styleClass: 'modal-lg',
        autoZIndex: true,
        closeOnEscape: true,
      }
    );
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.toastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }
  showModalAdd(data: any) {
    this.ref = this.dialogService.open(AddPresentacionJuntaComiteComponent, {
      data: {
        id: data.id,
      },
      header: data.title,
      styleClass: 'modal-lg',
      autoZIndex: true,
      closeOnEscape: true,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.toastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }

  //* Eliminar pdf
  onDelete(item: any, area: string) {
    this.subRef$ = this.dataService
      .delete('PresentacionJuntaComite/' + item.id + '/' + area)
      .subscribe({
        next: () => {
          this.onLoadData();
          this.toastService.onShowSuccess();
        },
        error: (err) => {
          this.toastService.onShowError();
          console.log(err.error);
        },
      });
  }
  // *Eliminar registro completo
  onDeleteItem(item: any) {
    this.subRef$ = this.dataService
      .delete('PresentacionJuntaComite/' + item.id)
      .subscribe({
        next: () => {
          this.onLoadData();
          this.toastService.onShowSuccess();
        },
        error: (err) => {
          this.toastService.onShowError();
          console.log(err.error);
        },
      });
  }

  onValidarPresentacion(id: number) {
    this.subRef$ = this.dataService
      .get(
        'PresentacionJuntaComite/AutorizarPresentacion/' +
          id +
          '/' +
          this.authService.userTokenDto.infoEmployeeDto.employeeId
      )
      .subscribe({
        next: () => {
          this.onLoadData();
          this.toastService.onShowSuccess();
        },
        error: (err) => {
          console.log(err.error);
          this.toastService.onShowError();
        },
      });
  }
  onAutorizarContabilidad(id: number) {
    Swal.fire({
      title: 'Estas Seguro?',
      text: 'Confirmo que la parte contable es correcta!!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Sí, confirmo!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
      }
    });
    this.subRef$ = this.dataService
      .get(
        'PresentacionJuntaComite/AutorizarContable/' +
          id +
          '/' +
          this.authService.userTokenDto.infoEmployeeDto.employeeId
      )
      .subscribe({
        next: () => {
          this.onLoadData();
          this.toastService.onShowSuccess();
        },
        error: (err) => {
          console.log(err.error);
          this.toastService.onShowError();
        },
      });
  }

  onRevocarContabilidad(id: number) {
    Swal.fire({
      title: 'Estas Seguro?',
      text: 'Se va a revocar la revisión',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Sí, confirmo!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        this.subRef$ = this.dataService
          .get('PresentacionJuntaComite/RevocarContable/' + id)
          .subscribe(
            (resp: any) => {
              this.onLoadData();
              Swal.fire(
                'Completado!',
                'Se ha creado el archivo final.',
                'success'
              );
            },
            (err) => {
              console.log(err.error);
              this.toastService.onShowError();
            }
          );
      }
    });
  }

  onAutorizarFinancieros(id: number) {
    Swal.fire({
      title: 'Estas Seguro?',
      text: 'Confirmo que los estados financieros estan correctos!!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Sí, confirmo!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        this.subRef$ = this.dataService
          .get(
            'PresentacionJuntaComite/AutorizarEstadosFinancieros/' +
              id +
              '/' +
              this.authService.userTokenDto.infoEmployeeDto.employeeId
          )
          .subscribe(
            (resp: any) => {
              this.onLoadData();
              Swal.fire(
                'Completado!',
                'Se ha creado el archivo final.',
                'success'
              );
            },
            (err) => {
              console.log(err.error);
              this.toastService.onShowError();
            }
          );
      }
    });
  }

  onRevocarFinancieros(id: number) {
    Swal.fire({
      title: 'Estas Seguro?',
      text: 'Se va a revocar la revisión',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Sí, confirmo!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        this.subRef$ = this.dataService
          .get('PresentacionJuntaComite/RevocarEstadosFinancieros/' + id)
          .subscribe(
            (resp: any) => {
              this.onLoadData();
              Swal.fire(
                'Completado!',
                'Se ha creado el archivo final.',
                'success'
              );
            },
            (err) => {
              console.log(err.error);
              this.toastService.onShowError();
            }
          );
      }
    });
  }

  onValidarCargasCompletasPorArea(
    portada: string,
    contabilidad: string,
    operaciones: string
  ): boolean {
    if (portada !== '' && contabilidad !== '' && operaciones !== '') {
      return true;
    } else {
      return false;
    }
  }
  enviarMailTesorero(idJunta: number) {
    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .get('SendEmail/EnviarEstadosFinancierosTesorero/' + idJunta)
      .subscribe({
        next: () => {
          this.toastService.onShowSuccess();
          this.onLoadData();
          this.swalService.onClose();
        },
        error: (err) => {
          this.toastService.onShowError();
          console.log(err.error);
        },
      });
  }

  enviarMailPresentacionComite(idJunta: number) {
    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .get('SendEmail/PresentacionFinalComite/' + idJunta)
      .subscribe({
        next: () => {
          this.toastService.onShowSuccess();
          this.onLoadData();
          this.swalService.onClose();
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
