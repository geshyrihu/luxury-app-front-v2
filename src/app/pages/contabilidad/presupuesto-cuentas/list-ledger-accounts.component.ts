import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import AddoreditLedgerAccountsComponent from './addoredit-ledger-accounts.component';

@Component({
  selector: 'app-list-ledger-accounts',
  templateUrl: './list-ledger-accounts.component.html',
  standalone: true,
  imports: [CommonModule, ComponentsModule, PrimeNgModule],
  providers: [DialogService, MessageService, ToastService],
})
export default class ListLedgerAccountsComponent implements OnInit, OnDestroy {
  public toastService = inject(ToastService);
  public swalService = inject(SwalService);
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
    this.swalService.onLoading();
    this.state = state;
    this.subRef$ = this.dataService
      .get('Cuentas/AllCuentas/' + (state ? 0 : 1))
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
    this.swalService.onLoading();
    this.subRef$ = this.dataService.delete(`Cuentas/${data.id}`).subscribe({
      next: () => {
        this.toastService.onShowSuccess();
        this.swalService.onClose();
        this.onLoadData(this.state);
      },
      error: (err) => {
        this.toastService.onShowError();
        this.swalService.onClose();
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
        this.toastService.onShowSuccess();
        this.onLoadData(this.state);
      }
    });
  }
  subRef$: Subscription;
  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
