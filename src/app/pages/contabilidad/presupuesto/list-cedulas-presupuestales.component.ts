import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { ISelectItemDto } from 'src/app/interfaces/ISelectItemDto.interface';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { SelectItemService } from 'src/app/services/select-item.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';

const date = new Date();

@Component({
  selector: 'app-list-cedulas-presupuestales',
  templateUrl: './list-cedulas-presupuestales.component.html',
  standalone: true,
  imports: [ComponentsModule, RouterModule, CommonModule, PrimeNgModule],
  providers: [DialogService, MessageService, ToastService],
})
export default class ListCedulasPresupuestalesComponent
  implements OnInit, OnDestroy
{
  public toastService = inject(ToastService);
  private dataService = inject(DataService);
  public authService = inject(AuthService);
  private selectItemService = inject(SelectItemService);
  public messageService = inject(MessageService);
  public dialogService = inject(DialogService);
  public swalService = inject(SwalService);

  subRef$: Subscription;

  cb_customer: any[] = [];
  applicationUserId: string =
    this.authService.userTokenDto.infoUserAuthDto.applicationUserId;
  ref: DynamicDialogRef;
  data: any[] = [];
  year: number = date.getFullYear();
  cb_Year: any[] = [];

  onLoadSelectItem() {
    this.selectItemService
      .onGetSelectItem('customers')
      .subscribe((items: ISelectItemDto[]) => {
        this.cb_customer = items;
      });
    this.selectItemService.onGetSelectItem(`GetAllYears`).subscribe({
      next: (resp: any) => {
        this.cb_Year = resp.body;
      },
    });
  }
  ngOnInit(): void {
    this.onLoadSelectItem();
    this.onLoadData();
  }
  onChangeYear() {
    this.onLoadData();
  }
  onLoadData() {
    this.swalService.onLoading();
    this.subRef$ = this.dataService
      .get(`CedulaPresupuestal/GetAllAsync/`)
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

  onDelete(data: any) {
    this.subRef$ = this.dataService
      .delete(`CedulaPresupuestal/${data.id}`)
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
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
