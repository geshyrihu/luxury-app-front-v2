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
import { environment } from 'src/environments/environment';
import AddOrEditComunicadoComponent from './add-or-edit-comunicado.component';
@Component({
  selector: 'app-comunicado',
  templateUrl: './comunicado.component.html',
  standalone: true,
  imports: [ComponentsModule, CommonModule, PrimeNgModule],
  providers: [DialogService, MessageService, CustomToastService],
})
export default class ComunicadoComponent implements OnInit, OnDestroy {
  public customSwalService = inject(CustomSwalService);
  public customToastService = inject(CustomToastService);
  public authService = inject(AuthService);
  public dataService = inject(DataService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  data: any[] = [];
  ref: DynamicDialogRef;
  subRef$: Subscription;

  filePath: string = environment.base_urlImg + 'Administration/comunicados/';
  ngOnInit(): void {
    this.onLoadData();
  }
  onLoadData() {
    this.customSwalService.onLoading();

    this.subRef$ = this.dataService.get('Comunicado').subscribe({
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
    this.subRef$ = this.dataService.delete(`Comunicado/${data.id}`).subscribe({
      next: () => {
        this.customToastService.onShowSuccess();
        this.customSwalService.onClose();
        this.onLoadData();
      },
      error: (err) => {
        this.customToastService.onShowError();
        this.customSwalService.onClose();
        console.log(err.error);
      },
    });
  }

  onModalAddOrEdit(data: any) {
    this.ref = this.dialogService.open(AddOrEditComunicadoComponent, {
      data: {
        id: data.id,
      },
      header: data.title,
      styleClass: 'modal-md ',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
