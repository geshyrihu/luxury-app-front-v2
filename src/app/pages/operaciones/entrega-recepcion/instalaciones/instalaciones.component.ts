import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { Observable, Subscription } from 'rxjs';
import { EInventoryCategoryPipe } from 'src/app/pipes/inventoryCategory.pipe';
import {
  CustomSwalService,
  CustomToastService,
  CustomerIdService,
  DataService,
} from 'src/app/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-instalaciones',
  templateUrl: './instalaciones.component.html',
  standalone: true,
  imports: [ComponentsModule, TableModule, EInventoryCategoryPipe],
  providers: [MessageService, CustomToastService],
})
export default class InstalacionesComponent implements OnInit, OnDestroy {
  public customerIdService = inject(CustomerIdService);
  public dataService = inject(DataService);
  public messageService = inject(MessageService);
  public customSwalService = inject(CustomSwalService);
  public customToastService = inject(CustomToastService);

  data: any[] = [];
  subRef$: Subscription;
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  base_urlImg = environment.base_urlImg;

  ngOnInit() {
    this.onLoadData();
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }
  onLoadData() {
    this.customSwalService.onLoading();
    this.subRef$ = this.dataService
      .get(
        'EntregaRecepcion/InventarioInstalaciones/' +
          this.customerIdService.customerId
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

  calcularEquiposTotal(name) {
    let total = 0;

    if (this.data) {
      for (let customer of this.data) {
        if (customer.clasificacion === name) {
          total++;
        }
      }
    }

    return total;
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
