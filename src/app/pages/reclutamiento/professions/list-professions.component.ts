import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { IProfessionDto } from 'src/app/interfaces/IProfessionDto.interface';
import {
  AuthService,
  CustomSwalService,
  CustomToastService,
  DataService,
} from 'src/app/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import AddOrEditProfessionsComponent from './addoredit-professions.component';
import DescripcionPuestoComponent from './descripcion-puesto.component';

@Component({
  selector: 'app-professions',
  templateUrl: './list-professions.component.html',
  standalone: true,
  imports: [CommonModule, ComponentsModule, NgbAlertModule, PrimeNgModule],
  providers: [DialogService, MessageService, CustomToastService],
})
export default class ListProfessionsComponent implements OnInit, OnDestroy {
  public customSwalService = inject(CustomSwalService);
  public customToastService = inject(CustomToastService);
  public authService = inject(AuthService);
  public dataService = inject(DataService);
  public messageService = inject(MessageService);
  public dialogService = inject(DialogService);

  data: any[] = [];
  ref: DynamicDialogRef;
  subRef$: Subscription;

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService
      .get<IProfessionDto>('Professions/')
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

  onDelete(data: IProfessionDto) {
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService.delete('Professions/' + data.id).subscribe({
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

  showModalAddOrEdit(data: any) {
    this.ref = this.dialogService.open(AddOrEditProfessionsComponent, {
      data: {
        id: data.id,
      },
      header: data.title,
      width: '100%',
      height: '100%',
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

  onModalDescripcionPuestos(data: any) {
    this.ref = this.dialogService.open(DescripcionPuestoComponent, {
      data: {
        id: data.id,
      },
      header: data.nameProfession,
      width: '100%',
      height: '100%',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
