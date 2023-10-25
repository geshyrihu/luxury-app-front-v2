import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { Observable, Subscription } from 'rxjs';
import { EMonths } from 'src/app/enums/meses.enum';
import { onGetSelectItemFromEnum } from 'src/app/helpers/enumeration';
import { ISelectItemDto } from 'src/app/interfaces/ISelectItemDto.interface';
import { CurrencyMexicoPipe } from 'src/app/pipes/currencyMexico.pipe';
import { EInventoryCategoryPipe } from 'src/app/pipes/inventoryCategory.pipe';
import { ERecurrencePipe } from 'src/app/pipes/recurrence.pipe';
import { SanitizeHtmlPipe } from 'src/app/pipes/sanitize-html.pipe';
import {
  AuthService,
  CustomToastService,
  CustomerIdService,
  DataService,
} from 'src/app/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import AddoreditMaintenancePreventiveComponent from '../addoredit-maintenance-preventive.component';
const date = new Date();

@Component({
  selector: 'app-listado-anual-mantenimiento',
  templateUrl: './listado-anual-mantenimiento.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ComponentsModule,
    TableModule,
    EInventoryCategoryPipe,
    ERecurrencePipe,
    CurrencyMexicoPipe,
    SanitizeHtmlPipe,
  ],
  providers: [DialogService, MessageService, CustomToastService],
})
export default class ListadoAnualMantenimientoComponent
  implements OnInit, OnDestroy
{
  public customToastService = inject(CustomToastService);
  public authService = inject(AuthService);
  public dataService = inject(DataService);
  public customerIdService = inject(CustomerIdService);
  public messageService = inject(MessageService);
  public dialogService = inject(DialogService);

  data: any[] = [];
  ref: DynamicDialogRef;
  subRef$: Subscription;
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  month = date.getMonth() + 1;
  months: ISelectItemDto[] = onGetSelectItemFromEnum(EMonths);

  ngOnInit() {
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }
  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService
      .get(
        `MaintenanceCalendars/${this.customerIdService.getcustomerId()}/${
          this.month
        }`
      )
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;
          this.customToastService.onClose();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }
  calculateCustomerTotal(name) {
    let total = 0;

    if (this.data) {
      for (let customer of this.data) {
        if (customer.inventoryCategory === name) {
          total++;
        }
      }
    }

    return total;
  }
  onDelete(data: any) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService
      .delete(`MaintenanceCalendars/${data.id}`)
      .subscribe({
        next: () => {
          this.onLoadData();
          this.customToastService.onCloseToSuccess();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }

  showModalAddOrEdit(data: any) {
    this.ref = this.dialogService.open(
      AddoreditMaintenancePreventiveComponent,
      {
        data: {
          id: data.id,
          task: data.task,
          idMachinery: data.idMachinery,
        },
        header: data.title,
        styleClass: 'modal-mdInventory',
        closeOnEscape: true,
      }
    );
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }
  selectMonth() {
    this.month = this.month;
    this.onLoadData();
  }

  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
