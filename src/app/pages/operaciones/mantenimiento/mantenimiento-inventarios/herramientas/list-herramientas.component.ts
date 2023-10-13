import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subscription } from 'rxjs';
import {
  AuthService,
  CustomSwalService,
  CustomToastService,
  CustomerIdService,
  DataService,
  ReporteHerramientasPdfService,
} from 'src/app/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import { environment } from 'src/environments/environment';
import AddoreditToolsComponent from './addoredit-herramienta.component';

@Component({
  selector: 'app-list-herramientas',
  templateUrl: './list-herramientas.component.html',
  standalone: true,
  imports: [ComponentsModule, CommonModule, RouterModule, PrimeNgModule],
  providers: [DialogService, MessageService, CustomToastService],
})
export default class ListerramientasComponent implements OnInit, OnDestroy {
  public customSwalService = inject(CustomSwalService);
  public customToastService = inject(CustomToastService);
  public authService = inject(AuthService);
  public dataService = inject(DataService);
  public messageService = inject(MessageService);
  public dialogService = inject(DialogService);
  public customerIdService = inject(CustomerIdService);
  public reporteHerramientasPdfService = inject(ReporteHerramientasPdfService);
  base_urlImg = '';
  data: any[] = [];

  ref: DynamicDialogRef;
  subRef$: Subscription;
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();

  ngOnInit(): void {
    this.onLoadData();
    this.urlImg(this.customerIdService.getcustomerId());
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.customerId$.subscribe((resp) => {
      this.urlImg(this.customerIdService.getcustomerId());
      this.onLoadData();
    });
  }
  urlImg(customerId: number): void {
    this.base_urlImg = `${environment.base_urlImg}customers/${customerId}/tools/`;
  }
  onLoadData() {
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService
      .get(`Tools/${this.customerIdService.customerId}`)
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;
          this.reporteHerramientasPdfService.setData(this.data);
          this.customSwalService.onClose();
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
          this.customSwalService.onClose();
        },
      });
  }

  onDelete(data: any) {
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService.delete('Tools/' + data.id).subscribe({
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
    this.ref = this.dialogService.open(AddoreditToolsComponent, {
      data: {
        id: data.id,
      },
      header: data.title,
      styleClass: 'modal-mdInventory',
      baseZIndex: 10000,
      closeOnEscape: true,
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
