import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Subscription } from 'rxjs';
import { IAddCustomerPermisoToUserDto } from 'src/app/interfaces/IAddCustomerPermisoToUserDto.interface';
import {
  CustomSwalService,
  CustomToastService,
  DataService,
} from 'src/app/services/common-services';
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
  providers: [MessageService, CustomToastService],
})
export default class AccessCustomerComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  public customToastService = inject(CustomToastService);
  public customSwalService = inject(CustomSwalService);

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
    this.customSwalService.onLoading();
    const url = `AccesoCustomers/AddCustomerAccesoToUser/${this.applicationUserId}`;
    this.subRef$ = this.dataService.post(url, roles).subscribe({
      next: () => {
        this.customToastService.onShowSuccess();
        this.customSwalService.onClose();
      },
      error: (err) => {
        this.customToastService.onShowError();
        this.customSwalService.onClose();
        console.log(err.error);
      },
    });
  }
  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
