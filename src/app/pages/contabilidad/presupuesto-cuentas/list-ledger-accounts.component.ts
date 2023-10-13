import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import {
  AuthService,
  CustomSwalService,
  CustomToastService,
  DataService,
} from 'src/app/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import AddoreditLedgerAccountsComponent from './addoredit-ledger-accounts.component';

@Component({
  selector: 'app-list-ledger-accounts',
  templateUrl: './list-ledger-accounts.component.html',
  standalone: true,
  imports: [CommonModule, ComponentsModule, PrimeNgModule],
  providers: [DialogService, MessageService, CustomToastService],
})
export default class ListLedgerAccountsComponent implements OnInit, OnDestroy {
  public customToastService = inject(CustomToastService);
  public customSwalService = inject(CustomSwalService);
  private dataService = inject(DataService);
  public messageService = inject(MessageService);
  public dialogService = inject(DialogService);
  public authService = inject(AuthService);

  data: any[] = [];
  ref: DynamicDialogRef;
  state: boolean = true;

  ngOnInit(): void {
    this.onLoadData(this.state);
  }

  onLoadData(state: boolean) {
    this.customSwalService.onLoading();
    this.state = state;
    this.subRef$ = this.dataService
      .get('Cuentas/AllCuentas/' + (state ? 0 : 1))
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
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService.delete(`Cuentas/${data.id}`).subscribe({
      next: () => {
        this.customToastService.onShowSuccess();
        this.customSwalService.onClose();
        this.onLoadData(this.state);
      },
      error: (err) => {
        this.customToastService.onShowError();
        this.customSwalService.onClose();
        console.log(err.error);
      },
    });
  }

  showModalAddOrEdit(data: any) {
    this.ref = this.dialogService.open(AddoreditLedgerAccountsComponent, {
      data: {
        id: data.id,
      },
      header: data.title,
      height: 'auto',
      styleClass: 'modal-md',
      baseZIndex: 10000,
      closeOnEscape: true,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData(this.state);
      }
    });
  }
  subRef$: Subscription;
  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
