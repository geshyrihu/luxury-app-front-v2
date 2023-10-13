import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { Observable, Subscription } from 'rxjs';
import { CustomerIdService } from 'src/app/services/common-services';
import { CustomSwalService } from 'src/app/services/custom-swal.service';
import { CustomToastService } from 'src/app/services/custom-toast.service';
import { DataService } from 'src/app/services/data.service';
import ComponentsModule from 'src/app/shared/components.module';

@Component({
  selector: 'app-llaves',
  templateUrl: './llaves.component.html',
  standalone: true,
  imports: [ComponentsModule, TableModule],
  providers: [MessageService, CustomToastService],
})
export default class LlavesComponent implements OnInit, OnDestroy {
  public customerIdService = inject(CustomerIdService);
  public dataService = inject(DataService);
  public customSwalService = inject(CustomSwalService);
  public customToastService = inject(CustomToastService);
  data: any[] = [];
  subRef$: Subscription;
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();

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
        'EntregaRecepcion/InventarioLlaves/' + this.customerIdService.customerId
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
        if (customer.descripcion === name) {
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
