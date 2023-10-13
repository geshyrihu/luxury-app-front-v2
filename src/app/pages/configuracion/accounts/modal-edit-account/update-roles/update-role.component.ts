import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Subscription } from 'rxjs';
import { IRolesDto } from 'src/app/interfaces/IRolesDto.interface';
import {
  CustomSwalService,
  CustomToastService,
  DataService,
} from 'src/app/services/common-services';

@Component({
  selector: 'app-update-role',
  templateUrl: './update-role.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModule, ToastModule],
  providers: [MessageService, CustomToastService],
})
export default class UpdateRoleComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  private customToastService = inject(CustomToastService);
  public customSwalService = inject(CustomSwalService);

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
    this.customSwalService.onLoading();

    const url = `Accounts/AddRoleToUser/${this.applicationUserId}`;
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
