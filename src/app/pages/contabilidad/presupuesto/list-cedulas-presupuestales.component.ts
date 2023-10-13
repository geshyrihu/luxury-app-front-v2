import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { ISelectItemDto } from 'src/app/interfaces/ISelectItemDto.interface';
import {
  AuthService,
  CustomSwalService,
  CustomToastService,
  DataService,
  SelectItemService,
} from 'src/app/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';

const date = new Date();

@Component({
  selector: 'app-list-cedulas-presupuestales',
  templateUrl: './list-cedulas-presupuestales.component.html',
  standalone: true,
  imports: [ComponentsModule, RouterModule, CommonModule, PrimeNgModule],
  providers: [DialogService, MessageService, CustomToastService],
})
export default class ListCedulasPresupuestalesComponent
  implements OnInit, OnDestroy
{
  public customToastService = inject(CustomToastService);
  private dataService = inject(DataService);
  public authService = inject(AuthService);
  private selectItemService = inject(SelectItemService);
  public messageService = inject(MessageService);
  public dialogService = inject(DialogService);
  public customSwalService = inject(CustomSwalService);

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
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService
      .get(`CedulaPresupuestal/GetAllAsync/`)
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

  onDelete(data: any) {
    this.subRef$ = this.dataService
      .delete(`CedulaPresupuestal/${data.id}`)
      .subscribe({
        next: () => {
          this.customToastService.onShowSuccess();
          this.onLoadData();
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
        },
      });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
