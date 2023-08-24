import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Subscription } from 'rxjs';
import { IAddCustomerPermisoToUserDto } from 'src/app/interfaces/IAddCustomerPermisoToUserDto.interface';
import { DataService } from 'src/app/services/data.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
@Component({
  selector: 'app-access-customer',
  templateUrl: './access-customer.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    ToastModule,
  ],
  providers: [MessageService, ToastService],
})
export default class AccessCustomerComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  public toastService = inject(ToastService);
  public swalService = inject(SwalService);

  clientes: IAddCustomerPermisoToUserDto[] = [];
  ActualizarClientes: IAddCustomerPermisoToUserDto[] = [];
  checked = false;
  @Input()
  applicationUserId: string = '';
  subRef$: Subscription;
  ngOnInit(): void {
    this.onGetAccesCustomer();
  }
  onGetAccesCustomer() {
    this.subRef$ = this.dataService
      .get('AccesoCustomers/GetCustomers/' + this.applicationUserId)
      .subscribe({
        next: (resp: any) => {
          this.clientes = resp.body;
          this.ActualizarClientes = this.clientes;
        },
      });
  }

  onUpdateAcceso(roles: any) {
    this.swalService.onLoading();
    const url = `AccesoCustomers/AddCustomerAccesoToUser/${this.applicationUserId}`;
    this.subRef$ = this.dataService.post(url, roles).subscribe({
      next: () => {
        this.toastService.onShowSuccess();
        this.swalService.onClose();
      },
      error: (err) => {
        this.toastService.onShowError();
        this.swalService.onClose();
        console.log(err.error);
      },
    });
  }
  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
