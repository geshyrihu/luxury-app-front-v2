import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { NgbDropdownModule, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { Subscription } from 'rxjs';
import { ISelectItemDto } from 'src/app/interfaces/ISelectItemDto.interface';
import { IAccountDto } from 'src/app/interfaces/account-dto.interface';
import CardEmployeeComponent from 'src/app/pages/operaciones/directorios/empleados/card-employee/card-employee.component';
import PhoneFormatPipe from 'src/app/pipes/phone-format.pipe';
import { DataService } from 'src/app/services/data.service';
import { DataFilterService } from 'src/app/services/dataFilter.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import ComponentsModule from 'src/app/shared/components.module';
import DropdownRouteComponent from 'src/app/shared/ngb-dropdown-menu/dropdown-route.component';
import { environment } from 'src/environments/environment';
import CreateAccountComponent from '../create-account/create-account.component';
import AddOrEditEmailDataComponent from '../email-data/add-or-edit-email-data.component';
import MdEditAccountComponent from '../modal-edit-account/md-edit-account.component';
@Component({
  selector: 'app-list-account',
  templateUrl: './list-account.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ComponentsModule,
    TableModule,
    ToastModule,
    NgbDropdownModule,
    DropdownRouteComponent,
    PhoneFormatPipe,
    NgbTooltip,
  ],
  providers: [DialogService, MessageService, ToastService],
})
export default class ListAccountComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public swalService = inject(SwalService);
  public toastService = inject(ToastService);
  public dataFilterService = inject(DataFilterService);

  cb_customer: ISelectItemDto[] = [];
  cb_profession: ISelectItemDto[] = [];
  data: IAccountDto[] = [];
  applicationUserId: string = '';
  employeeId: number = 0;
  ref: DynamicDialogRef;
  state: boolean = true;
  title: string = '';
  urlImgApi = environment.base_urlImg + 'Administration/accounts/';
  subRef$: Subscription;

  ngOnInit(): void {
    this.onLoadData();
  }
  onCardEmployee(employeeId: number) {
    this.ref = this.dialogService.open(CardEmployeeComponent, {
      data: {
        employeeId,
      },
      header: 'Colaborador',
      styleClass: 'modal-sm',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
  }
  onCreateAccount() {
    this.ref = this.dialogService.open(CreateAccountComponent, {
      header: 'Crear Cuenta',
      styleClass: 'modal-sm',
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
  onModalEmailData(applicationUserId: string) {
    this.ref = this.dialogService.open(AddOrEditEmailDataComponent, {
      data: {
        applicationUserId: applicationUserId,
      },
      header: 'Datos de Correo',
      styleClass: 'shadow-lg modal-md',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      closeOnEscape: true,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.toastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }
  onModalEditAccount(applicationUserId: string, email: string) {
    this.ref = this.dialogService.open(MdEditAccountComponent, {
      data: {
        applicationUserId: applicationUserId,
        email: email,
      },
      header: 'Editar Cuenta',
      width: '100%',
      height: '100%',
      styleClass: 'shadow-lg',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      closeOnEscape: true,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      this.toastService.onShowSuccess();
      this.onLoadData();
    });
  }

  onLoadData(): void {
    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .get<IAccountDto[]>(`Accounts/GetAll`)
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;
          this.swalService.onClose();
        },
        error: (err) => {
          this.toastService.onShowError();
          this.swalService.onClose();
          console.log(err.error);
        },
      });
  }

  onToBlockAccount(applicationUserId: string): void {
    this.subRef$ = this.dataService
      .get('Accounts/ToBlockAccount/' + applicationUserId)
      .subscribe({
        next: () => {
          const registro = this.data.find(
            (item) => item.id === applicationUserId
          );

          // Verifica si se encontró el registro
          if (registro) {
            // Modifica la propiedad 'active'
            registro.active = !registro.active; // o cualquier otro valor que desees asignar
          } else {
          }
          this.toastService.onShowSuccess();
        },
        error: (err) => {
          this.toastService.onShowError();
          console.log(err.error);
        },
      });
  }

  onToUnlockAccount(applicationUserId: string): void {
    this.subRef$ = this.dataService
      .get('Accounts/ToUnlockAccount/' + applicationUserId)
      .subscribe({
        next: (resp: any) => {
          // this.onLoadData();
          // Encuentra el registro por su 'id'
          const registro = this.data.find(
            (item) => item.id === applicationUserId
          );

          // Verifica si se encontró el registro
          if (registro) {
            // Modifica la propiedad 'active'
            registro.active = !registro.active; // o cualquier otro valor que desees asignar
          } else {
            console.log(
              'No se encontró el registro con el ID:',
              applicationUserId
            );
          }
          this.toastService.onShowSuccess();
        },
        error: (err) => {
          this.toastService.onShowError();
          console.log(err.error);
        },
      });
  }
  onDelete(applicationUserId: string): void {
    this.subRef$ = this.dataService
      .delete('Accounts/' + applicationUserId)
      .subscribe({
        next: () => {
          this.toastService.onShowSuccess();
          this.onLoadData();
        },
        error: (err) => {
          this.toastService.onShowError();
          console.log(err.error);
        },
      });
  }

  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
