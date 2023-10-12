import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { CustomerIdService } from 'src/app/services/customer-id.service';
import { DataService } from 'src/app/services/data.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-account-to-employee',
  templateUrl: './account-to-employee.component.html',
  standalone: true,
  imports: [CommonModule],
  providers: [ToastService],
})
export default class AccountToEmployeeComponent implements OnInit {
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  private dataService = inject(DataService);
  private toastService = inject(ToastService);
  private swalService = inject(SwalService);
  private customerIdService = inject(CustomerIdService);

  submitting: boolean = false;
  id: number = 0;
  applicationUserId: string = this.config.data.applicationUserId;
  applicationUserList: any[] = [];
  subRef$: Subscription;

  ngOnInit() {
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();

    this.onLoadAccount();
  }
  onLoadData() {
    this.subRef$ = this.dataService.get(`Banks/${this.id}`).subscribe({
      next: (resp: any) => {},
      error: (err) => {
        this.toastService.onShowError();
        console.log(err.error);
      },
    });
  }

  onRadioChange(newValue: string) {
    // Esta función se llamará cada vez que cambie el valor del radio button
    this.applicationUserId = newValue;
    console.log('Nuevo valor seleccionado:', newValue);
    // Realiza las acciones que desees con el nuevo valor aquí
  }

  onSubmit() {
    this.id = this.config.data.id;
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    this.swalService.onLoading();

    this.subRef$ = this.dataService
      .get(
        `Accounts/UpdateAccountToEmployee/${this.id}/${this.applicationUserId}`
      )
      .subscribe({
        next: () => {
          this.swalService.onClose();
          this.ref.close(true);
        },
        error: (err) => {
          console.log(err.error);
          this.toastService.onShowError();
          // Habilitar el botón nuevamente al finalizar el envío del formulario
          this.submitting = false;
          this.swalService.onClose();
        },
      });
  }

  onLoadAccount() {
    this.subRef$ = this.dataService
      .get(
        `Employees/GetListAccountUser/${this.customerIdService.customerId}/${this.id}`
      )
      .subscribe({
        next: (resp: any) => {
          this.applicationUserList = resp.body;
        },
        error: (err) => {
          console.log(err.error);
          this.toastService.onShowError();
          // Habilitar el botón nuevamente al finalizar el envío del formulario
        },
      });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
