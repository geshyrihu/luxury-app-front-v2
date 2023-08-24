import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Subscription } from 'rxjs';
import { IRolesDto } from 'src/app/interfaces/IRolesDto.interface';
import { DataService } from 'src/app/services/data.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-update-role',
  templateUrl: './update-role.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModule, ToastModule],
  providers: [MessageService, ToastService],
})
export default class UpdateRoleComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  private toastService = inject(ToastService);
  public swalService = inject(SwalService);

  roles: IRolesDto[] = [];
  rolesUpdate: IRolesDto[] = [];
  checked = false;

  @Input()
  applicationUserId: string = '';
  subRef$: Subscription;

  ngOnInit(): void {
    this.getRoles();
  }
  getRoles() {
    this.subRef$ = this.dataService
      .get('Accounts/GetRole/' + this.applicationUserId)
      .subscribe((resp: any) => {
        this.roles = resp.body;
        this.rolesUpdate = this.roles;
      });
  }

  updateRole(roles: any) {
    this.swalService.onLoading();

    const url = `Accounts/AddRoleToUser/${this.applicationUserId}`;
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
