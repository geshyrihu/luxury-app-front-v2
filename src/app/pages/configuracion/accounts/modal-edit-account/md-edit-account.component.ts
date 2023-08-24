import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { ISelectItemDto } from 'src/app/interfaces/ISelectItemDto.interface';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { SelectItemService } from 'src/app/services/select-item.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import AccessCustomerComponent from './customer-account/access-customer.component';
import UpdateAccountComponent from './update-account/update-account.component';
import UpdatePasswordAccountComponent from './update-password/update-password-account.component';
import UpdateRoleComponent from './update-roles/update-role.component';

@Component({
  selector: 'app-md-edit-account',
  templateUrl: './md-edit-account.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AccessCustomerComponent,
    UpdateRoleComponent,
    UpdatePasswordAccountComponent,
    UpdateAccountComponent,
  ],
  providers: [MessageService, ToastService],
})
export default class MdEditAccountComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  private selectItemService = inject(SelectItemService);
  private swalService = inject(SwalService);
  public config = inject(DynamicDialogConfig);
  public messageService = inject(MessageService);
  public ref = inject(DynamicDialogRef);
  public toastService = inject(ToastService);
  public authService = inject(AuthService);

  cb_emplyee: ISelectItemDto[] = [];
  data: any;
  applicationUserId: string = '';
  email: string = '';
  subRef$: Subscription;

  ngOnInit(): void {
    this.applicationUserId = this.config.data.applicationUserId;
    this.email = this.config.data.email;
    this.onLoadData();
  }

  onLoadSelectItem() {
    this.subRef$ = this.selectItemService
      .onGetSelectItem('GetAllEmployeeActive')
      .subscribe((resp) => {
        this.cb_emplyee = resp;
      });
  }
  onLoadData() {
    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .get('Accounts/EditarCuenta/' + this.applicationUserId)
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;
          this.swalService.onClose();
        },
        error: (err) => {
          console.log(err.error);
          this.swalService.onClose();
          this.toastService.onShowError();
        },
      });
  }

  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
