import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subscription } from 'rxjs';
import { IEmployeeDto } from 'src/app/interfaces/IEmployeeDto.interface';
import UpdatePasswordModalComponent from 'src/app/pages/configuracion/accounts/modal-edit-account/update-password-modal/update-password-modal.component';
import {
  AuthService,
  CustomSwalService,
  CustomToastService,
  CustomerIdService,
  DataService,
} from 'src/app/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import { environment } from 'src/environments/environment';
import AccountToEmployeeComponent from './account-to-employee/account-to-employee.component';
import AddAccountCustomerComponent from './add-account-customer.component';
import AddOrEditEmployeeOnlyImgComponent from './add-or-edit-employee-img.component';
import AddOrEditEmplopyeeComponent from './addoredit-employee.component';
import ContactEmployeeComponent from './contact-employee.component';

const base_urlImg = environment.base_urlImg + 'Administration/accounts/';
@Component({
  selector: 'app-list-employee',
  templateUrl: './list-employee.component.html',
  standalone: true,
  imports: [CommonModule, ComponentsModule, PrimeNgModule],
  providers: [
    DialogService,
    MessageService,
    ConfirmationService,
    CustomToastService,
  ],
})
export default class ListEmployeeComponent implements OnInit, OnDestroy {
  public authService = inject(AuthService);
  private customerIdService = inject(CustomerIdService);
  private dataService = inject(DataService);
  private rutaActiva = inject(ActivatedRoute);
  private dialogService = inject(DialogService);
  private customSwalService = inject(CustomSwalService);
  public customToastService = inject(CustomToastService);

  activo: boolean = true;
  data: IEmployeeDto[] = [];
  getAllEmployeeActive: any = [];
  ref: DynamicDialogRef;
  subRef$: Subscription;
  tipoContrato: any;
  url = base_urlImg;

  customerId$: Observable<number> = this.customerIdService.getCustomerId$();

  ngOnInit(): void {
    this.tipoContrato = this.rutaActiva.snapshot.params.parametro;
    this.onLoadData();

    this.customerId$ = this.customerIdService.getCustomerId$();
    this.rutaActiva.url.subscribe((url) => {
      this.tipoContrato = url[1].path;
      this.onLoadData();
    });
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }

  onSelectActive(active: boolean): any {
    this.activo = active;
    this.onLoadData();
  }

  onBlockEmployee(id: number) {
    this.subRef$ = this.dataService.get(`Employees/Bloqueo/${id}`).subscribe({
      next: () => {
        this.onLoadData();
        this.customToastService.onShowSuccess();
        this.customSwalService.onClose();
      },
      error: (err) => {
        this.customToastService.onShowError();
        console.log(err.error);
        this.customSwalService.onClose();
      },
    });
  }

  onLoadData() {
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService
      .get<IEmployeeDto[]>(
        `Employees/ListaEmpleados/${this.customerIdService.customerId}/${this.activo}/${this.tipoContrato}`
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

  showModalAddOrEditDataPrincipal(employeeId: string) {
    this.ref = this.dialogService.open(AddOrEditEmployeeOnlyImgComponent, {
      data: {
        applicationUserId: employeeId,
      },
      header: 'Actualizar Foto',
      baseZIndex: 10000,
      closeOnEscape: true,
      styleClass: 'modal-md',
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }

  onDelete(data: any) {
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService.delete(`Employees/${data.id}`).subscribe({
      next: () => {
        this.customToastService.onShowSuccess();
        this.customSwalService.onClose();
        this.onLoadData();
      },
      error: (err) => {
        this.customToastService.onShowError();
        this.customSwalService.onClose();
        console.log(err.error);
      },
    });
  }
  showModalAddOrEdit(data: any) {
    this.ref = this.dialogService.open(AddOrEditEmplopyeeComponent, {
      data: {
        id: data.id,
        tipoContrato: this.tipoContrato,
      },
      header: data.title,
      width: '100%',
      height: 'auto',
      baseZIndex: 10000,
      closeOnEscape: true,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      this.customToastService.onShowSuccess();
      this.onLoadData();
    });
  }
  showModalAddAccount() {
    this.ref = this.dialogService.open(AddAccountCustomerComponent, {
      data: {},
      header: 'Agregar cuenta de usuario',
      styleClass: 'modal-lg',
      baseZIndex: 10000,
      closeOnEscape: true,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }
  onModalAccountToEmployee(id: number, applicationUserId: string) {
    this.ref = this.dialogService.open(AccountToEmployeeComponent, {
      data: { id, applicationUserId },
      header: 'Asignar cuenta de usuario',
      styleClass: 'modal-lg',
      baseZIndex: 10000,
      closeOnEscape: true,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }
  showModalcontactEmployee(employee: any, header: string) {
    this.ref = this.dialogService.open(ContactEmployeeComponent, {
      data: {
        id: employee.id,
      },
      header: header + employee.fullName,
      styleClass: 'modal-w-100',
      baseZIndex: 10000,
      closeOnEscape: true,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }

  // TODO: MIGRAR METODO
  onModalUpdatePassword(applicationUserId: string) {
    this.ref = this.dialogService.open(UpdatePasswordModalComponent, {
      data: {
        applicationUserId,
      },
      header: 'Cambio de contraseña',
      styleClass: 'modal-md',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }

  calculateItemTotal(nameArea: string) {
    let total = 0;

    if (this.data) {
      for (let item of this.data) {
        if (item.areaResponsable.nameArea === nameArea) {
          total++;
        }
      }
    }
    return total;
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
