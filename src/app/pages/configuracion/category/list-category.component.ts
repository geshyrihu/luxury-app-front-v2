import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { ICategoryDto } from 'src/app/interfaces/ICategory.interface';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { SwalService } from 'src/app/services/swal.service';
import { ToastService } from 'src/app/services/toast.service';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import AddOrEditCategoryComponent from './addoredit-category.component';

@Component({
  selector: 'app-list-category',
  templateUrl: './list-category.component.html',
  imports: [CommonModule, ComponentsModule, PrimeNgModule],
  providers: [DialogService, MessageService, ConfirmationService, ToastService],
  standalone: true,
})
export default class ListCategoryComponent implements OnInit, OnDestroy {
  public authService = inject(AuthService);
  private dataService = inject(DataService);
  private toastService = inject(ToastService);
  public dialogService = inject(DialogService);
  public swalService = inject(SwalService);

  data: ICategoryDto[] = [];
  ref: DynamicDialogRef;
  subRef$: Subscription;

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.swalService.onLoading();
    this.subRef$ = this.dataService.get('Categories').subscribe({
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

  onDelete(data: ICategoryDto) {
    this.swalService.onLoading();
    this.subRef$ = this.dataService.delete(`Categories/${data.id}`).subscribe({
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
    this.ref = this.dialogService.open(AddOrEditCategoryComponent, {
      data: {
        id: data.id,
      },
      header: data.title,
      styleClass: 'modal-md',
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

  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
