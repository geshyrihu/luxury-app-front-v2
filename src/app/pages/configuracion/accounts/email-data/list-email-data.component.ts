import { Component, inject } from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import AddOrEditEmailDataComponent from './add-or-edit-email-data.component';

@Component({
  selector: 'app-list-email-data',
  templateUrl: './list-email-data.component.html',
  standalone: true,
  imports: [ComponentsModule, NgbTooltipModule, PrimeNgModule],
  providers: [DialogService, MessageService, ToastService],
})
export default class ListEmailDataComponent {
  public swalService = inject(SwalService);
  public toastService = inject(ToastService);
  public authService = inject(AuthService);
  private dataService = inject(DataService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);

  data: any[] = [];
  ref: DynamicDialogRef;
  subRef$: Subscription;

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.swalService.onLoading();
    this.subRef$ = this.dataService.get('EmailData/GetAsyncAll').subscribe({
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
  onDelete(id: number) {
    this.swalService.onLoading();
    this.subRef$ = this.dataService.delete(`EmailData/${id}`).subscribe({
      next: () => {
        this.toastService.onShowSuccess();
        this.swalService.onClose();
        this.onLoadData();
      },
      error: (err) => {
        this.toastService.onShowError();
        this.swalService.onClose();
        console.log(err.error);
      },
    });
  }

  onModalAddOrEdit(data: any) {
    this.ref = this.dialogService.open(AddOrEditEmailDataComponent, {
      data: {
        applicationUserId: data.applicationUserId,
      },
      header: data.title,
      styleClass: 'modal-md ',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.toastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }

  onSendTestEmail(applicationUserId: string) {
    this.swalService.onLoading();

    this.subRef$ = this.dataService
      .get(
        'SendEmail/SendTestMail/' +
          applicationUserId +
          '/' +
          this.authService.infoUserAuthDto.email
      )
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
