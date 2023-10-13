import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ImageModule } from 'primeng/image';
import { Observable, Subscription } from 'rxjs';
import { IInventarioExtintorDto } from 'src/app/interfaces/IInventarioExtintorDto.interface';
import { EExtintorPipe } from 'src/app/pipes/hidrantes.pipe';
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
import AddoreditInventarioExtintorComponent from './addoredit-inventario-extintor.component';

@Component({
  selector: 'app-inventario-extintor',
  templateUrl: './inventario-extintor.component.html',
  standalone: true,
  imports: [ComponentsModule, PrimeNgModule, ImageModule, EExtintorPipe],
  providers: [DialogService, MessageService, CustomToastService],
})
export default class InventarioExtintorComponent implements OnInit, OnDestroy {
  public customSwalService = inject(CustomSwalService);
  public customToastService = inject(CustomToastService);
  public authService = inject(AuthService);
  public dataService = inject(DataService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public customerIdService = inject(CustomerIdService);

  data: IInventarioExtintorDto[] = [];
  ref: DynamicDialogRef;
  subRef$: Subscription;
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  url = `${environment.base_urlImg}customers/`;

  ngOnInit(): void {
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.onLoadData();
    this.customerId$.subscribe((resp) => {
      this.onLoadData();
    });
  }

  onLoadData() {
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService
      .get<IInventarioExtintorDto[]>(
        'InventarioExtintor/GetAll/' + this.customerIdService.getcustomerId()
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
      .delete(`InventarioExtintor/${data.id}`)
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

  onModalAddOrEdit(data: any) {
    this.ref = this.dialogService.open(AddoreditInventarioExtintorComponent, {
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
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
