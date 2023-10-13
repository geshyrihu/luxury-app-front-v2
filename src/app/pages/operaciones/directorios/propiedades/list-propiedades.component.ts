import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subscription } from 'rxjs';
import { IDirectoryCondominiumDto } from 'src/app/interfaces/IDirectoryCondominiumDto.interface';
import {
  AuthService,
  CustomSwalService,
  CustomToastService,
  CustomerIdService,
  DataService,
} from 'src/app/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import AddOrEditPropiedadesComponent from './addoredit-propiedades.component';

@Component({
  selector: 'app-list-propiedades',
  templateUrl: './list-propiedades.component.html',
  standalone: true,
  imports: [CommonModule, ComponentsModule, PrimeNgModule],
  providers: [
    DialogService,
    MessageService,
    ConfirmationService,
    CustomToastService,
  ],
})
export default class ListPropiedadesComponent implements OnInit, OnDestroy {
  public customSwalService = inject(CustomSwalService);
  public customToastService = inject(CustomToastService);
  public authService = inject(AuthService);
  public dataService = inject(DataService);
  public messageService = inject(MessageService);
  public dialogService = inject(DialogService);
  public customerIdService = inject(CustomerIdService);
  data: IDirectoryCondominiumDto[] = [];
  ref: DynamicDialogRef;
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  subRef$: Subscription;

  ngOnInit(): void {
    this.onLoadData();
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }

  onLoadData() {
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService
      .get<IDirectoryCondominiumDto[]>(
        `DirectoryCondominium/GetAllAsync/${this.customerIdService.customerId}`
      )
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
    this.subRef$ = this.dataService
      .delete(`DirectoryCondominium/${data.id}`)
      .subscribe({
        next: () => {
          this.onLoadData();
          this.customSwalService.onClose();
          this.customToastService.onShowSuccess();
        },
        error: (err) => {
          console.log(err.error);
          this.customSwalService.onClose();
          this.customToastService.onShowError();
        },
      });
  }
  showModalAddOrEdit(data: any) {
    this.ref = this.dialogService.open(AddOrEditPropiedadesComponent, {
      data: {
        id: data.id,
      },
      header: data.title,
      styleClass: 'modal-md',
      closeOnEscape: true,
      autoZIndex: true,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
