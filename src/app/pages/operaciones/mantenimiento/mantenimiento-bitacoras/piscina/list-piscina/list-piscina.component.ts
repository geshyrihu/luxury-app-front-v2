import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TooltipModule } from '@swimlane/ngx-charts';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ImageModule } from 'primeng/image';
import { Observable, Subscription } from 'rxjs';
import { ETypePiscinaPipe } from 'src/app/pipes/type-piscina.pipe';
import {
  AuthService,
  CustomSwalService,
  CustomToastService,
  CustomerIdService,
  DataService,
} from 'src/app/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import { environment } from 'src/environments/environment';
import AddOrEditPiscinaComponent from '../addoredit-piscina/addoredit-piscina.component';

@Component({
  selector: 'app-list-piscina',
  templateUrl: './list-piscina.component.html',
  standalone: true,
  imports: [
    PrimeNgModule,
    ComponentsModule,
    ImageModule,
    CommonModule,
    ETypePiscinaPipe,
    RouterModule,
    TooltipModule,
  ],
  providers: [DialogService, MessageService, CustomToastService],
})
export default class ListPiscinaComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  public authService = inject(AuthService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public customSwalService = inject(CustomSwalService);
  public customToastService = inject(CustomToastService);
  public customerIdService = inject(CustomerIdService);

  data: any[] = [];
  ref: DynamicDialogRef;
  subRef$: Subscription;
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  urlBaseImg = `${
    environment.base_urlImg
  }customers/${this.customerIdService.getcustomerId()}/piscina/`;
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
      .get<any[]>('piscina/getall/' + this.customerIdService.customerId)
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
  onModalAddOrEdit(data: any) {
    this.ref = this.dialogService.open(AddOrEditPiscinaComponent, {
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

  onDelete(data: any) {
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService.delete(`piscina/${data.id}`).subscribe({
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

  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
